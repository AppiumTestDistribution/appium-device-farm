import React from 'react';
import styled from 'styled-components';
import Icon, { Sizes } from '../atoms/icon';

const Container = styled.div`
  padding: 12px 10px;
`;

const Header = styled.h3``;

const IconContainer = styled.span`
  position: relative;
  top: 2px;
`;

const Title = styled.span`
  vertical-align: middle;
  font-size: 18px;
  margin-left: 10px;
`;

export default function HeaderLogo() {
  return (
    <Container>
      <Header>
        <IconContainer>
          <Icon name="home" size={Sizes.XL} />
        </IconContainer>
        <Title>APPIUM DASHBOARD</Title>
      </Header>
    </Container>
  );
}
