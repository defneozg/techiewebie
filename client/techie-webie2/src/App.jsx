import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './MainPage';
import LoginPage from './LoginPage';
import SignUpForm from './SignUpForm';
import DiscussionPage from './DiscussionPage';

function App() {
  const [currentPage, setCurrentPage] = useState('LoginPage');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const setLogout = () => {
		setIsLoggedIn(false);
		navigateTo('LoginPage');
	}

  function handleLoginClick(username, password) {
    // Simulate authentication logic (replace with actual authentication)
    if (username === 'def' && password === 'pass') {
      setIsLoggedIn(true) // Set isLoggedIn state to true upon successful authentication
    } else {
      alert('Invalid username or password. Please try again.') // Show an alert for unsuccessful login
    }
  }

  let content;
  if (currentPage === 'LoginPage' && !isLoggedIn) {
    content = <LoginPage onLogin={handleLoginClick} onCreateAccount={() => navigateTo('signup')} />;
  } else if (currentPage === 'signup') {
    content = <SignUpForm />;
  } else if (currentPage === 'LoginPage' && isLoggedIn) {
    content = <MainPage onLogout={setLogout} />;
  } 

  return (
    <div>
        {content}
        <Routes>
          <Route path='/' element={<></>} />
          <Route path="/discussion/:discussionId" element={<DiscussionPage />} />
        </Routes>
      </div>
  )
}

export default App