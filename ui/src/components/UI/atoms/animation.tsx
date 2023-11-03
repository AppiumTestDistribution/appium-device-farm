import React from 'react';
import Lottie from 'lottie-react';
import styled from 'styled-components';
import spinner from '../../../assets/lottie/spinner.json';

const Container = styled.div<{ width?: string }>`
  width: ${(props) => props.width};
`;

type PropsType = {
  name: string;
  width?: string;
};

export default function Animation(props: PropsType) {
  const { name, width } = props;
  let animationData;

  switch (name) {
    case 'spinner':
      animationData = spinner;
      break;
    default:
      animationData = {};
      break;
  }

  return (
    <Container width={width}>
      <Lottie animationData={animationData} />
    </Container>
  );
}
