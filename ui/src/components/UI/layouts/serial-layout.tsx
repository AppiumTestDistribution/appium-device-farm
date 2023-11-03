import React from 'react';
import styled from 'styled-components';

const RowContainer = styled.div<{
  height?: string;
  padding?: string;
  scrollable?: boolean;
  align?: string;
}>`
  height: ${(props) => props.height};
  display: flex;
  padding: ${(props) => props.padding};
  text-align: ${(props) => props.align};
  ${(props) => (props.scrollable ? 'overflow: auto' : '')};

  & > * {
    height: 100%;
    width: 100%;
  }
`;

type RowPropsType = {
  className?: string;
  children: JSX.Element;
  height?: string;
  padding?: string;
  scrollable?: boolean;
  align?: 'center' | 'left' | 'right';
};

export function Row(props: RowPropsType) {
  const { children, className, height, padding, scrollable, align } = props;
  return (
    <RowContainer
      className={className}
      height={height}
      padding={padding}
      scrollable={scrollable}
      align={align}
    >
      {children}
    </RowContainer>
  );
}

const Container = styled.div<{
  responsive?: boolean;
  responsiveWidth?: number;
  heightOnResize?: string;
  height?: string;
}>`
  height: ${(props) => props.height};
  ${(props) =>
    props.responsive &&
    `{
      @media (max-width: ${props.responsiveWidth}px) {
        display: flex;
        flex-direction: columns;
        height: ${props.heightOnResize};
      }
      & > * {
        width: 100%;
      }
  }`};
`;

type SerialLayouttype = {
  className?: string;
  children: Array<JSX.Element | null> | JSX.Element;
  responsive?: boolean;
  responsiveWidth?: number;
  heightOnResize?: string;
  height?: string;
};

export default function SerialLayout(props: SerialLayouttype) {
  const {
    children,
    className,
    responsive = false,
    responsiveWidth,
    heightOnResize,
    height,
  } = props;
  return (
    <Container
      className={className}
      responsive={responsive}
      responsiveWidth={responsiveWidth}
      heightOnResize={heightOnResize}
      height={height}
    >
      {children}
    </Container>
  );
}
