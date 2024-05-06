import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchResultsPage from "./SearchResultsPage";

function NavPanel({ onLogout }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibilite, setVisibilite] = useState(false);

  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && searchQuery.trim()) {
      setVisibilite(true);
      navigate("/search");
    }
  };

  const hideSearchResults = () => {
    setVisibilite(false);
    setSearchQuery("");
  };

  const handleLogout = () => {
    if (onLogout) {
      localStorage.removeItem("_id");
      navigate("/");
      onLogout();
    }
  };

  const handleTogglePage = () => {
    navigate("/admin");
  };

  return (
    <div className="nav-panel">
      <div className="logo"> Organiz Asso</div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          onClose={hideSearchResults}
        />
      </div>
      <div className="page-toggle">
        <button onClick={handleTogglePage}>Switch to Admin Page</button>
      </div>
      <div className="logout-button">
        <button onClick={handleLogout}>Logout</button>
      </div>
      {visibilite && <SearchResultsPage searchQuery={searchQuery} />}
    </div>
  );
}

export default NavPanel;
