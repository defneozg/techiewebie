import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CreateMessage from './CreateMessage';
import MessageList from './MessageList';
import axios from 'axios';

function Discussion() {
    const { discussionId } = useParams();
    const [selectedDiscussion, setSelectedDiscussion] = useState(null);
    const [discussionMessages, setDiscussionMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // GET discussion selon discussionId
                const discussionResponse = await axios.get(`http://localhost:4000/api/discussions/discussionId/${discussionId}`);
                setSelectedDiscussion(discussionResponse.data);
                
                // GET messages d'une discussion
                const messagesResponse = await axios.get(`http://localhost:4000/api/messages?discussionId=${discussionId}`);
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
            const response = await axios.post('http://localhost:4000/api/messages', newMessage);
            // ajout du nouveau message dans la liste
            setDiscussionMessages([...discussionMessages, response.data]);
        } catch (error) {
            console.error('Error adding message:', error);
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
            <CreateMessage onCreate={addMessage} />
            <MessageList messages={discussionMessages} />
            <small>By {selectedDiscussion.username}</small><br />
            <small>{selectedDiscussion.date.toLocaleDateString()}</small>
            <hr />
            <p>{selectedDiscussion.text}</p>
        </article>
    );
}

export default Discussion;
