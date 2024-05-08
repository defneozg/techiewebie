import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function NavPanel({ onLogout }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      localStorage.removeItem("_id");
      navigate("/");
      onLogout();
    }
  };

  return (
    <div className="nav-panel">
      <div className="logo">Organiz Asso</div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className="page-toggle">
        <button onClick={() => navigate("/admin")}>Switch to Admin Page</button>
      </div>
      <div className="logout-button">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default NavPanel;
