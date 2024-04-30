import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

function SignUpForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passOK, setPassOK] = useState(false);

  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  const getUsername = (evt) => setUsername(evt.target.value);
  const getFirstName = (evt) => setFirstName(evt.target.value);
  const getLastName = (evt) => setLastName(evt.target.value);
  const getPass1 = (evt) => setPass1(evt.target.value);
  const getPass2 = (evt) => setPass2(evt.target.value);

  const [allUsernames, setAllUsernames] = useState([]); // Assuming initial empty array

  const navigate = useNavigate();

  const handleRegistration = async (event) => {
    // Basic validation (replace with more robust validation)
    if (username.length < 3 || pass1.length < 4) {
      alert("Username must be at least 3 characters and password must be at least 4 characters.");
      return;
    }

    if (pass1 !== pass2) {
      setPassOK(false);
      return;
    } else {
      setPassOK(true);
      setPassword(pass1); // Update password state after successful validation
    }

    const newUser = {
      username,
      password,
      firstName,
      lastName,
      isAdmin,
    };

    try {
      // Simulate API call with delay (replace with actual fetch)
      const response = await axios.post("http://localhost:4000/api/user/register", newUser);

      const data = response.data;

      if (data.error_message) {
        alert(data.error_message);
      } else {
        setUsername("");
        setPassword("");
        setPassOK(false);
        alert("Account registered successfully!");
        navigate("/"); // Redirect to login page after successful registration
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed due to an error. Please try again later.");
    }
  };

  const submissionHandler = (event) => {
    event.preventDefault();
    console.log(event);
    handleRegistration();
  };

  return (
    <div>
      <form className="registerForm">
        <div className="EspacesSign">
          <label htmlFor="firstname">First name</label>
          <input id="firstname" onChange={getFirstName} />
          <label htmlFor="lastname">Last name</label>
          <input id="lastname" onChange={getLastName} />
          <label htmlFor="signin_username">Username</label>
          <input id="signin_username" onChange={getUsername} />
          <label htmlFor="signin_mdp1">Password</label>
          <input type="password" id="signin_mdp1" onChange={getPass1} />
          <label htmlFor="signin_mdp2">Confirm Password</label>
          <input type="password" id="signin_mdp2" onChange={getPass2} />
        </div>
        <button className="SignUpBtn" type="submit" onClick={submissionHandler}>
          Sign Up
        </button>
        {passOK || pass1 === "" || pass2 === "" ? (
          <p></p>
        ) : (
          <p style={{ color: "red" }}>Error: passwords do not match</p>
        )}
      </form>
    </div>
  );
}

export default SignUpForm;