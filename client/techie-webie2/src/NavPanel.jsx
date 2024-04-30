import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

function NavPanel({ onLogout, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    if (onSearch) {
      onSearch(event.target.value);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      localStorage.removeItem("_id");
      navigate("/");
      onLogout();
    }
  };

  const handleTogglePage = () => {
    // Assuming /admin route is used for the AdminPage
    navigate("/admin");
  };

  return (
    <div className="nav-panel">
      <div className="logo">Your Site Logo</div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="page-toggle">
        <button onClick={handleTogglePage}>Switch to Admin Page</button>
      </div>
      <div className="logout-button">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default NavPanel;
