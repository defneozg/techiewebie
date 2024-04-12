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
        <div className="forum">
			<NavPanel  className='NavPan' onLogout={onLogout} onSearch={handleSearch}/>
            <section  className='CreateDisc'>
                <CreateDiscussion onCreate={addDiscussion}/>
            </section>

            <section  className='DiscussionList'>
                <DiscussionList discussions={discussions} />
            </section>

            <aside className='Information'>
              <Information /> {/* Add the Information component here */}
            </aside>
        </div>
    );
}

export default MainPage;