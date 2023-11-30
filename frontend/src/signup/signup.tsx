import './signup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
interface LoginViewProps {
  handleLogin: () => void;
}

export const SignUpView: React.FC<LoginViewProps> = ({ handleLogin }) => {
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

  const signUpUser = async () => {
    const nameInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    const emailInput = document.querySelector('input[type="text"]') as HTMLInputElement;
    const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;

    if (!emailInput.value || !passwordInput.value || !nameInput.value) {
        setLoginError(true);
    }

    var signup = await axios.post('http://localhost:4000/user', { 
        params: {
          email: emailInput.value,
          password: passwordInput.value,
          name: nameInput.value
        }
    });

    if (Object.keys(signup)) {
      handleLogin();
      navigate('/planner');
    } else {
      console.log("unable to sign up :(");
      alert("something went wrong.. try again");
    }
  };

  return (
        <div className="signup-container">
            <div className="signup-box">
                <h1>Sign Up</h1>
                <input type="text" placeholder="Name" />
                <input type="text" placeholder="Email" />
                <input type="password" placeholder="Password" />
                {loginError && (
                <div className="error-message">
                    Please fill out all the fields.
                </div>
                )}
                <a href="login" className="login-link">Already have an account? Log in here</a>
                <button onClick={signUpUser}>Sign Up</button>
            </div>
        </div>
    );
};
