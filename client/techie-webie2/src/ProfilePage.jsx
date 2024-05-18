import { useState, useEffect } from "react";
import axios from "./axiosConfig.js";
import DiscussionList from "./DiscussionList";
import MessageList from "./MessageList";
import { useLocation } from "react-router-dom";

function ProfilePage({ connectedUsername, isAdmin }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get("username");
  const [userProfile, setUserProfile] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfileResponse = await axios.get(
          `http://localhost:4000/api/user/username/${username}`
        );
        setUserProfile(userProfileResponse.data);

        const discussionsResponse = await axios.get(
          `http://localhost:4000/api/discussions/username/${username}`
        );
        setDiscussions(discussionsResponse.data);

        const messagesResponse = await axios.get(
          `http://localhost:4000/api/messages/username/${username}`
        );
        setMessages(messagesResponse.data);

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  const toggleAdminStatus = async () => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/users/${userProfile.username}/toggle-admin`
      );
      if (response.status === 200) {
        // Update the admin status in the local state
        setUserProfile((prevProfile) => ({
          ...prevProfile,
          isAdmin: !prevProfile.isAdmin,
        }));
      } else {
        throw new Error("Failed to toggle admin status");
      }
    } catch (error) {
      console.error("Error toggling admin status:", error);
    }
  };

  const handleAdminButton = () => {
    if (connectedUsername !== username) {
      toggleAdminStatus();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !userProfile) {
    console.error("Error fetching user profile:", error);
    return <div>Error fetching user profile.</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>
          About {userProfile.firstName} {userProfile.lastName}
        </h2>
        <p>{userProfile.about}</p>
        {isAdmin &&
          (userProfile.isAdmin ? (
            <button className="removeAdmin" onClick={handleAdminButton}>
              Remove Admin
            </button>
          ) : (
            <button className="makeAdmin" onClick={handleAdminButton}>
              Make Admin
            </button>
          ))}
      </div>
      <div className="profile-content">
        <div className="discussions">
          <h3>Discussions Posted by {userProfile.username}</h3>
          <DiscussionList discussions={discussions} />
        </div>
        <div className="messages">
          <h3>Messages Posted by {userProfile.firstName}</h3>
          <MessageList
            messages={messages}
            username={connectedUsername}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
