import { useState } from 'react';
import axios from 'axios';

function CreateAdminDiscussion({ onCreate }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title.trim() && content.trim()) {
            try {
                // Send POST request to create a new discussion
                const response = await axios.post('http://localhost:4000/api/admindiscussions', { title, content });
                // Call onCreate function with the newly created discussion
                onCreate(response.data);
                // Reset form fields
                setTitle('');
                setContent('');
            } catch (error) {
                // Handle errors (e.g., display an error message)
                console.error('Error creating discussion:', error);
            }
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

export default CreateAdminDiscussion;
