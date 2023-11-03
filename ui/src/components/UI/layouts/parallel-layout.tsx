import React from 'react';
import styled from 'styled-components';

const GIRD_SIZE = 100 / 12;
const ColumnContainer = styled.div<{
  grid: number;
  scrollable?: boolean;
  padding?: string;
}>`
  flex-basis: ${(props) => GIRD_SIZE * props.grid}%;
  width: ${(props) => GIRD_SIZE * props.grid}%;
  display: flex;
  height: 100%;
  ${(props) => (props.scrollable ? 'overflow: auto' : '')};
  padding: ${(props) => props.padding};

  & > * {
    height: 100%;
    width: 100%;
  }
`;

type ColumnProps = {
  children: JSX.Element | null;
  className?: string;
  grid: number;
  scrollable?: boolean;
  padding?: string;
};

export function Column(props: ColumnProps) {
  const { children, className, grid, scrollable, padding } = props;
  return (
    <ColumnContainer className={className} grid={grid} scrollable={scrollable} padding={padding}>
      {children}
    </ColumnContainer>
  );
}

const Container = styled.div<{
  responsive?: boolean;
  responsiveWidth?: number;
}>`
  display: flex;
  align-items: center;

  ${(props) =>
    props.responsive &&
    `{
      @media (max-width: ${props.responsiveWidth}px) {
        display: flex;
        flex-direction: column;
        overflow: scroll;
        & > * {
          height: auto;
          width: 100%;
        }
    }`}
`;

type ParallelLayoutType = {
  className?: string;
  children: Array<JSX.Element | null> | JSX.Element | null;
  responsive?: boolean;
  responsiveWidth?: number;
};

export default function ParallelLayout(props: ParallelLayoutType) {
  const { children, className, responsive, responsiveWidth } = props;
  return (
    <Container className={className} responsive={responsive} responsiveWidth={responsiveWidth}>
      {children}
    </Container>
  );
}
