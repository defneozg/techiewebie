import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './MainPage';
import LoginPage from './LoginPage';
import SignUpForm from './SignUpForm';
import DiscussionPage from './DiscussionPage';
import AdminDiscussionPage from './AdminDiscussionPage';
import AdminPage from './AdminPage';
import ProfilePage from './ProfilePage';

function App() {
  const [currentPage, setCurrentPage] = useState('LoginPage');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const setLogout = () => {
		setIsLoggedIn(false);
    setUsername("");
		navigateTo('/');
	}

  const handleLogin = (loggedIn, username) => {
    setIsLoggedIn(loggedIn); 
    setUsername(username); 
    console.log('Login true');
  };
  
  /*let content;
  if (currentPage === 'LoginPage' && !isLoggedIn) {
    content = <LoginPage onLogin={handleLogin} onCreateAccount={() => navigateTo('signup')} />;
  } else if (currentPage === 'signup') {
    content = <SignUpForm />;
  } else if (currentPage === 'LoginPage' && isLoggedIn) {
    content = <MainPage onLogout={setLogout} username={username} />; // Pass username to MainPage
  }*/

  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} onCreateAccount={() => navigateTo('signup')} />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/discussion/:discussionId" element={<DiscussionPage onLogout={setLogout} username={username} />} /> 
        <Route path="/admindiscussion/:discussionId" element={<AdminDiscussionPage onLogout={setLogout} />} />
        <Route path="/main" element={<MainPage onLogout={setLogout} username={username} />} />
        <Route path="/admin" element={<AdminPage onLogout={setLogout} />} />
        <Route path="/user/:username" element={<ProfilePage userId={userId} />} />
      </Routes>
    </div>
  )
}

export default App;
