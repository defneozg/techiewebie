import { useState } from 'react';
import axios from 'axios'; // Import axios

function CreateMessage({ onCreate, discussionId, username }) {
  const [msg, setMsg] = useState('');

  const handleMsg = (e) => {
    setMsg(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (msg.trim()) { // Voir si msg est vide
      try {
        // POST message
        const response = await axios.post('http://localhost:4000/api/messages', { 
          discussionId,
          msg,
          username
        });
        console.log(response.msg);
        //onCreate(response.msg);
        setMsg('');
      } catch (error) {
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
