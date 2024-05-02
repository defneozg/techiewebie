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

  // Function to fetch discussions from the backend
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

  // Function to periodically fetch discussions
  useEffect(() => {
    const interval = setInterval(fetchDiscussions, 2000); // Fetch every 5 seconds
    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  const addDiscussion = async (newDiscussion) => {
    try {
      setDiscussions([...discussions, newDiscussion]);
    } catch (error) {
      console.error("Error adding discussion:", error);
    }
  };

  const handleSearch = (searchQuery) => {
    // Implement search functionality here
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
            {/* Pass the username prop to CreateDiscussion */}
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
