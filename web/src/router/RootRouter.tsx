import { Routes, Route } from 'react-router-dom';
import DeviceFarm from '../pages/DeviceFarm';
import Builds from '../pages/Builds';
import Session from '../pages/Session';

function RootRouter() {
  return (
    <Routes>
      <Route path="/device-farm" element={<DeviceFarm />} />
      <Route path="/device-farm/builds" element={<Builds />} />
      <Route path="/device-farm/builds/:buildId/session/:sessionId" element={<Session />} />
    </Routes>
  );
}

export default RootRouter;
