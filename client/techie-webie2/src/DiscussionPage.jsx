import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "./axiosConfig.js";
import CreateMessage from "./CreateMessage";
import MessageList from "./MessageList";
import NavPanel from "./NavPanel";
import Information from "./Information";
import "./DiscussionPage.css";

function DiscussionPage({ onLogout, username, isAdmin }) {
  const { discussionId } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/api/discussions/discussionId/${discussionId}`
      );
      navigate("/main");
    } catch (error) {
      console.error("Error deleting discussion:", error);
    }
  };

  const fetchDiscussionAndMessages = async () => {
    try {
      const discussionResponse = await axios.get(
        `http://localhost:4000/api/discussions/discussionId/${discussionId}`
      );
      setDiscussion(discussionResponse.data);
      const messagesResponse = await axios.get(
        `http://localhost:4000/api/messages?discussionId=${discussionId}`
      );
      setMessages(messagesResponse.data);

      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussionAndMessages();
  }, [discussionId]);

  // Affiche les messages périodiquement (chaque 2 secondes)
  useEffect(() => {
    const interval = setInterval(fetchDiscussionAndMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  const addMessages = (newMessage) => {
    setMessages([...messages, newMessage]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !discussion) {
    console.error("Error fetching discussion data:", error);
    return <div>Error fetching discussion data.</div>;
  }

  const handleSearch = (searchQuery) => {
    console.log("Search query:", searchQuery);
  };

  return (
    <div>
      <section className="header">
        <NavPanel
          className="nav-panel"
          onLogout={onLogout}
          isAdmin={isAdmin}
          onSearch={handleSearch}
          username={username}
        />
      </section>
      <div className="forum">
        <section className="Information">
          <Information />
        </section>
        <section className="Msg">
          <section className="DiscTitleDel">
            <h2>{discussion.title}</h2>
            {(isAdmin || username === discussion.username) && (
              <button className="DeleteBtn" onClick={handleDelete}>
                Delete Discussion
              </button>
            )}
          </section>
          <p>{discussion.content}</p>
          <Link
            className="linkUsername"
            to={`/user?username=${discussion.username}`}
          >
            {discussion.username}
          </Link>
          <section className="CreateMsg">
            <CreateMessage
              onCreate={addMessages}
              discussionId={discussionId}
              username={username}
            />
          </section>

          <article className="MessageList">
            <MessageList
              messages={messages}
              username={username}
              isAdmin={isAdmin}
            />
          </article>
        </section>
      </div>
    </div>
  );
}

export default DiscussionPage;
