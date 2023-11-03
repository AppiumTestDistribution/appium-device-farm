import React from 'react';
import styled from 'styled-components';

const Container = styled.div``;

type OverlayParentType = {
  children: JSX.Element;
};

export default function OverlayParent(props: OverlayParentType) {
  const { children } = props;

  return <Container>{children}</Container>;
}
