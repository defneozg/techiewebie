import { useState, useEffect } from 'react';
import './MainPage.css';
import NavPanel from "./NavPanel";
import CreateDiscussion from "./CreateDiscussion"
import DiscussionList from "./DiscussionList"
import Information from './Information';
import axios from 'axios';

function AdminPage ({ onLogout }) {
  const [discussions, setDiscussions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status

  // Fetch discussions from the backend when the component mounts
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/discussions');
        if (response.status === 200) {
          setDiscussions(response.data);
        } else {
          throw new Error('Failed to fetch discussions');
        }
      } catch (error) {
        console.error('Error fetching discussions:', error);
      }
    };

    fetchDiscussions();

    // Check if the user is an admin
    const checkAdminStatus = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/user/admin');
        console.log("hiiiiiiiiiiiiiiii");
        if (response.status === 200) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminStatus();
  }, []);

  const addDiscussion = (newDiscussion) => {
    setDiscussions([...discussions, newDiscussion]);
  };

  const handleSearch = (searchQuery) => {
    // Implement search functionality here
    console.log('Search query:', searchQuery);
  };

  if (!isAdmin) {
    return (
      <div>
        <p>Access Denied. You must be an admin to view this page.</p>
        {/* You can add a redirect here or display a login button */}
      </div>
    );
  }

  return (
    <div>
      <section className="header">
        <NavPanel className='NavPan' onLogout={onLogout} onSearch={handleSearch}/>
      </section>
      <div className="forum">
        <section className='Information'>
          <Information />
        </section>
        <section className='Disc'>
          <section className="CreateDisc">
            <CreateDiscussion onCreate={addDiscussion}/>
          </section>
          <article className='DiscussionList'>
            <DiscussionList discussions={discussions} />
          </article>
        </section>
      </div>
    </div>
  );
}

export default AdminPage;
