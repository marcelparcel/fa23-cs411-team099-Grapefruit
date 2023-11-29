import React from 'react';
import './planner.css';

export default function PlannerView() {
    // two textboxes (inputs), one for starting stop, one for destination stop - done
    // maybe a dropdown for the textboxes (that show the stops), so its easier for the user to find - TODO
    // another textbox(?) for the user to select a date and time (do not include year bc our data only has 1 year..) - done
    // a button that submits the two picked stops to the database - TODO
    // wait for return..
    // returns a visualization of the routes that go to both stops (in the correct order) given date/time - TODO
    // also returns the time of departure for each stop for the route ? - TODO

    return (
        <div className="planner-container">
            <div className="planner-box">
                <h1>Plan a trip</h1>
                <span className="input-text">Starting stop: </span>
                <input type="text" placeholder="Start" />
                <span className="input-text">Destination stop: </span>
                <input type="text" placeholder="End" />
                <span className="input-text">Date & Time: </span>
                <input type="datetime-local" placeholder="Date" />
                <button className="plannerbutton">Find routes</button>
            </div>
        </div>
    );
}