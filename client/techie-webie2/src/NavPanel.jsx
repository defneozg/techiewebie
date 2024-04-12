import { useState } from 'react';

function NavPanel({ onLogout, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query state
    // Call the onSearch function passed from the parent component
    if (onSearch) {
      onSearch(event.target.value); // Pass the search query as an argument
    }
  };

  const handleLogout = () => {
    // Call the onLogout function passed from the parent component
    if (onLogout) {
	  console.log('Logout button clicked');
      onLogout();
    }
  };

  return (
    <div className="nav-panel">
      <div className="logo">Your Site Logo</div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange} // Call handleSearchChange on input change
        />
      </div>
      <div className="logout-button">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default NavPanel;