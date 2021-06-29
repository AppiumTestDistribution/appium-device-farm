import './App.css';
import DevicesContainer from './DevicesContainer';
import {DropdownButton} from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import {useState} from "react";
import PendingSessionsCount from "./PendingSessionsCount";

const App = () => {
    const [platformValue, setPlatformValue] = useState("Platform");
    const handleSelect = (value) => {
        setPlatformValue(value);
    }
    return (
        <div>
            <div className="header">
                <h1>Appium Device Farm</h1>
            </div>
            <PendingSessionsCount>
                <div className="platform">
                    <DropdownButton id="dropdown"
                                    title={platformValue}
                                    onSelect={handleSelect}
                    >
                        <Dropdown.Item eventKey="All">All</Dropdown.Item>
                        <Dropdown.Item eventKey="Android">Android</Dropdown.Item>
                        <Dropdown.Item eventKey="iOS">iOS</Dropdown.Item>
                    </DropdownButton>
                </div>
            </PendingSessionsCount>
            <DevicesContainer platform={platformValue}/>
        </div>
    )
};
export default App;
