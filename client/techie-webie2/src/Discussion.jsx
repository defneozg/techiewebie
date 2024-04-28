import { useParams } from 'react-router-dom';
import CreateMessage from './CreateMessage';
import MessageList from './MessageList';
import axios from 'axios'; 

function Discussion({ discussions, messages }) {
    const { discussionId } = useParams();
    
    const selectedDiscussion = discussions.find(
        (discussion) => discussion.id === parseInt(discussionId)
    );
    
    if (!selectedDiscussion) {
        return <div>Discussion not found.</div>;
    }

    const discussionMessages = messages.filter(
        (message) => message.discussionId === selectedDiscussion.id
    );

    const addMessage = async (newMessage) => {
        try {
            // Send POST request to add a new message
            const response = await axios.post('/api/messages', newMessage);
            // Update discussionMessages state with the newly added message
            discussionMessages.push(response.data);
        } catch (error) {
            console.error('Error adding message:', error);
        }
    };
    
    return (
        <article className="discussion">
            <h2>{selectedDiscussion.title}</h2>
            <CreateMessage onCreate={addMessage} />
            <MessageList messages={discussionMessages} />
            <small>By {selectedDiscussion.author}</small><br />
            <small>{selectedDiscussion.date.toLocaleDateString()}</small>
            <hr />
            <p>{selectedDiscussion.text}</p>
        </article>
    );
}

export default Discussion;
