import React, { useState } from 'react';

export default function AccountView() {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <div className="account-container">
            <div className="account-box">
                <h1>Update Account Information</h1>
                <input type="text" defaultValue="Name" />
                <input type="text" defaultValue="Email" />

                {/* Password input with toggle button */}
                <div>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        defaultValue="Password"
                    />
                    <button className="passbutton"
                    onClick={togglePasswordVisibility} >
                        {showPassword ? 'Hide' : 'Show'} Password
                    </button>
                </div>

                <button className="accountbutton">Update</button>
            </div>
        </div>
        
    );
}