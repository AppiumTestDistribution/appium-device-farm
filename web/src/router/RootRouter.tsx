import { Routes, Route } from 'react-router-dom';
import DeviceFarm from '../pages/DeviceFarm';
import Builds from '../pages/Builds';

function RootRouter() {
  return (
    <Routes>
      <Route path="/device-farm" element={<DeviceFarm />} />
      <Route path="/device-farm/builds" element={<Builds />} />
    </Routes>
  );
}

export default RootRouter;
