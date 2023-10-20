import React from 'react';
import './App.css';
import DeviceExplorer from './components/device-explorer/device-explorer';
import NavBar from './components/navbar/navbar';

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <div className="app-body-container">
        <DeviceExplorer />
      </div>
    </div>
  );
}

export default App;
