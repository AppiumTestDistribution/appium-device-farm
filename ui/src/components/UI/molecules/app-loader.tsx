import React from 'react';
import styled from 'styled-components';
import Spinner, { Sizes } from '../atoms/spinner';
import Centered from './centered';

const Container = styled.div`
  height: 100vh;
`;

const Message = styled.p`
  text-align: center;
`;

export default function AppLoader() {
  return (
    <Container>
      <Centered>
        <>
          <Spinner size={Sizes.XL} />
          <Message>Loading</Message>
        </>
      </Centered>
    </Container>
  );
}
