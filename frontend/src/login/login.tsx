import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

interface LoginViewProps {
    handleLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ handleLogin }) => {
    const [loginError, setLoginError] = useState(false);
    const navigate = useNavigate();

    const loginUser = async () => {
        const emailInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
    
        if (!emailInput.value || !passwordInput.value) {
            alert('Please enter both email and password.');
            return;
        }

        // need to also check if email and password is in the database
        var login = await axios.get('http://localhost:4000/user', {
            params: {
                email: emailInput.value,
                password: passwordInput.value
            }
        });
    
        if (login.data.length) {
            console.log("success: "+emailInput.value+ " "+passwordInput.value+" "+login.data.length);
            setLoginError(false);
            handleLogin();
            navigate('/favorites');
        } else {
            console.log("user not found"+emailInput.value+ " "+passwordInput.value);
            setLoginError(true);
        }
        
    };


    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Log in</h1>
                <input type="text" placeholder="Email" />
                <input type="password" placeholder="Password" />
                {loginError && (
                <div className="error-message">
                    Email and password not found. Please try again.
                </div>
                )}
                <a href="signup" className="signup-link">No account yet? Sign up here</a>
                <button className="loginbutton" onClick={loginUser}>Login</button>
            </div>
        </div>
    );
};

