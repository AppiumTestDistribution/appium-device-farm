import 'react';
import './streaming.css';

export interface Control {
  action: string;
  icon: any;
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
        <div className="toolbar-control" key={i} onClick={() => onClickCallback(c.action)}>
          {c.icon}
        </div>
      ))}
    </div>
  );
}
