import React from 'react';
import './App.css';
import DeviceExplorer from './components/device-explorer/device-explorer';
import NavBar from './components/navbar/navbar';
import { HashRouter } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <div className="app-container">
        <NavBar />
        <div className="app-body-container">
          <DeviceExplorer />
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
