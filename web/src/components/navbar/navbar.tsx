import React from 'react';
import styled from 'styled-components';
import Icon, { Sizes } from '../icons';
import FlexContainer from '../../layouts/flex-container';
import { NavLink } from 'react-router-dom';
import DeviceFarmLogo from '../../assets/device-farm-logo.png';

const Container = styled(FlexContainer)`
  width: 70px;
  height: 100%;
  position: relative;
  background: #15252b;
  flex-direction: row;
`;

const NavMenuContainer = styled.div`
  position: absolute;
  top: 20%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-contents: center;
`;

const NavFooter = styled(NavMenuContainer)`
  bottom: 10%;
  top: unset;
`;

const NavMenuItem = styled(NavLink)<{ active?: boolean }>`
  color: #fff;
  margin: 15px 4px 15px 0;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 5px 0 5px 0;

  .icon {
    padding-left: 25px;
  }

  &.active {
    border-right: 3px solid #2cccd5;
    color: #2cccd5;

    .icon {
      color: #2cccd5;
    }
  }

  @keyframes fade_in_show {
    0% {
      opacity: 0;
      transform: scale(0);
    }

    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const LogoContainer = styled(FlexContainer)`
  align-self: flex-start;
  padding-top: 10px;
`;

const LogoIcon = styled.div`
  height: 60px;
  width: 60px;
`;

const menuItems = [
  {
    name: 'devices',
    icon: 'devices',
    tooltip: 'Devices',
    path: '/devices',
  },
  {
    name: 'sessions',
    icon: 'launch',
    tooltip: 'Sessions',
    path: '/sessions',
  },
];

export default function NavBar() {
  const getMenuItems = () => {
    return menuItems.map((menu, index) => (
      <NavMenuItem
        to={menu.path}
        key={index}
        className={(isActive) => (isActive ? 'active' : 'inactive')}
      >
        <Icon name={menu.icon} size={Sizes.XXL} tooltip={menu.tooltip} tooltipPosition="right" />
      </NavMenuItem>
    ));
  };

  return (
    <Container>
      <LogoContainer>
        <LogoIcon>
          <img
            src={DeviceFarmLogo}
            alt="Appium Device Farm"
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
            }}
          />
        </LogoIcon>
      </LogoContainer>
      <NavMenuContainer>{getMenuItems()}</NavMenuContainer>
      {/* <NavFooter>
        <ThemeSwitch />
      </NavFooter> */}
    </Container>
  );
}
