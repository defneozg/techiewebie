import { useState } from 'react'

function CreateMessage({onCreate}) {
    const [msg, setMsg] = useState('');

    const handleMsg = (e) => { setMsg(e.target.value); };

    const handleSubmit = () => {
      onCreate(msg);
      setMsg('');
    };

    return (
      <div>
        <textarea className="msgContenu" value={msg} onChange={handleMsg} placeholder="Sent Message" />
        <button onClick={handleSubmit}>Send</button>
      </div>
    );
}

export default CreateMessage;