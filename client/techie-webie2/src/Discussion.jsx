import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import CreateMessage from "./CreateMessage";
import MessageList from "./MessageList";
import axios from "./axiosConfig.js";

function Discussion() {
  const { discussionId } = useParams();
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [discussionMessages, setDiscussionMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // GET discussion according to discussionId
        const discussionResponse = await axios.get(
          `http://localhost:4000/api/discussions/discussionId/${discussionId}`
        );
        setSelectedDiscussion(discussionResponse.data);

        // GET messages of a discussion
        const messagesResponse = await axios.get(
          `http://localhost:4000/api/messages?discussionId=${discussionId}`
        );
        setDiscussionMessages(messagesResponse.data);

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [discussionId]);

  const addMessage = async (newMessage) => {
    try {
      // POST message
      const response = await axios.post(
        "http://localhost:4000/api/messages",
        newMessage
      );
      // Add the new message to the list
      setDiscussionMessages([...discussionMessages, response.data]);
    } catch (error) {
      console.error("Error adding message:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !selectedDiscussion) {
    return <div>Error fetching discussion data.</div>;
  }

  return (
    <article className="discussion">
      <h2>{selectedDiscussion.title}</h2>

      <p>By </p>
      <small>
        {selectedDiscussion.date.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true, // Set to true for 12-hour clock format, false for 24-hour format
        })}
      </small>
      <hr />
      <p>{selectedDiscussion.text}</p>
      {/* Add delete button for admins or the user who posted the discussion */}
      {/* Add conditional rendering based on user's role */}
    </article>
  );
}

export default Discussion;
