import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './logout.css';

interface LogoutViewProps {
    handleLogout: () => void;
}

export const LogoutView: React.FC<LogoutViewProps> = ({ handleLogout }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
          handleLogout();
          navigate('/');
        }, 1200);
    
        // Cleanup the timeout to avoid potential memory leaks
        return () => clearTimeout(timeoutId);
      }, [navigate, handleLogout]);
    


    return (
        <div className="logoutbody">
            <h1>Logging out..</h1> 
        </div>
    );
}