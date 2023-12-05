import React, { useEffect, useState, useCallback } from 'react'; // add useState later...
import './favorites.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AccountViewProps {
    isLoggedIn: boolean;
    userEmail: string;
}

interface Stop {
    Name: string;
    StopId: number;
  }

export const FavoritesView: React.FC<AccountViewProps> = ({ isLoggedIn, userEmail }) => {
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [isRemovePopupOpen, setIsRemovePopupOpen] = useState(false);
    const [matchingStops, setMatchingStops] = useState<string[]>([]);
    const [allStopNames, setAllStopNames] = useState<string[]>([]);
    const [stopInput, setStopInput] = useState('');
    const [allStops, setAllStops] = useState<Stop[]>([]);
    const [favoriteStops, setFavoriteStops] = useState<number[]>([]); // array of stopIds
    const [selectedStopId, setSelectedStopId] = useState<number | null>(null); // new state for selected stop ID
    const [stopTrips, setStopTrips] = useState<{ [stopId: number]: any[] }>({});

    const navigate = useNavigate();




    useEffect(() => {
        // console.log("in useeffect");
        fetchStops();
    }, []);

    // let time = "11/10/2015 10:00:00";

    // function getUTCDate(dateString) {
    // // dateString format will be "MM/DD/YYYY HH:mm:ss"
    // var [date, time] = dateString.split(" ");
    // var [month, day, year] = date.split("/");
    // var [hours, minutes, seconds] = time.split(":");
    // return new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds)).toUTCString();
    // }

    function prettyTime(timeString: string) {
        var [hours, minutes] = timeString.split(":");
        return hours+":"+minutes;
    }

    const fetchTripsForFavoriteStops = useCallback(async () => {
        console.log("fetching trips for favorite stops..");
        try {
          // Create a temporary object to hold the updated stopTrips state
          const updatedStopTrips: { [stopId: number]: any[] } = {};
    
          // Loop through favoriteStops and call the API for each stop
          for (const stop of favoriteStops) {
            var today = new Date();
            try {
              const response = await axios.get('http://localhost:4000/trip', {
                params: {
                  stopid: stop,
                  day: today.getDay()
                }
              });
    
              // Assuming successful API call returns some data
              if (response.data) {
                console.log("API call successful:");
                console.log(response.data);
    
                // Update the temporary object with trip information for the current stop
                updatedStopTrips[stop] = response.data;
              }
            } catch (error) {
              console.error('Error fetching trips:', error);
            }
          }
    
          // Update the state with the new stopTrips object
          setStopTrips(updatedStopTrips);
        } catch (error) {
          console.error('Error fetching trips for favorite stops:', error);
        }
      }, [favoriteStops]);

    const removeStop = async (stop: number) => {
        try {
            await axios.delete('http://localhost:4000/fav', {
                params: {
                    email: userEmail,
                    stopid: stop
                }
            }).then(response => {
                // Assuming successful signup returns some data
                if (response.data) {
                    console.log("delete successful:");
                }
                }).catch(function (error) {
                if (error.response) {
                  console.log(error.response);
                }
                
              });
        } catch (error) {
            console.error('Error fetching favorite stops:', error);
        }


        fetchFavoriteStops(); // update
        setIsRemovePopupOpen(false);
        
    }

    const addStop = async (stop: number) => {
        try {
            await axios.post('http://localhost:4000/fav', {
                email: userEmail,
                stopid: stop
            }).then(response => {
                // Assuming successful signup returns some data
                if (response.data) {
                    console.log("post successful:");
                    //setFavoriteStops(response.data[0]);
                }
                }).catch(function (error) {
                if (error.response) {
                  console.log(error.response);
                }
                
              });
        } catch (error) {
            console.error('Error fetching favorite stops:', error);
        }


        fetchFavoriteStops(); // update
        setIsAddPopupOpen(false);
        
    }

    
    const openAddPopup = () => {
        setIsAddPopupOpen(true);
    };
    const openRemovePopup = () => {
        setIsRemovePopupOpen(true);
    };
    const closeAddPopup = () => {
        setIsAddPopupOpen(false);
    };
    const closeRemovePopup = () => {
        setIsRemovePopupOpen(false);
    };

    const findStopIdByName = (name: string): number | undefined => {
        const foundStop = allStops.find(stop => stop.Name === name);
        return foundStop?.StopId;
    };

    const findStopNameById = (id: number): string | undefined => {
        const foundStop = allStops.find(stop => stop.StopId === id);
        return foundStop?.Name;
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

    const handleSelectStopAdd = (selectedStop: string) => {
        // Update the input box with the selected stop
        setStopInput(selectedStop);
        setMatchingStops([]); // close dropdown
    };

    const handleSelectStopRemove = (selected_stop: number) => {
        // Update the input box with the selected stop
        console.log(selectedStopId);
        setSelectedStopId(selected_stop);
        setMatchingStops([]); // close dropdown
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

    const fetchFavoriteStops = useCallback(async () => {
        if (isLoggedIn) {
          try {
            await axios.get('http://localhost:4000/fav', {
              params: {
                email: userEmail
              }
            }).then(response => {
              if (response.data) {
                const favoriteStops = response.data.map(stop => stop.StopId);
                setFavoriteStops(favoriteStops);
              }
            }).catch(function (error) {
              if (error.response) {
                console.log("something went wrong..");
              }
            });
          } catch (error) {
            console.error('Error fetching favorite stops:', error);
          }
        } else {
          navigate('/login');
        }
      }, [isLoggedIn, userEmail, navigate, setFavoriteStops]);

      useEffect(() => {
        // Fetch favorite stops from the API on component mount
        fetchFavoriteStops();
      }, [fetchFavoriteStops]);

      useEffect(() => {
        // Fetch trips for favorite stops when favoriteStops changes
        fetchTripsForFavoriteStops();
      }, [favoriteStops, fetchTripsForFavoriteStops]);

    return (
        <div>
            <div className="favorites-container">
                <div className="favorites-box">
                    <h1>Favorite Stops</h1>
                    {isAddPopupOpen && (
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
                                            onChange={(e) => handleSelectStopAdd(e.target.value)}
                                        >
                                            {matchingStops.map(stop => (
                                                <option key={stop} value={stop}>{stop}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div>
                                    <button className="stopbuttons" onClick={() => addStop(findStopIdByName(stopInput))}>Add</button>
                                    <button className="stopbuttons" onClick={closeAddPopup}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {isRemovePopupOpen && (
                        <div className="popup-overlay">
                            <div className="popup-content">
                                <h2>Remove Stop</h2>
                                <div className="dropinput-fav-del">
                                    {favoriteStops && favoriteStops.length > 0 && (
                                        <select
                                            size={favoriteStops.length > 10 ? 10 : favoriteStops.length}
                                            onClick={(e) => handleSelectStopRemove(Number((e.target as HTMLSelectElement).value))}
                                            onChange={(e) => handleSelectStopRemove(Number((e.target as HTMLSelectElement).value))}
                                        >
                                            {favoriteStops.map(stop => (
                                                <option 
                                                key={stop} 
                                                value={stop}
                                                onClick={(e) => handleSelectStopRemove(Number((e.target as HTMLSelectElement).value))}
                                                >{findStopNameById(stop)}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div>
                                    <button className="stopbuttons" onClick={() => removeStop(selectedStopId)}>Remove</button>
                                    <button className="stopbuttons" onClick={closeRemovePopup}>Cancel</button>
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
                                    <h3 className="stopnames">{findStopNameById(stop)}</h3>
                                    <ul className="stopbox">
                                    {stopTrips[stop]?.map((trip, tripIndex) => (
                                        <li className="stopdepartures" key={tripIndex}>
                                            <h5>{`${trip.RouteId} (${trip.Headsign}) - Leaving at ${prettyTime(trip.Time)}`}</h5>
                                        </li>
                                    ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                        )}
                    <div>
                        <button className="stopbuttons" onClick={openAddPopup}>Add stop</button>
                        <button className="stopbuttons" onClick={openRemovePopup}>Remove stop</button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};