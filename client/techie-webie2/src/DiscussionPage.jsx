import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function DiscussionPage() {
  const { discussionId } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscussionAndMessages = async () => {
      try {
        // Fetch discussion data based on discussionId
        const discussionResponse = await axios.get(`http://localhost:4000/api/discussions/${discussionId}`);
        setDiscussion(discussionResponse.data);

        // Fetch messages associated with the discussion
        const messagesResponse = await axios.get(`http://localhost:4000/api/messages?discussionId=${discussionId}`);
        setMessages(messagesResponse.data);

        setLoading(false); // Data fetching complete
      } catch (error) {
        setError(error); // Set error state if there's an error
        setLoading(false); // Data fetching complete (even if there's an error)
      }
    };

    fetchDiscussionAndMessages();
  }, [discussionId]);

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching data
  }

  if (error || !discussion) {
    return <div>Error fetching discussion data.</div>; // Show error message if there's an error
  }

  return (
    <div className="discussion-page">
      <h2>{discussion.title}</h2>
      <p>{discussion.content}</p>
      <h3>Messages</h3>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <strong>{message.author}</strong>: {message.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DiscussionPage;
