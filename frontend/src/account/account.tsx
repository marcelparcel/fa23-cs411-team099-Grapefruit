import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import './account.css'

interface AccountViewProps {
    isLoggedIn: boolean;
    userEmail: string;
    userPassword: string;
  }

export const AccountView: React.FC<AccountViewProps> = ({ isLoggedIn, userEmail, userPassword}) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [placeholderName, setPlaceholderName] = useState('Name');
    const [placeholderPassword, setPlaceholderPassword] = useState(userPassword);
    const [fieldError, setFieldError] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const getInfo = async () => {
            try {
                var get = await axios.get('http://localhost:4000/user', { 
                    params: {
                        email: userEmail,
                        password: userPassword
                    }
                });

                setPlaceholderName(get.data[0].Name);
                setPlaceholderPassword(get.data[0].Password);

            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        if (isLoggedIn) {
            getInfo();
        }
        console.log("in useeffect");
        
    }, [isLoggedIn, userEmail, userPassword]);




    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const deleteAccount = async () => {
        var del = await axios.delete('http://localhost:4000/user', { 
            params: {
                email: userEmail,
                password: passwordInput.value
            }
        });

        console.log(del);

        console.log(userEmail);
        console.log(passwordInput.value);
        console.log(nameInput.value);

        if (Object.keys(del)) {
            navigate('/logout');
        } else {
            alert("something went wrong.. try again");
        }
    };

    const updateAccount = async () => {

        await axios.put('http://localhost:4000/user', { 
            name: placeholderName,
            email: userEmail,
            password: placeholderPassword
        }).then(response => {
            // Assuming successful signup returns some data
            if (response.data) {
                console.log("success!");
                setFieldError(false);
                setSuccess(true);
            }
        }).catch(function (error) {
            if (error.response) {
                setSuccess(false);
                setFieldError(true);
              
            }
        });
    };

    return (
        <div className="account-container">
            <div className="account-box">
                <h1>Update Account Information</h1>
                <input
                    name="name"
                    type="text"
                    value={placeholderName}
                    onChange={(e) => setPlaceholderName(e.target.value)}
                />
                <input name="email" type="text" value={userEmail} readOnly={true} />

                <div className="passwbutton">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        defaultValue={userPassword}
                        name="password"
                        onChange={(e) => setPlaceholderPassword(e.target.value)}
                    />
                    <button className="passbutton"
                    onClick={togglePasswordVisibility} >
                        {showPassword ? 'Hide' : 'Show'} Password
                    </button>
                </div>
                {fieldError && (
                <div className="error-message">
                    Please fill out all the fields.
                </div>
                )}
                {success && (
                <div className="success-message">
                    Successfully updated information.
                </div>
                )}
                <div className="passwbutton">
                    <button className="accountbutton" onClick={updateAccount}>Update</button>
                    <button className="deletebutton" onClick={deleteAccount}>Delete Account</button>
                </div>
                
            </div>
        </div>
        
    );
}

