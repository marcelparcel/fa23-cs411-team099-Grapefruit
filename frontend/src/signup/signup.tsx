import './signup.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
interface LoginViewProps {
  handleLogin: (email: string, password: string) => void;
}

export const SignUpView: React.FC<LoginViewProps> = ({ handleLogin }) => {
  const [loginError, setLoginError] = useState(false);
  const [takenError, setTakenError] = useState(false);
  const navigate = useNavigate();

  const signUpUser = async () => {
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
    const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;

    if (!emailInput.value || !passwordInput.value || !nameInput.value) {
        setLoginError(true);
    } else {
      await axios.post('http://localhost:4000/user', { 
        email: emailInput.value,
        password: passwordInput.value,
        name: nameInput.value
      }).then(response => {
        // Assuming successful signup returns some data
        if (response.data) {
          handleLogin(emailInput.value, passwordInput.value);
          navigate('/planner');
        }
        }).catch(function (error) {
        if (error.response) {
          console.log("something went wrong..");
          setTakenError(true);
        }
      });
    }
  };

  return (
        <div className="signup-container">
            <div className="signup-box">
                <h1>Sign Up</h1>
                <input name="name" type="text" placeholder="Name" />
                <input name="email" type="text" placeholder="Email" />
                <input name="password" type="password" placeholder="Password" />
                {loginError && (
                <div className="error-message">
                    Please fill out all the fields.
                </div>
                )}
                {takenError && (
                <div className="error-message">
                    This email is already taken :(
                </div>
                )}
                <a href="login" className="login-link">Already have an account? Log in here</a>
                <button onClick={signUpUser}>Sign Up</button>
            </div>
        </div>
    );
};
