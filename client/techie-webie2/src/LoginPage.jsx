import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

function LoginPage ({ onLogin, onCreateAccount }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const getUsername = (evt) => setUsername(evt.target.value);
  const getPassword = (evt) => setPassword(evt.target.value);

  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/LoginPage", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });
  
      const data = await response.json();
  
      if (data.error_message) {
        alert(data.error_message);
      } else {
        setIsLoggedIn(true);
        onLogin(true);
        // Fetch user data after successful login
        const userResponse = await fetch(`http://localhost:4000/api/user/${data.id}`);
        const userData = await userResponse.json();
        // Store user data (e.g., in state or localStorage)
        setUserData(userData); // Assuming a setter function for user data
        navigate("/MainPage"); // Assuming navigate function for routing
      }
    } catch (error) {
      console.error("Error during login or user data fetch:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  

  const handleLoginClick = () => {
    //e.preventDefault();
		//loginUser();
    onLogin(username, password);
  };

  const handleCancelClick = () => {
    setUsername("");
    setPassword("");
  };

  return (
    <form className='loginForm' onSubmit={handleLoginClick} method="POST" action="">
	<div className='EspacesLogin'>
      <label htmlFor="username">Username</label>
      <input id="user" onChange={getUsername} value={username} />
      <label htmlFor="pass">Password</label>
      <input type="password" id="pass" onChange={getPassword} value={password} />
	</div>
      <div className="button-container">
        <button className='submitBtn' type="submit">Log In</button>
        <button className='cancelBtn' type="button" onClick={handleCancelClick}>Cancel</button>
      </div>
      <p>
        Don't have an account? 
      </p>
      <button className='createBtn' onClick={onCreateAccount}>Create Account</button>
    </form>
  );
}

export default LoginPage;
