import { useState, useEffect } from "react";
import "./MainPage.css";
import NavPanel from "./NavPanel";
import CreateDiscussion from "./CreateDiscussion";
import DiscussionList from "./DiscussionList";
import Information from "./Information";
import axios from "axios";

axios.defaults.withCredentials = true;

function MainPage({ onLogout, username }) {
  const [discussions, setDiscussions] = useState([]);

  // GET discussions
  const fetchDiscussions = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/discussions");
      if (response.status === 200) {
        setDiscussions(response.data);
      } else {
        throw new Error("Failed to fetch discussions");
      }
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  };

  // GET discussions périodiquement
  useEffect(() => {
    const interval = setInterval(fetchDiscussions, 2000); // GET les discussions chaque 2s
    return () => clearInterval(interval); 
  }, []);

  const addDiscussion = async (newDiscussion) => {
    try {
      setDiscussions([...discussions, newDiscussion]);
    } catch (error) {
      console.error("Error adding discussion:", error);
    }
  };

  const handleSearch = (searchQuery) => {
    // TODO search
    console.log("Search query:", searchQuery);
  };

  return (
    <div>
      <section className="header">
        <NavPanel
          className="NavPan"
          onLogout={onLogout}
          onSearch={handleSearch}
        />
      </section>
      <div className="forum">
        <section className="Information">
          <Information />
        </section>
        <section className="Disc">
          <section className="CreateDisc">
            <CreateDiscussion onCreate={addDiscussion} username={username} />
          </section>
          <article className="DiscussionList">
            <DiscussionList discussions={discussions} />
          </article>
        </section>
      </div>
    </div>
  );
}

export default MainPage;
