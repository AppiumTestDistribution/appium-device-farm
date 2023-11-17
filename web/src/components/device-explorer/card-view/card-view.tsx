import React from 'react';
import { IDevice } from '../../../interfaces/IDevice';
import DeviceCard from '../../device-card/device-card/device-card';
import './card-view.css';

interface IProps {
  devices: Array<IDevice>;
  reloadDevices: () => void;
}

export default class CardView extends React.Component<IProps, any> {
  render() {
    return (
      <div className="device-explorer-card-container">
        {React.Children.toArray(
          this.props.devices.map((device, i) => (
            <DeviceCard device={device} reloadDevices={this.props.reloadDevices} />
          )),
        )}
      </div>
    );
  }
}
