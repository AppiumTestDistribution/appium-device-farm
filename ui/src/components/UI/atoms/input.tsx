import { Classes, IconName, InputGroup } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';

const DEFAULT_HEIGHT = '20px';
const DEFAULT_WIDTH = '100%';
const ICON_WIDTH = '20px';

const Container = styled.div<{
  height: string;
  width: string;
  hasIcon: boolean;
}>`
  background: ${(props) => props.theme.colors.controls.background};
  width: ${(props) => props.width};

  & .${Classes.INPUT_GROUP} {
    border: none;
    span {
      display: inline-block;
      width: ${ICON_WIDTH};
    }
    input {
      display: inline-block;
      height: ${(props) => props.height};
      width: ${(props) => (props.hasIcon ? `calc(100% - ${ICON_WIDTH})` : `100%`)};
      vertical-align: super;
      border: 1px solid ${(props) => props.theme.colors.border};
      border-radius: ${(props) => props.theme.borderRadius.M};
      font-size: 12px;
      padding: 14px 8px;

      &:focus {
        outline: none;
      }
    }
  }
`;

type PropsType = {
  name?: string;
  value?: string;
  type?: string;
  leftIcon?: IconName;
  placeholder?: string;
  rightElement?: JSX.Element;
  onChange?: (e: any) => void;
  height?: string;
  width?: string;
  className?: string;
};

export default function Input(props: PropsType) {
  const {
    className,
    name,
    value,
    type = 'text',
    leftIcon,
    placeholder,
    rightElement,
    onChange,
    height,
    width,
  } = props;

  return (
    <Container
      className={className}
      height={height || DEFAULT_HEIGHT}
      width={width || DEFAULT_WIDTH}
      hasIcon={!!leftIcon}
    >
      <InputGroup
        name={name}
        value={value}
        type={type}
        leftIcon={leftIcon}
        placeholder={placeholder}
        rightElement={rightElement}
        onChange={onChange}
      />
    </Container>
  );
}
