// import { Switch } from "@material-ui/core";
import React from 'react';
import styled from 'styled-components';

const Container = styled.div``;

type PropsType = {
  checked?: boolean;
  label: string;
  onChange?: (isChecked: boolean) => void;
};

export default function SwitchComponent(props: PropsType) {
  const { checked, label, onChange } = props;

  return (
    <Container>
      {/* <
        checked={checked}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChange && onChange(event.target.checked)
        }
      /> */}
      {label}
    </Container>
  );
}
