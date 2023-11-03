import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

type PropsType = {
  children: string | JSX.Element;
};

export default function Centered(props: PropsType) {
  const { children } = props;
  return <Container>{children}</Container>;
}
