import React from 'react';
import styled from 'styled-components';
import ButtonComponent, { ButtonTypeMap } from '@mui/material/Button';
import chroma from 'chroma-js';

const StyledButtonComponent = styled(ButtonComponent)`
  && {
    display: inline-block;
    width: auto;
    padding: ${(props) => (props.variant === 'contained' ? '3px 15px' : '2px 15px')};
    background-color: ${(props) => props.variant === 'contained' && props.theme.colors.primary};
    color: ${(props) =>
      (props.variant === 'text' || props.variant === 'outlined') && props.theme.colors.primary};
    border-color: ${(props) => props.variant === 'outlined' && props.theme.colors.primary};

    &:hover {
      background-color: ${(props) =>
        props.variant === 'contained' && chroma(props.theme.colors.primary).brighten(1).hex()};
      border-color: ${(props) => props.variant === 'outlined' && props.theme.colors.primary};
    }
  }
`;

type PropsType = {
  variant?: ButtonTypeMap['props']['variant'];
  onClick?: () => void;
  children: string;
  className?: string;
};

export default function Button(props: PropsType) {
  const { variant = 'contained', onClick, children, className } = props;
  return (
    <StyledButtonComponent className={className} variant={variant} onClick={onClick}>
      {children}
    </StyledButtonComponent>
  );
}
