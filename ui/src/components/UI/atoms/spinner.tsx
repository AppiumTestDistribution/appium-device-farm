import React from 'react';
import styled from 'styled-components';
import Animation from './animation';

const Container = styled.div<{ size?: keyof typeof Sizes }>`
  width: ${(props) => {
    switch (props.size) {
      case 'XS':
        return '40px';
      case 'S':
        return '50px';
      case 'M':
        return '70px';
      case 'L':
        return '100px';
      case 'XL':
        return '200px';
      default:
        return '100px';
    }
  }};
`;

export enum Sizes {
  'XS' = 'XS',
  'S' = 'S',
  'M' = 'M',
  'L' = 'L',
  'XL' = 'XL',
}

type PropsType = {
  size?: keyof typeof Sizes;
};

export default function Spinner(props: PropsType) {
  const { size } = props;
  return (
    <Container size={size}>
      <Animation name="spinner" />
    </Container>
  );
}
