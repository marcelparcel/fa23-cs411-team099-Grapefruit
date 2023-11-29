import React, { useEffect } from 'react'; // add useState later...
import './favorites.css';


export default function FavoritesView() {
    // const [favoriteStops, setFavoriteStops] = useState([]); uncomment after endpoint implemented

    // placeholder for now..
    useEffect(() => {
        // Fetch favorite stops from the API on component mount
        console.log("in useeffect");
        fetchFavoriteStops();
    }, []);

    const favoriteStops = [ 
        {
            name: "Stop 1",
            lines: [
                { line: "trip 1", headsign: "headsign", minutes: 5 },
                { line: "trip 2", headsign: "headsign", minutes: 8 },
                { line: "trip 3", headsign: "headsign", minutes: 10 }
            ]
        },
        {
            name: "Stop 2",
            lines: [
                { line: "trip 4", headsign: "headsign", minutes: 7 },
                { line: "trip 5", headsign: "headsign", minutes: 12 }
            ]
        },
        {
            name: "Stop 3",
            lines: [
                { line: "trip 7", headsign: "headsign", minutes: 15 }
            ]
        }
    ];

    const removeStop = () => {
        // use delete endpoint
        fetchFavoriteStops(); // update
    }

    const addStop = () => {
        // use put endpoint
        fetchFavoriteStops(); // update
        
    }

    const fetchFavoriteStops = async () => {
        try {
            // const response = await fetch('your_api_endpoint');
            // const data = await response.json(); // assuming this will give the stops..
            // setFavoriteStops(data); uncomment after endpoints implemented
        } catch (error) {
            console.error('Error fetching favorite stops:', error);
        }
    };

    return (
        <div>
            <div className="favorites-container">
                <div className="favorites-box">
                    <h1>Favorite Stops</h1>
                    <ul>
                        {favoriteStops.map((stop, index) => (
                            <li key={index}>
                                <h3>{stop.name}</h3>
                                <ul>
                                    {stop.lines.map((line, lineIndex) => (
                                        <li key={lineIndex}>
                                            <h5>{`${line.line} (${line.headsign}) - Leaving in ${line.minutes} minutes`}</h5>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                    <button className="stopbuttons" onClick={addStop}>Add stop</button>
                    <button className="stopbuttons" onClick={removeStop}>Remove stop</button>
                </div>
            </div>
        </div>
    );
};


    // show favorite stops
    // visualize upcoming routes going to/from favorite stops using the current time? (just an idea)
    // add a favorite stop