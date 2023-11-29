import React from 'react';
import './dashboard.css';
import { Link } from 'react-router-dom';

export default function DashboardView() {

    const favoriteStops = ["Stop 1", "Stop 2", "Stop 3"];

    return (
        <div>
        <h1 className="dashboardtext">Dashboard</h1>
        <div className="favorites-container">
            <div className="favorites-box">
                <h1>Favorites</h1>
                <ul>
                    {favoriteStops.map((stop, index) => (
                        <li key={index}>
                            <Link to={`/stop/${stop}`}>{stop}</Link>
                        </li>
                    ))}
                </ul>
                
            </div>
        </div>
        </div>
    );
}

// check if user is signed in.. if not, then show a 404 error or redirect to log in page

    // if the user is signed in.. continue

    // show favorite stops
    // visualize upcoming routes going to/from favorite stops using the current time? (just an idea)
    // add a favorite stop