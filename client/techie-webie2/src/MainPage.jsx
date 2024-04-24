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
      <section className="header">
        <NavPanel  className='NavPan' onLogout={onLogout} onSearch={handleSearch}/>
      </section>
      <div className="forum">
        <section className='Information'>
          <Information />
        </section>
        <section  className='Disc'>
          <section className="CreateDisc">
            <CreateDiscussion onCreate={addDiscussion}/>
          </section>
          <article  className='DiscussionList'>
            <DiscussionList discussions={discussions} />
          </article>
        </section>
      </div>
    </div>
    );
}

export default MainPage;