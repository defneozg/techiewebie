import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "./axiosConfig.js";
import CreateMessage from "./CreateMessage";
import MessageList from "./MessageList";
import NavPanel from "./NavPanel";
import Information from "./Information";
import "./DiscussionPage.css";

function DiscussionPage({ onLogout, username }) {
  const { discussionId } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Voir si l'utilisateur est un administrateur
  const checkAdminStatus = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/user/admin");
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const createMessage = async (newMessage) => {
    try {
      // Send POST request to create a new message
      await axios.post(`http://localhost:4000/api/messages`, {
        discussionId,
        msg: newMessage,
      });

      // After successfully creating the message, fetch the updated list of messages
      const messagesResponse = await axios.get(
        `http://localhost:4000/api/messages?discussionId=${discussionId}`
      );
      setMessages(messagesResponse.data);
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };

  const handleDelete = async () => {
    try {
      // DELETE discussion
      await axios.delete(
        `http://localhost:4000/api/discussions/discussionId/${discussionId}`
      );
      navigate("/main");
      // Redirect or handle the deletion confirmation
    } catch (error) {
      console.error("Error deleting discussion:", error);
    }
  };

  const fetchDiscussionAndMessages = async () => {
    try {
      // GET discussion selon discussionId
      const discussionResponse = await axios.get(
        `http://localhost:4000/api/discussions/discussionId/${discussionId}`
      );
      setDiscussion(discussionResponse.data);

      // GET messages d'une discussion
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
    checkAdminStatus();
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
    // TODO search
    console.log("Search query:", searchQuery);
  };

  return (
    <div>
      <section className="header">
        <NavPanel
          className="NavPan"
          onLogout={onLogout}
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
          <p>{discussion.username}</p>
          <section className="CreateMsg">
            <CreateMessage
              onCreate={addMessages}
              discussionId={discussionId}
              username={username}
            />
          </section>
          {(isAdmin || username === discussion.username) && (
            <button className="DeleteBtn" onClick={handleDelete}>
              Delete Discussion
            </button>
          )}

          <article className="MessageList">
            <MessageList messages={messages} />
          </article>
        </section>
      </div>
    </div>
  );
}

export default DiscussionPage;
