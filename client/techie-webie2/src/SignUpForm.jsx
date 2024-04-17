import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";

function SignUpForm (props) {
	
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [passOK, setPassOK] = useState(false);
	
	const [pass1, setPass1] = useState("");
	const [pass2, setPass2] = useState("");
	
	const getUsername = (evt) => {setUsername(evt.target.value)};
	const getFirstName = (evt) => {setFirstName(evt.target.value)};
	const getLastName = (evt) => {setLastName(evt.target.value)};
	const getPass1 = (evt) => {setPass1(evt.target.value)};
	const getPass2 = (evt) => {setPass2(evt.target.value)};

	const navigate = useNavigate();

	const signUp = () => {
		fetch("http://localhost:4000/api/SignUpForm", {
			method: "POST",
			body: JSON.stringify({
				password,
				username,
				firstName,
				lastName,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then((res) => res.json())
        .then((data) => {
            if (data.error_message) {
                alert(data.error_message);
            } else {
                alert("Account created successfully!");
                navigate("/");
            }
        })
        .catch((err) => console.error(err));
};
	
	const submissionHandler = (evt) => {
		e.preventDefault();
		signUp();
		if (pass1 === pass2) setPassOK(true);
	}
		
	return (
	<div>
		<form className='registerForm'>
			<div className='EspacesSign'>
				<label htmlFor="firstname">First name</label><input id="firstname" onChange={getFirstName}/>
				<label htmlFor="lastname">Last name</label><input id="lastname" onChange={getLastName}/>
				<label htmlFor="signin_username">Username</label><input id="signin_username" onChange={getUsername}/>
				<label htmlFor="signin_mdp1">Password</label><input type="password" id="signin_mdp1" onChange={getPass1}/>
				<label htmlFor="signin_mdp2">Confirm Password</label><input type="password" id="signin_mdp2" onChange={getPass2}/>
			</div>
			<button className='SignUpBtn' onClick={submissionHandler}>Sign Up</button>			
		{passOK || pass1==="" || pass2==="" ? <p></p>:<p style={{color:"red"}}>Error: passwords do not match</p>}
		</form>
		</div>
   );
}

export default SignUpForm;