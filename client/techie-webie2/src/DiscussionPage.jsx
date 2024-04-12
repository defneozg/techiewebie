import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function DiscussionPage() {
  const { discussionId } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch the discussion and its messages based on discussionId
    // Replace the fetchDiscussion and fetchMessages functions with your actual data fetching logic

    // Example fetch functions (replace with your actual implementation)
    const fetchDiscussion = async () => {
      try {
        // Fetch discussion data based on discussionId
        const response = await fetch(`/api/discussions/${discussionId}`);
        if (response.ok) {
          const data = await response.json();
          setDiscussion(data);
        } else {
          throw new Error('Failed to fetch discussion');
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchMessages = async () => {
      try {
        // Fetch messages associated with the discussion
        const response = await fetch(`/api/messages?discussionId=${discussionId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          throw new Error('Failed to fetch messages');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDiscussion();
    fetchMessages();
  }, [discussionId]);

  if (!discussion) {
    return <div>Loading...</div>;
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