import React from 'react';
import styled from 'styled-components';
import Banner from './centered';

const Message = styled.p<{ size?: keyof typeof EmptyMessageSize }>`
  font-size: ${(props) => props.size || EmptyMessageSize.XL};
`;

export enum EmptyMessageSize {
  'L' = '10px',
  'XL' = '15px',
  'XXL' = '20px',
}

export type PropsType = {
  children: string;
  size?: keyof typeof EmptyMessageSize;
};

export default function EmptyMessage(props: PropsType) {
  const { size, children } = props;

  return (
    <Banner>
      <Message size={size}>{children}</Message>
    </Banner>
  );
}
