import Popover, { PopoverOrigin } from '@mui/material/Popover';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div``;

const Trigger = styled.div`
  cursor: pointer;
`;

const Content = styled.div`
  padding: 10px;
`;

type PropsType = {
  children: [JSX.Element, JSX.Element];
  vertical?: PopoverOrigin['vertical'];
  horizontal?: PopoverOrigin['horizontal'];
  id?: string;
  open?: boolean;
  controlled?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

export default function Dropdown(props: PropsType) {
  const {
    children,
    id = 'simple-popover',
    vertical = 'bottom',
    horizontal = 'left',
    controlled,
    open,
    onOpen,
    onClose,
  } = props;
  const anchorEl = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
    onOpen && onOpen();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose && onClose();
  };

  return (
    <Container>
      <Trigger onClick={handleClick} ref={anchorEl}>
        {children[0]}
      </Trigger>
      <Popover
        id={id}
        open={controlled ? !!open : isOpen}
        anchorEl={anchorEl.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: vertical,
          horizontal: horizontal,
        }}
      >
        <Content>{children[1]}</Content>
      </Popover>
    </Container>
  );
}
