import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import MainPage from './MainPage';
import LoginPage from './LoginPage';
import SignUpForm from './SignUpForm';
import DiscussionPage from './DiscussionPage';
import ProtectedRoute from './ProtectedRoute'; // ????

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

  const handleLogin = (loggedIn) => {
    setIsLoggedIn(loggedIn); // Update isLoggedIn state upon login
    // Optionally navigate to MainPage after login (if desired)
    // navigateTo('/MainPage'); 
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
      {content}
      <Routes>
        <Route path="/" element={<></>} /> {/* Login page is always accessible */}
        <Route path="/signup" element={<SignUpForm />} /> {/* Signup page is always accessible */}
        <Route path="/MainPage" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
          <MainPage onLogout={setLogout} />
          </ProtectedRoute>
        }
        />
        <Route path="/discussion/:discussionId" element={<DiscussionPage />} />
      </Routes>

      </div>
  )
}

export default App
