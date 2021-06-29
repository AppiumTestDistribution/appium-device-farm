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
            </PendingSessionsCount>
            <DevicesContainer platform={platformValue}/>
        </div>
    )
};
export default App;
