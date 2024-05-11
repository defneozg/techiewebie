import { useState, useEffect } from "react";
import NavPanel from "./NavPanel";
import CreateDiscussion from "./CreateDiscussion";
import DiscussionList from "./DiscussionList";
import Information from "./Information";
import axios from "./axiosConfig.js";

function MainPage({ onLogout, username }) {
  const [discussions, setDiscussions] = useState([]);

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

  // Affiche les discussions périodiquement (chaque 2 secondes)
  useEffect(() => {
    const interval = setInterval(fetchDiscussions, 2000);
    return () => clearInterval(interval);
  }, []);

  const addDiscussion = async (newDiscussion) => {
    try {
      setDiscussions([...discussions, newDiscussion]);
    } catch (error) {
      console.error("Error adding discussion:", error);
    }
  };

  return (
    <div>
      <section className="header">
        <NavPanel className="NavPan" onLogout={onLogout} username={username} />
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
