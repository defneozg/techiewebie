import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CreateMessage from './CreateMessage';
import MessageList from './MessageList';
import NavPanel from "./NavPanel";
import Information from './Information';
import './DiscussionPage.css';

function DiscussionPage({ onLogout }) {
  const { discussionId } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define createMessage function to handle message creation
  const createMessage = async (newMessage) => {
    try {
      // Send POST request to create a new message
      await axios.post(`http://localhost:4000/api/messages`, {
        discussionId,
        msg: newMessage
      });

      // After successfully creating the message, fetch the updated list of messages
      const messagesResponse = await axios.get(`http://localhost:4000/api/messages?discussionId=${discussionId}`);
      setMessages(messagesResponse.data);
    } catch (error) {
      console.error('Error creating message:', error);
    }
  };

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

  const addMessages = (newMessage) => {
    setMessages([...messages, newMessage]);
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching data
  }

  if (error || !discussion) {
    console.error('Error fetching discussion data:', error); // Log error to console
    return <div>Error fetching discussion data.</div>; // Show error message if there's an error
  }

  const handleSearch = (searchQuery) => {
    // Implement search functionality here
    console.log('Search query:', searchQuery);
  };

  return (
    <div className="discussion-page">
      <section className="header">
        <NavPanel className='NavPan' onLogout={onLogout} onSearch={handleSearch}/>
      </section>
      <div className="forum">
        <section className='Information'>
            <Information />
        </section>
          <h2>{discussion.title}</h2>
          <p>{discussion.content}</p>
        <section className='Msg'>
          <section className="CreateMsg">
            <CreateMessage onCreate={addMessages} discussionId={discussionId} />
          </section>
          <article className='MessageList'>
            <MessageList messages={messages} />
          </article>
        </section>
      </div>
    </div>
  );
}

export default DiscussionPage;
