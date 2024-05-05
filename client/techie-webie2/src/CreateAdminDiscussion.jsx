import { useState } from "react";
import axios from "./axiosConfig.js";

function CreateAdminDiscussion({ onCreate }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      try {
        // POST discussion
        const response = await axios.post(
          "http://localhost:4000/api/admindiscussions",
          { title, content }
        );
        onCreate(response.data);
        setTitle("");
        setContent("");
      } catch (error) {
        console.error("Error creating discussion:", error);
      }
    }
  };

  return (
    <div>
      <h2>Create Discussion</h2>
      <form className="discCont" onSubmit={handleSubmit}>
        <input
          className="discTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Discussion Title"
          required
        />
        <textarea
          className="discContenu"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Discussion Content"
          required
        />
        <button className="SendBtn" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}

export default CreateAdminDiscussion;
