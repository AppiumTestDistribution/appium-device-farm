import { Routes, Route } from 'react-router-dom';
import DeviceFarm from '../pages/DeviceFarm';

function RootRouter() {
  return (
    <Routes>
      <Route path="/device-farm" element={<DeviceFarm />} />
    </Routes>
  );
}

export default RootRouter;
