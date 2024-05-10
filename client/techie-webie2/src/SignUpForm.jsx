import { useState } from "react";
import axios from "./axiosConfig.js";
import { Link, useNavigate } from "react-router-dom";

function SignUpForm() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passOK, setPassOK] = useState(false);
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  const getUsername = (evt) => setUsername(evt.target.value);
  const getFirstName = (evt) => setFirstName(evt.target.value);
  const getLastName = (evt) => setLastName(evt.target.value);
  const getPass1 = (evt) => {
    const newPassword1 = evt.target.value;
    setPass1(newPassword1);
    setPassOK(newPassword1 === pass2);
  };

  const getPass2 = (evt) => {
    const newPassword2 = evt.target.value;
    setPass2(newPassword2);
    setPassOK(pass1 === newPassword2);
  };

  const navigate = useNavigate();

  const handleRegistration = async (event) => {
    event.preventDefault();
    try {
      if (username.length < 3 || pass1.length < 4) {
        alert(
          "Username must be at least 3 characters and password must be at least 4 characters."
        );
        return;
      }

      if (pass1 !== pass2) {
        alert("The passwords do not match. Please try again.");
        setPassOK(false);
        return;
      }

      setPassOK(true);
      const newUser = {
        username,
        password: pass1,
        firstName,
        lastName,
        isAdmin: false,
        isApproved: false,
      };

      const response = await axios.post(
        "http://localhost:4000/api/user/register",
        newUser
      );

      const data = response.data;

      if (data.error_message) {
        alert(data.error_message);
      } else {
        setUsername("");
        setFirstName("");
        setLastName("");
        setPassOK(false);
        setPass1("");
        setPass2("");
        alert("Account registered successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed due to an error. Please try again.");
    }
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
        <button
          className="SignUpBtn"
          type="submit"
          onClick={handleRegistration}
        >
          Sign Up
        </button>
        {!passOK && pass1 !== "" && pass2 !== "" ? (
          <p style={{ color: "red" }}>Error: passwords do not match</p>
        ) : (
          <p></p>
        )}
      </form>
    </div>
  );
}

export default SignUpForm;
