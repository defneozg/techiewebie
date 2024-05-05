import React, { useState, useEffect } from "react";
import axios from "./axiosConfig.js";
import DiscussionList from "./DiscussionList";
import MessageList from "./MessageList";
//import ProfilePicture from './ProfilePicture';

function ProfilePage({ username }) {
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
          `http://localhost:4000/api/messages?username=${username}`
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !userProfile) {
    console.error("Error fetching user profile:", error);
    return <div>Error fetching user profile.</div>;
  }

  // <ProfilePicture imageUrl={userProfile.profilePictureUrl} />

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>
          About {userProfile.firstName} {userProfile.lastName}
        </h2>

        <p>{userProfile.about}</p>
      </div>
      <div className="profile-content">
        <div className="discussions">
          <h3>Discussions Posted by {userProfile.firstName}</h3>
          <DiscussionList discussions={discussions} />
        </div>
        <div className="messages">
          <h3>Messages Posted by {userProfile.firstName}</h3>
          <MessageList messages={messages} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
