import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavPanel from "./NavPanel";
import CreateAdminDiscussion from "./CreateAdminDiscussion";
import AdminDiscussionList from "./AdminDiscussionList";
import Information from "./Information";
import axios from "./axiosConfig.js";

function AdminPage({ onLogout, username }) {
  const [discussions, setDiscussions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchDiscussions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/admindiscussions"
      );
      if (response.status === 200) {
        setDiscussions(response.data);
      } else {
        throw new Error("Failed to fetch discussions");
      }
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchDiscussions, 2000);
    return () => clearInterval(interval);
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/user/admin");
      if (response.data.isAdmin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  checkAdminStatus();

  const addDiscussion = (newDiscussion) => {
    setDiscussions([...discussions, newDiscussion]);
  };

  const handleSearch = (searchQuery) => {
    console.log("Search query:", searchQuery);
  };

  if (!isAdmin) {
    return (
      <div className="adminDenial">
        <p>Access Denied. You must be an admin to view this page.</p>
        <Link className="pendingLink" to="/main">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section className="AdminHeader">
        <NavPanel
          className="nav-panel"
          onLogout={onLogout}
          isAdmin={isAdmin}
          onSearch={handleSearch}
          username={username}
        />
      </section>
      <div className="AdminForum">
        <section className="Information">
          <Information />
        </section>
        <section className="Disc">
          <Link className="pendingLink" to="/pending">
            Go to Pending Users
          </Link>
          <section className="CreateDisc">
            <CreateAdminDiscussion
              onCreate={addDiscussion}
              username={username}
            />
          </section>
          <article className="DiscussionList">
            <AdminDiscussionList discussions={discussions} />
          </article>
        </section>
      </div>
    </div>
  );
}

export default AdminPage;
