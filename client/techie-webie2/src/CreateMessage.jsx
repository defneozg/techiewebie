import { useState } from "react";
import axios from "./axiosConfig.js";

function CreateMessage({ onCreate, discussionId, username }) {
  const [msg, setMsg] = useState("");

  const handleMsg = (e) => {
    setMsg(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (msg.trim()) {
      // Voir si msg est vide
      try {
        // POST message
        const response = await axios.post(
          "http://localhost:4000/api/messages",
          {
            discussionId,
            msg,
            username,
          }
        );
        setMsg("");
      } catch (error) {
        console.error("Error creating message:", error);
      }
    }
  };

  return (
    <div>
      <textarea
        className="msgContenu"
        value={msg}
        onChange={handleMsg}
        placeholder="Sent Message"
      />
      <button className="SendBtn" onClick={handleSubmit}>
        Send
      </button>
    </div>
  );
}

export default CreateMessage;
