import { Routes, Route } from 'react-router-dom';
import DeviceFarm from '../pages/DeviceFarm';
import Builds from '../pages/Builds';
import Session from '../pages/Session';

function RootRouter() {
  return (
    <Routes>
      <Route path="/" element={<DeviceFarm />} />
      <Route path="/builds" element={<Builds />} />
      <Route path="/builds/:buildId/session/:sessionId" element={<Session />} />
    </Routes>
  );
}

export default RootRouter;
