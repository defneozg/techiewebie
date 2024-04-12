import { useState } from 'react';

function LoginPage ({  onLogin, onCreateAccount }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	
	const getUsername = (evt) => {setUsername(evt.target.value)}
	const getPassword = (evt) => {setPassword(evt.target.value)} 	

	const handleLoginClick = () => {
		onLogin(username, password);
	};
	
	return (

	<form className='loginForm' onSubmit={handleLoginClick} method="POST" action="">
			<label htmlFor="username">Username</label><input id="user" onChange={getUsername}/>
			<label htmlFor="pass">Password</label><input type="password" id="pass"  onChange={getPassword}/>
			<button className='submitBtn' type="submit">Log In</button><button className='cancelBtn' type="reset">Cancel</button>
            <p>
            Don't have an account? 
            </p>
            <button className='createBtn' onClick={onCreateAccount}>Create Account</button>
            
	</form>	 
	 );
}

export default LoginPage;