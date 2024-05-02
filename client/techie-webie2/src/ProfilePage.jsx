import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DiscussionList from './DiscussionList';
import MessageList from './MessageList';
//import ProfilePicture from './ProfilePicture';

function ProfilePage({ userId }) {
  const [userProfile, setUserProfile] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch user profile data based on userId
        const userProfileResponse = await axios.get(`http://localhost:4000/api/user/${userId}`);
        setUserProfile(userProfileResponse.data);
        
        // Fetch discussions posted by the user
        const discussionsResponse = await axios.get(`http://localhost:4000/api/discussions?userId=${userId}`);
        setDiscussions(discussionsResponse.data);
        
        // Fetch messages posted by the user
        const messagesResponse = await axios.get(`http://localhost:4000/api/messages?userId=${userId}`);
        setMessages(messagesResponse.data);

        setLoading(false); // Data fetching complete
      } catch (error) {
        setError(error); // Set error state if there's an error
        setLoading(false); // Data fetching complete (even if there's an error)
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching data
  }

  if (error || !userProfile) {
    console.error('Error fetching user profile:', error); // Log error to console
    return <div>Error fetching user profile.</div>; // Show error message if there's an error
  }

  // <ProfilePicture imageUrl={userProfile.profilePictureUrl} />
  
  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>About {userProfile.firstName} {userProfile.lastName}</h2>
        
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
