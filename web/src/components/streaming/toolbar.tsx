import 'react';
import './streaming.css';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';

export interface Control {
  action: string;
  icon: any;
  name: string;
  onClick?: (action: string) => void;
}
export interface IToolBarProps {
  controls: Array<Control>;
  onClickCallback: (action: string) => void;
}

export function StreamingToolBar(props: IToolBarProps) {
  const { controls, onClickCallback } = props;

  return (
    <div className="toolbar-container">
      {controls.map((c, i) => (
        <Tooltip title={c.name} placement="right-start" key={`tooltip-${i}`}>
          <IconButton
            key={i}
            onClick={() => (c.onClick ? c.onClick(c.action) : onClickCallback(c.action))}
          >
            {c.icon}
          </IconButton>
        </Tooltip>
      ))}
    </div>
  );
}
