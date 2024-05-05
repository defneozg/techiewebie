import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "./axiosConfig.js";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const getUsername = (evt) => setUsername(evt.target.value);
  const getPassword = (evt) => setPassword(evt.target.value);

  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/login",
        {
          username,
          password,
        }
      );

      const data = response.data;

      if (data.error_message) {
        alert(data.error_message);
      } else {
        if (response.status === 200) {
          onLogin(true, username);
          navigate("/main");
        }
      }
    } catch (error) {
      console.error("Error during login or user data fetch:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    loginUser();
  };

  const handleCancelClick = () => {
    setUsername("");
    setPassword("");
  };

  return (
    <form
      className="loginForm"
      onSubmit={handleLoginClick}
      method="POST"
      action=""
    >
      <div className="EspacesLogin">
        <label htmlFor="username">Username</label>
        <input
          id="user"
          name="username"
          onChange={getUsername}
          value={username}
        />
        <label htmlFor="pass">Password</label>
        <input
          type="password"
          id="pass"
          onChange={getPassword}
          value={password}
        />
      </div>
      <div className="button-container">
        <button className="submitBtn" type="submit">
          Log In
        </button>
        <button className="cancelBtn" type="button" onClick={handleCancelClick}>
          Cancel
        </button>
      </div>
      <p>Don't have an account?</p>
      <Link to="/signup" className="createBtn">
        Create Account
      </Link>
    </form>
  );
}

export default LoginPage;
