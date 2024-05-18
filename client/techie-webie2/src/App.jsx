import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "./axiosConfig.js";
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (loggedIn, username) => {
    setIsLoggedIn(loggedIn);
    setUsername(username);
    checkAdminStatus();
    localStorage.setItem("isLoggedIn", loggedIn);
    localStorage.setItem("username", username);
  };

  const setLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUsername("");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("username");
  };

  const checkAdminStatus = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/user/admin");
      if (response.data.isAdmin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUsername = localStorage.getItem("username");
    if (storedIsLoggedIn) {
      setIsLoggedIn(storedIsLoggedIn);
      setUsername(storedUsername || "");
      checkAdminStatus();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
    localStorage.setItem("username", username);
    localStorage.setItem("isAdmin", isAdmin);
  }, [isLoggedIn, username, isAdmin]);

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
              <DiscussionPage
                onLogout={setLogout}
                username={username}
                isAdmin={isAdmin}
              />
            )
          }
        />
        <Route
          path="/admindiscussions/discussionId/:discussionId"
          element={
            isLoggedIn && (
              <AdminDiscussionPage
                onLogout={setLogout}
                username={username}
                isAdmin={isAdmin}
              />
            )
          }
        />
        <Route
          path="/user"
          element={
            isLoggedIn && (
              <ProfilePage connectedUsername={username} isAdmin={isAdmin} />
            )
          }
        />
        <Route path="/search" element={isLoggedIn && <SearchResultsPage />} />
        <Route path="/pending" element={isLoggedIn && <PendingUsers />} />
      </Routes>
    </div>
  );
}

export default App;
