import { Link } from "react-router-dom";
import axios from "./axiosConfig.js";
import { useState, useEffect } from "react";

function MessageList({ messages, username, isAdmin }) {
  const [messageId, setMessageId] = useState("");

  function formatDate(date) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    return new Date(date).toLocaleString("en-US", options);
  }

  useEffect(() => {
    const deleteMessage = async () => {
      try {
        if (messageId) {
          await axios.delete(
            `http://localhost:4000/api/messages/${messageId}/${username}`
          );
          // Redirect or handle the deletion confirmation
        }
      } catch (error) {
        console.error("Error deleting discussion:", error);
      }
    };

    deleteMessage(); // Appel de la fonction deleteMessage après chaque mise à jour de messageId
  }, [messageId]);

  return (
    <div>
      <h2>Messages</h2>
      <ul>
        {messages.map((message, index) => (
          <li className="listItem" key={index}>
            <p>{message.msg}</p>
            <Link
              className="linkUsername"
              to={`/user?username=${message.username}`}
            >
              {message.username}
            </Link>
            <p>{message.createdAt && formatDate(message.createdAt)}</p>
            {(isAdmin || username === message.username) && (
              <button
                className="DeleteMsg"
                onClick={() => {
                  setMessageId(message._id);
                }}
              >
                Delete Message
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MessageList;
