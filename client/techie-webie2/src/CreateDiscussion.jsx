import { useState } from 'react'

function CreateDiscussion({ onCreate }) {
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (title.trim() && content.trim()) {
        const newDiscussion = {
          id: Date.now(), // Generate a unique id (in real-world scenarios, this should come from a server)
          title,
          content
        };
        
        onCreate(newDiscussion);
        setTitle('');
        setContent('');
      }
    };
  
    return (
      <div>
        <h2>Create Discussion</h2>
        <form className="discCont" onSubmit={handleSubmit}>
          <input className="discTitle" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Discussion Title" required />
          <textarea className="discContenu" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Discussion Content" required />
          <button className="SendBtn" type="submit">Send</button>
        </form>
      </div>
    );
  }
  
export default CreateDiscussion;