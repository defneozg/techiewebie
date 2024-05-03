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
        // GET data sur l'utilisateur selon userid
        const userProfileResponse = await axios.get(`http://localhost:4000/api/user/${userId}`);
        setUserProfile(userProfileResponse.data);
        
        // GET discussions postées par l'utilisateur
        const discussionsResponse = await axios.get(`http://localhost:4000/api/discussions?userId=${userId}`);
        setDiscussions(discussionsResponse.data);
        
        // GET messages postées par l'utilisateur
        const messagesResponse = await axios.get(`http://localhost:4000/api/messages?userId=${userId}`);
        setMessages(messagesResponse.data);

        setLoading(false); 
      } catch (error) {
        setError(error); 
        setLoading(false); 
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error || !userProfile) {
    console.error('Error fetching user profile:', error); 
    return <div>Error fetching user profile.</div>; 
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
