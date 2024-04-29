import { useState } from 'react';
import axios from 'axios'; // Import axios

function CreateMessage({ onCreate, discussionId }) {
  const [msg, setMsg] = useState('');

  const handleMsg = (e) => {
    setMsg(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (msg.trim()) { // Check if msg is not empty
      try {
        // Send POST request to create a new message
        const response = await axios.post('http://localhost:4000/api/messages', { 
          discussionId, // Include discussionId in the request body
          msg 
        });
        console.log(response.msg);
        // Call onCreate function with the newly created message
        //onCreate(response.msg);
        // Reset form fields
        setMsg('');
      } catch (error) {
        // Handle errors (e.g., display an error message)
        console.error('Error creating message:', error);
      }
    }
  };

  return (
    <div>
      <textarea className="msgContenu" value={msg} onChange={handleMsg} placeholder="Sent Message" />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
}

export default CreateMessage;
