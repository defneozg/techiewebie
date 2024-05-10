import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import LoginPage from "./LoginPage";
import SignUpForm from "./SignUpForm";
import MainPage from "./MainPage";
import AdminPage from "./AdminPage";
import DiscussionPage from "./DiscussionPage";
import AdminDiscussionPage from "./AdminDiscussionPage";
import ProfilePage from "./ProfilePage";
import SearchResultsPage from "./SearchResultsPage";
import PendingUsers from "./PendingUsers";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (loggedIn, username) => {
    setIsLoggedIn(loggedIn);
    setUsername(username);
    localStorage.setItem("isLoggedIn", loggedIn);
    localStorage.setItem("username", username);
  };

  const setLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
  };

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUsername = localStorage.getItem("username");
    if (storedIsLoggedIn) {
      setIsLoggedIn(storedIsLoggedIn);
      setUsername(storedUsername || "");
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route
          path="/main"
          element={
            isLoggedIn && <MainPage onLogout={setLogout} username={username} />
          }
        />
        <Route
          path="/admin"
          element={
            isLoggedIn && <AdminPage onLogout={setLogout} username={username} />
          }
        />
        <Route
          path="/discussions/discussionId/:discussionId"
          element={
            isLoggedIn && (
              <DiscussionPage onLogout={setLogout} username={username} />
            )
          }
        />
        <Route
          path="/admindiscussions/discussionId/:discussionId"
          element={
            isLoggedIn && (
              <AdminDiscussionPage onLogout={setLogout} username={username} />
            )
          }
        />
        <Route path="/user" element={isLoggedIn && <ProfilePage />} />
        <Route path="/search" element={isLoggedIn && <SearchResultsPage />} />
        <Route path="/pending" element={isLoggedIn && <PendingUsers />} />
      </Routes>
    </div>
  );
}

export default App;
