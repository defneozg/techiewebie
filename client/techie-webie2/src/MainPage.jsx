import { useState, useEffect } from 'react';
import './MainPage.css';
import NavPanel from "./NavPanel";
import CreateDiscussion from "./CreateDiscussion"
import DiscussionList from "./DiscussionList"
import Information from './Information';
import axios from 'axios';

function MainPage ({ onLogout }) {
  const [discussions, setDiscussions] = useState([]);

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
  }, []);

  const addDiscussion = (newDiscussion) => {
    setDiscussions([...discussions, newDiscussion]);
  };

  const handleSearch = (searchQuery) => {
    // Implement search functionality here
    console.log('Search query:', searchQuery);
  };

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

export default MainPage;
