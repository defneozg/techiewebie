import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CreateMessage from './CreateMessage';
import MessageList from './MessageList';
import NavPanel from "./NavPanel";
import Information from './Information';
import './DiscussionPage.css';

function AdminDiscussionPage({ onLogout }) {
  const { discussionId } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchDiscussionAndMessages = async () => {
      try {
        // GET discussion selon discussionId
        const discussionResponse = await axios.get(`http://localhost:4000/api/admindiscussions/discussionId/${discussionId}`);
        setDiscussion(discussionResponse.data);

        // GET messages d'une discussion
        const messagesResponse = await axios.get(`http://localhost:4000/api/messages?discussionId=${discussionId}`);
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
    console.error('Error fetching discussion data:', error); 
    return <div>Error fetching discussion data.</div>; 
  }

  const handleSearch = (searchQuery) => {
    // TODO search
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

export default AdminDiscussionPage;
