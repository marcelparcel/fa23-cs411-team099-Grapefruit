import React, { useState, useEffect } from 'react';
import './planner.css';

export default function PlannerView() {
    const [startInput, setStartInput] = useState('');
    const [matchingStops, setMatchingStops] = useState<string[]>([]);
    const [allStops, setAllStops] = useState<string[]>([]);
    
    useEffect(() => {
        // console.log("in useeffect");
        fetchStops();
    }, []);

    const fetchStops = async () => {
        try {
            const response = await fetch('http://localhost:4000/stop');
            const data = await response.json();
            
            const stopNames: string[] = Array.from(new Set(data.map(stop => stop.Name || '')));
            //console.log("stopnames1: \n");
            //console.log(stopNames);
            setAllStops(stopNames || []);
            setMatchingStops(data.stops || []);
        } catch (error) {
            console.error('Error fetching stops:', error);
        }
    };


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setStartInput(inputValue);

        const filteredStops = allStops.filter((stop) =>
            stop.toLowerCase().includes(inputValue.toLowerCase())
        );

        const limitedResults = filteredStops.slice(0, 10);

        // Update the state with the filtered and limited stops
        setMatchingStops(limitedResults);
    };

    const handleSelectStop = (selectedStop: string) => {
        // Update the input box with the selected stop
        setStartInput(selectedStop);

        // Clear the matching stops (close the dropdown)
        setMatchingStops([]);
    };

    return (
        <div className="planner-container">
            <div className="planner-box">
                <h1>Plan a trip</h1>
                <span className="input-text">Starting stop: </span>
                <div className="dropinput">
                    <input
                        type="text"
                        placeholder="Start"
                        value={startInput}
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
                <span className="input-text">Destination stop: </span>
                <input type="text" placeholder="End" />
                <span className="input-text">Date & Time: </span>
                <input type="datetime-local" placeholder="Date" />
                <button className="plannerbutton">Find routes</button>
            </div>
        </div>
    );
}

    // two textboxes (inputs), one for starting stop, one for destination stop - done
    // maybe a dropdown for the textboxes (that show the stops), so its easier for the user to find - TODO
    // another textbox(?) for the user to select a date and time (do not include year bc our data only has 1 year..) - done
    // a button that submits the two picked stops to the database - TODO
    // await for return..
    // returns a visualization of the routes that go to both stops (in the correct order) given date/time - TODO
    // also returns the time of departure for beginning stop for the route ? - TODO