import React from 'react';
import './navbar.css';
import DeviceFarmLogo from '../../assets/device-farm-logo.png';

export default class NavBar extends React.Component {
  render() {
    return (
      <div className="navbar-container">
        <div className="navbar-logo-container">
          <img src={DeviceFarmLogo} alt="Appium Device Farm" className="navbar-logo-image" />
        </div>
      </div>
    );
  }
}
