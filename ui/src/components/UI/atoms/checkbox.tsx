import React from 'react';
import styled from 'styled-components';
import { Checkbox, Classes } from '@blueprintjs/core';

const Container = styled.div`
  & .${Classes.CONTROL_INDICATOR} {
    width: 10px;
    display: inline-block;
  }

  & input {
    position: relative;
    top: 2px;
  }
`;

type PropsType = {
  checked: boolean;
  label: string;
  onChange?: (isChecked: boolean) => void;
};

export default function CheckboxComponent(props: PropsType) {
  const { checked, label, onChange } = props;

  return (
    <Container>
      <Checkbox
        checked={checked}
        label={label}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChange && onChange(event.target.checked)
        }
      />
    </Container>
  );
}
