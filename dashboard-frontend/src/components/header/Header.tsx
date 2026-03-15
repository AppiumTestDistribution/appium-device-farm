import { useState, useEffect } from 'react';
import { Devices, Build, Apps, QueryStats, GitHub, DnsRounded } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { logo } from './logo';
import { useAuth } from '../../contexts/AuthContext';
import ProfilePopup from './ProfilePopup';
import Avatar from '../common/Avatar';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState('devices');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout, isAdmin, isAuthDisabled } = useAuth();

  useEffect(() => {
    if (location.pathname.startsWith('/servers/') || location.pathname.includes('/server/')) {
      setSelectedTab('servers');
    } else {
      // Map the current path to the corresponding tab
      const path = location.pathname;
      const matchingMenuItem = menuItems.find(
        (item) => path === item.path || (item.id === 'devices' && path === '/device-farm'),
      );
      if (matchingMenuItem) {
        setSelectedTab(matchingMenuItem.id);
      }
    }
  }, [location]);

  const menuItems = [
    { id: 'devices', icon: Devices, label: 'Devices', path: '/' },
    { id: 'builds', icon: Build, label: 'Builds', path: '/builds' },
    { id: 'apps', icon: Apps, label: 'Apps', path: '/apps' },
    { id: 'stats', icon: QueryStats, label: 'Stats', path: '/stats' },
    { id: 'servers', icon: DnsRounded, label: 'Servers', path: '/servers' },
  ];

  const handleNavigation = (id: string, path: string) => {
    setSelectedTab(id);
    if (id === 'devices' && location.pathname === '/device-farm' && !location.hash) {
      return;
    }
    navigate(path);
  };

  const handleProfileOpen = () => {
    setIsProfileOpen(true);
  };

  const handleProfileClose = () => {
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleProfileClose();
    navigate('/device-farm/#/');
  };

  return (
    <div className="sticky top-0 z-50 bg-[#0F172A] shadow-lg border-b border-gray-700">
      <nav aria-label="top" className="container mx-auto px-4">
        <div className="flex items-stretch justify-between h-16">
          <div className="flex items-stretch">
            <a
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('devices', '/device-farm');
              }}
              aria-current="false"
              tabIndex={0}
              className="flex items-center group cursor-pointer"
              href="/device-farm"
            >
              <img
                src={logo}
                className="h-10 w-auto transition-transform duration-200 group-hover:scale-105"
                alt="Device Farm Logo"
              />
              <span className="text-xl font-semibold text-white ml-3">
                Device Farm
              </span>
            </a>

            <div className="flex items-stretch ml-8">
              {menuItems.map(({ id, icon: Icon, label, path }) => (
                <button
                  key={id}
                  className={`
                    relative flex items-center gap-2 px-4
                    transition-all duration-200 
                    ${
                      selectedTab === id
                        ? 'text-white border-b-2 border-yellow-400'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
                    }
                  `}
                  onClick={() => handleNavigation(id, path)}
                >
                  <Icon
                    className={`transition-all duration-200 ${
                      selectedTab === id ? 'text-yellow-400' : 'group-hover:text-gray-200'
                    }`}
                    fontSize="small"
                  />
                  <span className="font-medium text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/AppiumTestDistribution/appium-device-farm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="View on GitHub"
            >
              <GitHub className="w-6 h-6" />
            </a>

            {/* User Menu */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-md text-white hover:bg-gray-700"
                onClick={handleProfileOpen}
              >
                <Avatar
                  firstname={user?.firstname || ''}
                  lastname={user?.lastname || ''}
                  size="sm"
                  variant="text"
                />
                <span>{user?.username}</span>
              </button>

              <ProfilePopup
                isOpen={isProfileOpen}
                onClose={handleProfileClose}
                username={user?.username || ''}
                isAdmin={isAdmin()}
                onLogout={handleLogout}
                isAuthDisabled={isAuthDisabled}
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
