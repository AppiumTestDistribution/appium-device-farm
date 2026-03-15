import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DeviceExplorer from '../components/device-explorer/device-explorer';

function RootRouter() {
  return (
    <Routes>
      <Route path="/" element={<DeviceExplorer />} />
    </Routes>
  );
}
export default RootRouter;
