import { Flowbite } from 'flowbite-react';
import './App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DeviceExplorer from './components/device-explorer/device-explorer';
import { AppLayout } from './components/layout/AppLayout';
import Builds from './pages/Builds';
import AppList from './components/apps/Apps';
import { EnhancedTrends } from './components/stats/trends';
import Login from './pages/Auth/Login';
import AdminDashboard from './pages/Auth/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { ConfigProvider } from './contexts/ConfigContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Users from './pages/Users/Users';
import Teams from './pages/Teams';
import Devices from './pages/Devices';
import Servers from './pages/Servers';
import ProfilePage from './pages/Profiles/ProfilePage';
import UseDevice from './pages/UseDevice/UseDevice';

// Protected route wrapper component
interface ProtectedRouteWrapperProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRouteWrapper: React.FC<ProtectedRouteWrapperProps> = ({
  children,
  adminOnly = false,
}) => {
  return (
    <ProtectedRoute adminOnly={adminOnly}>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
};

// Define route interface
interface ProtectedRoute {
  path: string;
  element: React.ReactNode;
  adminOnly?: boolean;
}

// Define routes configuration to avoid repetition
const protectedRoutes: ProtectedRoute[] = [
  { path: '/', element: <DeviceExplorer /> },
  { path: '/device-farm', element: <DeviceExplorer /> },
  { path: '/builds', element: <Builds /> },
  { path: '/device-farm/builds', element: <Builds /> },
  { path: '/device-farm/#builds', element: <Builds /> },
  { path: '/builds/:buildId/session/:sessionId', element: <Builds /> },
  { path: '/device-farm/builds/:buildId/session/:sessionId', element: <Builds /> },
  { path: '/apps', element: <AppList /> },
  { path: '/stats', element: <EnhancedTrends /> },
  { path: '/admin', element: <AdminDashboard />, adminOnly: true },
  { path: '/users', element: <Users />, adminOnly: true },
  { path: '/teams', element: <Teams />, adminOnly: true },
  { path: '/devices', element: <Devices />, adminOnly: true },
  { path: '/servers', element: <Servers /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/use-device/:udid', element: <UseDevice /> },
  // {
  //   path: '/servers/:nodeId/terminal',
  //   element: (
  //     <ProtectedRoute>
  //       <ServerTerminal />
  //     </ProtectedRoute>
  //   ),
  // },
];

function App() {
  return (
    <Flowbite>
      <ConfigProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            {protectedRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRouteWrapper adminOnly={route.adminOnly}>
                    {route.element}
                  </ProtectedRouteWrapper>
                }
              />
            ))}

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ConfigProvider>
    </Flowbite>
  );
}

export default App;
