import { Routes, Route } from 'react-router-dom';
import DeviceFarm from '../pages/DeviceFarm';
import Builds from '../pages/Builds';
import Session from '../pages/Session';
import ImageRenderer from '../components/AndroidSteam';
function RootRouter() {
  return (
    <Routes>
      <Route path="/" element={<DeviceFarm />} />
      <Route path="/builds" element={<Builds />} />
      <Route path="/builds/:buildId/session/:sessionId" element={<Session />} />
      <Route path="/androidStream" element={<ImageRenderer />} />
    </Routes>
  );
}
export default RootRouter;
