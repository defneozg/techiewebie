import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

function LoginPage ({ onLogin, onCreateAccount }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const getUsername = (evt) => setUsername(evt.target.value);
  const getPassword = (evt) => setPassword(evt.target.value);

  const navigate = useNavigate();

  const loginUser = async () => {
      try {
          // Post request to login
          console.log("hey1");
          const response = await axios.get("http://localhost:4000/api/user/login", {
              username,  // assuming `username` is defined in the scope
              password   // assuming `password` is defined in the scope
          });
          console.log("hey2");

          const data = response.data;

          if (data.error_message) {
              alert(data.error_message);
          } else {
              setIsLoggedIn(true);
              onLogin(true);  // Assuming an `onLogin` function that updates login status
              // Fetch user data after successful login
              const userResponse = await axios.get("http://localhost:4000/api/user/${data.id}");
              const userData = userResponse.data;
              // Store user data (e.g., in state or localStorage)
              setUserData(userData); // Assuming a setter function for user data
              navigate("/MainPage"); // Assuming navigate function for routing
          }
      } catch (error) {
          console.error("Error during login or user data fetch:", error);
          alert("An error occurred. Please try again later.");
      }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
		loginUser();
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