import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './logout.css';

interface LogoutViewProps {
    handleLogout: () => void;
}

export const LogoutView: React.FC<LogoutViewProps> = ({ handleLogout }) => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/');
        handleLogout();
      }, [navigate, handleLogout]);


    return (
        <div>
            <h1>Logging out..</h1> 
        </div>
    );
}