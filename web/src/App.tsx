import React from 'react';
import './App.css';
import DeviceExplorer from './components/device-explorer/device-explorer';
import NavBar from './components/navbar/navbar';
import { Routes, Route, HashRouter, Navigate } from 'react-router-dom';
import { SessionExplorer } from './components/session-explorer';
import BuildsPage from './components/builds';

function App() {
  return (
    <div className="app-container">
      <HashRouter>
        <NavBar />
        <div className="app-body-container">
          <Routes>
            {/* <Route exact path="/dashboard" component={Dashboard} /> */}
            <Route path="*" element={<Navigate replace to="/devices" />} />
            <Route path="/devices" element={<DeviceExplorer />} />
            <Route path="/builds" element={<BuildsPage />} />
            <Route path="/builds/:buildId" element={<BuildsPage />} />
            <Route path="/builds/:buildId/sessions/:sessionId" element={<BuildsPage />} />
            <Route path="/sessions" element={<SessionExplorer />} />
            <Route path="/sessions/:sessionId" element={<SessionExplorer />} />
          </Routes>
        </div>
      </HashRouter>
    </div>
  );
}

export default App;
