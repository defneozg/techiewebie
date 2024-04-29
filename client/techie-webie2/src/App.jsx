import { useState } from 'react';
import { Navigate } from 'react-router-dom';
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
		navigateTo('/');
	}

  const handleLogin = (loggedIn) => {
    setIsLoggedIn(loggedIn); // Update isLoggedIn state upon login
    // Optionally navigate to MainPage after login (if desired)
    //navigateTo('/main'); 
    console.log('Login true?');
  };
  
  let content;
  if (currentPage === 'LoginPage' && !isLoggedIn) {
    content = <LoginPage onLogin={handleLogin} onCreateAccount={() => navigateTo('signup')} />;
  } else if (currentPage === 'signup') {
    content = <SignUpForm />;
  } else if (currentPage === 'LoginPage' && isLoggedIn) {
    content = <MainPage onLogout={setLogout} />;
  }

  return (
    <div>
        <Routes>
          <Route path="/" element={<LoginPage onLogin={handleLogin} onCreateAccount={() => navigateTo('signup')} />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/discussion/:discussionId" element={<DiscussionPage onLogout={setLogout}/>} />
          <Route path="/main" element={<MainPage onLogout={setLogout} />} />
        </Routes>
    </div>
  )
}

export default App
