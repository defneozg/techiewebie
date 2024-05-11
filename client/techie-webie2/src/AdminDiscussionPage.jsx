import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "./axiosConfig.js";
import CreateMessage from "./CreateMessage";
import MessageList from "./MessageList";
import NavPanel from "./NavPanel";
import Information from "./Information";
import "./DiscussionPage.css";

function AdminDiscussionPage({ onLogout, username, isAdmin }) {
  const { discussionId } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscussionAndMessages = async () => {
      try {
        console.log(discussionId);
        const discussionResponse = await axios.get(
          `http://localhost:4000/api/admindiscussions/discussionId/${discussionId}`
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
    fetchDiscussionAndMessages();
  }, [discussionId]);

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
    // TODO search
    console.log("Search query:", searchQuery);
  };

  return (
    <div className="AdminDiscussionPage">
      <section className="header">
        <NavPanel
          className="nav-panel"
          onLogout={onLogout}
          isAdmin={isAdmin}
          onSearch={handleSearch}
        />
      </section>
      <div className="forum">
        <section className="Information">
          <Information />
        </section>
        <section className="Msg">
          <h2>{discussion.title}</h2>
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
            <MessageList messages={messages} />
          </article>
        </section>
      </div>
    </div>
  );
}

export default AdminDiscussionPage;
