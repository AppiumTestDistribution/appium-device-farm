import React from 'react';
import './header.css';
import DeviceFarmLogo from '../../assets/device-farm-logo.png';

export default class Header extends React.Component {
  render() {
    return (
      <div className="header-container">
        <div className="header-logo-container">
          <img src={DeviceFarmLogo} alt="Appium Device Farm" className="header-logo-image" />
          <div className="header-logo">Appium Device Farm</div>
        </div>
      </div>
    );
  }
}
