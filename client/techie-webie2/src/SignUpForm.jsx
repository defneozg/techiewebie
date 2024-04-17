import { useState } from 'react';
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
    event.preventDefault();

    // Basic validation (replace with more robust validation)
    if (username.length < 3 || password.length < 6) {
      alert("Username must be at least 3 characters and password must be at least 6 characters.");
      return;
    }

    if (pass1 !== pass2) {
      setPassOK(false);
      return;
    }

    const newUser = {
      username,
      password,
      firstName,
      lastName,
    };

    try {
      // Simulate API call with delay (replace with actual fetch)
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve({ success: true }), 1000)
      );

      if (response.success) {
        // Registration successful
        setUsername("");
        setPassword("");
        setPassOK(false);
        alert("Account registered successfully!");
        navigate("/LoginPage");
      } else {
        // Registration failed (handle specific errors from server)
        alert("Registration failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed due to an error. Please try again later.");
    }
  };

  const submissionHandler = (event) => {
	console.log(event)
    event.preventDefault();
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
        <button className="SignUpBtn" type="submit" onClick={(event) => submissionHandler(event)}>
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
