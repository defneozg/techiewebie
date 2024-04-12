import { useState } from 'react';
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
			<NavPanel onLogout={onLogout} onSearch={handleSearch}/>
            <section>
                <CreateDiscussion onCreate={addDiscussion}/>
            </section>

            <section>
                <DiscussionList discussions={discussions} />
            </section>

            <aside>
              <Information /> {/* Add the Information component here */}
            </aside>
        </div>
    );
}

export default MainPage;