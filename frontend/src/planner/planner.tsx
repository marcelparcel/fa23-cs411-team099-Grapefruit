import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import axios from 'axios';
import './planner.css';

export default function PlannerView() {
    const navigate = useNavigate();
    interface Stop {
        Name: string;
        StopId: number;
    }
    interface EndStop {
        Name: string;
        StopId: number;
        TripId: string;
    }
    const [textInput, setTextInput] = useState<string>('');
    const [startInput, setStartInput] = useState<Stop | null>({Name: '', StopId: 0});
    const [matchingStops, setMatchingStops] = useState<Stop[]>([]);
    const [endInput, setEndInput] = useState<EndStop | null>({Name: '', StopId: 0, TripId: ''});
    const [matchingEndStops, setMatchingEndStops] = useState<EndStop[]>([]);
    const [allStops, setAllStops] = useState<Stop[]>([]);
    const [isEndStopsLoaded, setIsEndStopsLoaded] = useState(false);

    const fetchStartStops = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:4000/stop');
            const stopData = response.data;
            const stopNames: Stop[] = Array.from(new Set(stopData.map(stop => ({
                Name: stop.Name || '',
                StopId: stop.StopId || ''
            }))));
            setAllStops(stopNames || []);
        } catch (error) {
            console.error('Error fetching stops:', error);
        }
    }, []);

    const fetchEndStops = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:4000/trip?stopid=${startInput.StopId}`);
            const tripData = response.data;
            const stopMap: Map<number, EndStop> = new Map();
            const tripStopsPromises = tripData.map(trip => axios.get(`http://localhost:4000/stop?tripid=${trip.TripId}`));
            const tripStopsData = await Promise.all(tripStopsPromises);
            tripStopsData.forEach(response => {
                const stopData = response.data;
                stopData.forEach(stop => {
                const stopId = stop.StopId || '';
                if (!stopMap.has(stopId)) {
                    stopMap.set(stopId, {
                        Name: stop.Name,
                        StopId: stopId,
                        TripId: stop.TripId
                        });
                    }
                });
            });
            const tripStopNames: EndStop[] = Array.from(stopMap.values());
            setMatchingEndStops(tripStopNames || []);
            console.log(tripStopNames);
        } catch (error) {
            console.error('Error fetching stops:', error);
        }
    }, [startInput.StopId]);

    useEffect(() => {
        fetchStartStops();
    }, [fetchStartStops]);

    useEffect(() => {
        fetchEndStops();
        setIsEndStopsLoaded(true);
    }, [startInput, fetchEndStops]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setIsEndStopsLoaded(false);
        setTextInput(inputValue);
        const filteredStops = allStops.filter((stop) =>
            (stop.Name).toLowerCase().includes(inputValue.toLowerCase())
        );
        const limitedResults = filteredStops.slice(0, 50);
        setMatchingStops(limitedResults);
    };

    const handleSelectStartStop = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStopName = event.target.options[event.target.selectedIndex].text;
        const selectedStop: Stop = allStops.find(stop => stop.Name === selectedStopName);
        setStartInput(selectedStop);
        setTextInput(selectedStopName);
        setMatchingStops([selectedStop]);
    };
    
    const handleSelectEndStop = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStopId = parseInt(event.target.value, 10);
        const selectedStop: EndStop = matchingEndStops.find(stop => stop.StopId === selectedStopId);
        setEndInput(selectedStop);
        console.log(selectedStop);
    };

    const handleResults = () => {
        if (startInput.Name !== '' && endInput.Name !== '') {
            const queryParams = {
            stop1: startInput.StopId.toString(),
            stop2: endInput.StopId.toString(),
            trip: endInput.TripId
            };

            navigate({
                pathname: '/results',
                search: `?${createSearchParams(queryParams)}`
            });
        }
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
                        value={textInput}
                        onInput={handleInputChange}
                    />
                    {matchingStops && matchingStops.length > 1 && (
                        <select
                            size={matchingStops.length > 10 ? 10 : matchingStops.length}
                            onInput={handleSelectStartStop}>
                            value={startInput.StopId}
                            {matchingStops.map(stop => (
                                <option key={stop ? stop.StopId : ''} value={stop ? stop.StopId : ''}>{stop ? stop.Name : ''}</option>
                            ))}
                        </select>
                    )}
                </div>
                {isEndStopsLoaded && (<span className="input-text">Destination stop: </span>)}
                {matchingStops && matchingStops.length === 0 && (<span className="input-text">No destinations at this time</span>)}
                {!(matchingStops && matchingStops.length === 0) && isEndStopsLoaded && (<div className="dropinput">
                    <select className="endSelect"
                        size={matchingEndStops.length > 10 ? 10 : matchingEndStops.length}
                        onInput={handleSelectEndStop}
                        value={endInput.StopId}>
                        {matchingEndStops.map(stop => (
                            <option key={stop ? stop.StopId : ''} value={stop ? stop.StopId : ''}>{stop ? stop.Name : ''}</option>
                        ))}
                    </select>
                </div>)}
                <span className="input-text">Date & Time: </span>
                <input type="datetime-local" placeholder="Date" />
                <button className="plannerbutton" onClick={handleResults}>Find routes</button>
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