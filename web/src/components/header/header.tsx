import React from 'react';
import './header.css';
export default class Header extends React.Component {
  render() {
    return (
      <div className="header-container">
        <div className="header-logo-container">
          <div className="header-logo">Appium Device Farm</div>
        </div>
      </div>
    );
  }
}
