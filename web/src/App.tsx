import React from 'react';
import './App.css';
import DeviceExplorer from './components/device-explorer/device-explorer';
import Header from './components/header/header';

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="app-body-container">
        <DeviceExplorer />
      </div>
    </div>
  );
}

export default App;
