import React, { useEffect, useState } from 'react'; // add useState later...
import './favorites.css';
import axios from 'axios';

interface AccountViewProps {
    isLoggedIn: boolean;
    userEmail: string;
}

interface Stop {
    Name: string;
    StopId: number;
  }

export const FavoritesView: React.FC<AccountViewProps> = ({ isLoggedIn, userEmail }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [matchingStops, setMatchingStops] = useState<string[]>([]);
    const [allStopNames, setAllStopNames] = useState<string[]>([]);
    const [stopInput, setStopInput] = useState('');
    const [allStops, setAllStops] = useState<Stop[]>([]);

    var Stop1 = null;
    var Stop2 = null;
    var Stop3 = null;
    // const [favoriteStops, setFavoriteStops] = useState([Stop1, Stop2, Stop3]); uncomment after endpoint implemented


    // placeholder for now..
    useEffect(() => {
        // Fetch favorite stops from the API on component mount
        console.log("in useeffect");
        fetchFavoriteStops();
    }, []);

    useEffect(() => {
        // console.log("in useeffect");
        fetchStops();
    }, []);


    const favoriteStops = [ 
        /* {
            name: "eeeeeeeeeeeeeeeeeeeeeeeeeeee",
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
        } */
    ];

    const removeStop = () => {
        // use delete/put endpoint
        fetchFavoriteStops(); // update
    }

    const findStopIdByName = (name: string): number | undefined => {
        const foundStop = allStops.find(stop => stop.Name === name);
        return foundStop?.StopId;
    };

    const getStop = (stopInput) => {
        addStop(findStopIdByName(stopInput));
    };

    const addStop = async (stop_1: number) => {
        try {
            await axios.post('http://localhost:4000/fav', {
                email: userEmail,
                StopId1: stop_1
            }).then(response => {
                // Assuming successful signup returns some data
                if (response.data) {
                    console.log("showing stops:");
                    console.log(response.data);
                }
                }).catch(function (error) {
                if (error.response) {
                  console.log(error.response);
                }
              });
            // setFavoriteStops(data); uncomment after endpoints implemented
        } catch (error) {
            console.error('Error fetching favorite stops:', error);
        }


        fetchFavoriteStops(); // update
        
    }

    
    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setStopInput(inputValue);

        const filteredStops = allStopNames.filter((stop) =>
            stop.toLowerCase().includes(inputValue.toLowerCase())
        );

        const limitedResults = filteredStops.slice(0, 10);

        // Update the state with the filtered and limited stops
        setMatchingStops(limitedResults);
    };

    const handleSelectStop = (selectedStop: string) => {
        // Update the input box with the selected stop
        setStopInput(selectedStop);

        // Clear the matching stops (close the dropdown)
        setMatchingStops([]);
    };

    const fetchStops = async () => {
        try {
            const response = await fetch('http://localhost:4000/stop');
            const data = await response.json();

            const stopNames: string[] = Array.from(new Set(data.map(stop => stop.Name || '')));
            
            const stops: Stop[] = data.map(stop => ({
                Name: stop.Name,
                StopId: stop.StopId
              }));

            setAllStops(stops);
            setAllStopNames(stopNames || []);
            setMatchingStops(data.stops || []);
        } catch (error) {
            console.error('Error fetching stops:', error);
        }
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const fetchFavoriteStops = async () => {
        if (isLoggedIn) {
            try {
                await axios.get('http://localhost:4000/fav', {
                    params: {
                        email: userEmail
                    }
                }).then(response => {
                    // Assuming successful signup returns some data
                    if (response.data) {
                        console.log("showing stops:");
                        console.log(response.data);
                    }
                    }).catch(function (error) {
                    if (error.response) {
                    console.log("something went wrong..");
                    }
                });
                // setFavoriteStops(data); uncomment after endpoints implemented
            } catch (error) {
                console.error('Error fetching favorite stops:', error);
            }
        }
    };

    return (
        <div>
            <div className="favorites-container">
                <div className="favorites-box">
                    <h1>Favorite Stops</h1>
                    {isPopupOpen && (
                        <div className="popup-overlay">
                            <div className="popup-content">
                                <h2>Add Stop</h2>
                                <div className="dropinput-fav">
                                    <input
                                        type="text"
                                        placeholder="Type in a stop..."
                                        value={stopInput}
                                        onChange={handleInputChange}
                                    />
                                    {matchingStops && matchingStops.length > 0 && (
                                        <select
                                            size={matchingStops.length > 10 ? 10 : matchingStops.length}
                                            onChange={(e) => handleSelectStop(e.target.value)}
                                        >
                                            {matchingStops.map(stop => (
                                                <option key={stop} value={stop}>{stop}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div>
                                {/* <button className="stopbuttons" onClick={getStop(stopInput)}>Add</button> */}
                                <button className="stopbuttons" onClick={closePopup}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {favoriteStops.length === 0 ? (
                    <p>You have no favorite stops yet :(</p>
                    ) : (
                        <ul>
                            {favoriteStops.map((stop, index) => (
                                <li className="stopli" key={index}>
                                    <h3 className="stopnames">{stop.name}</h3>
                                    <ul className="stopbox">
                                        {stop.lines.map((line, lineIndex) => (
                                            <li className="stopdepartures" key={lineIndex}>
                                                <h5>{`${line.line} (${line.headsign}) - Leaving in ${line.minutes} minutes`}</h5>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                        )}
                    <div>
                        <button className="stopbuttons" onClick={openPopup}>Add stop</button>
                        <button className="stopbuttons" onClick={removeStop}>Remove stop</button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};


    // show favorite stops
    // visualize upcoming routes going to/from favorite stops using the current time? (just an idea)
    // add a favorite stop