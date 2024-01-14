import './sidebar.css';
import DeviceFarmLogo from '../../assets/device-farm-logo.png';
import BuildsIcon from '../../assets/builds.svg';
import BuildsSelectedIcon from '../../assets/builds-selected.svg';
import DevicesIcon from '../../assets/devices-icon.svg';
import DevicesSelectedIcon from '../../assets/devices-icon-selected.svg';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const deviceFarmRoute = '/device-farm/';
  const buildsRoute = '/device-farm/builds';

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const renderSidebarButton = (path: string, icon: string, selectedIcon: string, alt: string) => {
    const isSelected = pathname === path;

    return (
      <button
        className={`sidebar-cta ${isSelected ? 'selected' : ''}`}
        onClick={() => navigate(path)}
        title={alt}
      >
        <img src={isSelected ? selectedIcon : icon} alt={alt} className="sidebar-cta-icon" />
      </button>
    );
  };
  return (
    <div className="sidebar-container">
      <img
        src={DeviceFarmLogo}
        alt="Appium Device Farm"
        className="sidebar-logo"
        onClick={() => navigate(deviceFarmRoute)}
      />
      <div className="sidebar-ctas">
        {renderSidebarButton(deviceFarmRoute, DevicesIcon, DevicesSelectedIcon, 'Devices')}
        {renderSidebarButton(buildsRoute, BuildsIcon, BuildsSelectedIcon, 'Builds')}
      </div>
    </div>
  );
};

export default Sidebar;
