import React from 'react';
import './login.css';

export default function LoginView() {

    const loginUser = () => {
        const emailInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
    
        if (!emailInput.value || !passwordInput.value) {
            alert('Please enter both email and password.');
            return;
        }

        // need to also check if email and password is in the database
    
        // const user = new User(emailInput.value, passwordInput.value); for later + sign up only..
    
        console.log("success: "+emailInput+ " "+passwordInput);
    };


    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Sign in</h1>
                <input type="text" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <a href="signup" className="signup-link">No account yet? Sign up here</a>
                <button onClick={loginUser}>Login</button>
            </div>
        </div>
    );
}

