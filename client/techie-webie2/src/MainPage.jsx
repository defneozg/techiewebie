import { useState } from 'react';
import './MainPage.css';
import NavPanel from "./NavPanel";
import CreateDiscussion from "./CreateDiscussion"
import DiscussionList from "./DiscussionList"
import Information from './Information';

function MainPage ({ onLogout }) {

  const [discussions, setDiscussions] = useState([]);

  const addDiscussion = (newDiscussion) => {
    setDiscussions([...discussions, newDiscussion]);
  };

  const handleSearch = (searchQuery) => {
    // Implement search functionality here
    console.log('Search query:', searchQuery);
  };


    return (
    <div>
      <div className="header">
        <NavPanel  className='NavPan' onLogout={onLogout} onSearch={handleSearch}/>
      </div>
      <div className="forum">
        <aside className='Information'>
          <Information /> {/* Add the Information component here */}
        </aside>
        <section  className='Disc'>
          <div className="CreateDisc">
            <CreateDiscussion onCreate={addDiscussion}/>
          </div>
          <article  className='DiscussionList'>
            <DiscussionList discussions={discussions} />
          </article>
        </section>
      </div>
    </div>
    );
}

export default MainPage;