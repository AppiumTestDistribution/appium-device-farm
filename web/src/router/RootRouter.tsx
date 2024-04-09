import { Routes, Route } from 'react-router-dom';
import DeviceFarm from '../pages/DeviceFarm';
import Builds from '../pages/Builds';
import Session from '../pages/Session';
import AndroidStream from '../components/streaming/AndroidStream';
import IOSStream from '../components/streaming/ios-stream.tsx';
function RootRouter() {
  return (
    <Routes>
      <Route path="/" element={<DeviceFarm />} />
      <Route path="/builds" element={<Builds />} />
      <Route path="/builds/:buildId/session/:sessionId" element={<Session />} />
      <Route path="/androidStream" element={<AndroidStream />} />
      <Route path="/iOSStream" element={<IOSStream />} />
    </Routes>
  );
}
export default RootRouter;
