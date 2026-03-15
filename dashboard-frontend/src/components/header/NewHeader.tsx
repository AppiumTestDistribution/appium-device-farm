import React, { useState } from 'react';
import DevicesIcon from '@mui/icons-material/Devices';
import HandymanIcon from '@mui/icons-material/Handyman';
import { Apps, BarChart } from '@mui/icons-material';
import UserMenu from '../auth/UserMenu';

const NewHeader: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('devices');

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <div className="bg-[#0F172A]">
      <nav className="container mx-auto px-4">
        <div className="flex items-center h-16 justify-between">
          <div className="flex items-center">
            <a className="flex items-center" href="/device-farm">
              <span className="text-xl font-semibold text-white">Device Farm</span>
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                selectedTab === 'devices'
                  ? 'bg-yellow-400 text-black font-medium'
                  : 'text-white hover:bg-gray-700'
              }`}
              onClick={() => {
                handleTabClick('devices');
                window.location.href = '/device-farm';
              }}
            >
              <DevicesIcon fontSize="small" />
              <span>Devices</span>
            </button>

            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                selectedTab === 'builds'
                  ? 'bg-yellow-400 text-black font-medium'
                  : 'text-white hover:bg-gray-700'
              }`}
              onClick={() => {
                handleTabClick('builds');
                window.location.href = '/device-farm/#builds';
              }}
            >
              <HandymanIcon fontSize="small" />
              <span>Builds</span>
            </button>

            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                selectedTab === 'apps'
                  ? 'bg-yellow-400 text-black font-medium'
                  : 'text-white hover:bg-gray-700'
              }`}
              onClick={() => {
                handleTabClick('apps');
                window.location.href = '/device-farm/#apps';
              }}
            >
              <Apps fontSize="small" />
              <span>Apps</span>
            </button>

            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                selectedTab === 'stats'
                  ? 'bg-yellow-400 text-black font-medium'
                  : 'text-white hover:bg-gray-700'
              }`}
              onClick={() => {
                handleTabClick('stats');
                window.location.href = '/device-farm/#stats';
              }}
            >
              <BarChart fontSize="small" />
              <span>Stats</span>
            </button>

            <UserMenu />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NewHeader;
