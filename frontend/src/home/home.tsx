import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

export default function HomeView() {
    const navigate = useNavigate();
    const getStarted = () => {
        navigate('/login');
    };

    return (
        <header className="homeheader">
            <h1 className="homeh1">São Paulo Adventure</h1> 
            <button className="homebutton" onClick={getStarted}>Get Started</button>
        </header>
        
    );
}
// image is from: https://www.hotels.com/go/brazil/sao-paulo-travel-kit
