import { useParams } from 'react-router-dom';
import CreateMessage from './CreateMessage';
import MessageList from './MessageList';

function Discussion({ discussions, messages }){

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

    const newDiscussionMessages = [];
    const addMessage = (newMessage) => {
      newDiscussionMessages = [...discussionMessages, newMessage];
    };
    
    return (
        <article className="discussion">
            <h2>{selectedDiscussion.title}</h2>
	    <CreateMessage onCreate={addMessage}/>
            <MessageList messages={discussionMessages} />
            <small>By {selectedDiscussion.author}</small><br />
            <small>{selectedDiscussion.date.toLocaleDateString()}</small>
            <hr />
            <p>{selectedDiscussion.text}</p>
        </article>
    );
}

export default Discussion;