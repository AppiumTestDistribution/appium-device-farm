import React from 'react';
import './device-card.css';
import { ReactComponent as AndroidIcon } from '../../../assets/android-icon.svg';
import { ReactComponent as AppleIcon } from '../../../assets/apple-new-icon.svg';
import { IDevice } from '../../../interfaces/IDevice';

interface IDeviceCardProps {
  device: IDevice;
}

export default class DeviceCard extends React.Component<IDeviceCardProps, any> {
  getStatusClassName() {
    if (this.props.device.offline) {
      return 'disabled';
    } else if (this.props.device.busy) {
      return 'busy';
    } else {
      return '';
    }
  }

  getDeviceState() {
    if (this.props.device.offline) {
      return 'offline';
    } else if (this.props.device.busy) {
      return 'busy';
    } else {
      return 'ready';
    }
  }

  render() {
    let { name, sdk, deviceType, platform, realDevice, udid } = this.props.device;
    let deviceState = this.getDeviceState();

    return (
      <div className={`device-info-card-container ${this.getStatusClassName()}`}>
        <div className="device-info-card-container__title_wrapper">
          {platform == 'ios' ? (
            <AppleIcon className="device-info-card-container__device-icon" />
          ) : (
            <AndroidIcon className="device-info-card-container__device-icon" />
          )}
          <div className="code device-info-card-container__device-title">{udid}</div>
          <div className={`device-state ${deviceState}`}>{deviceState}</div>
        </div>
        <div className="device-info-card-container__body">
          <div className="device-info-card-container__body_row">
            <div className="device-info-card-container__body_row_label">Version:</div>
            <div className="device-info-card-container__body_row_value">{sdk}</div>
          </div>
          <div className="device-info-card-container__body_row">
            <div className="device-info-card-container__body_row_label">Name:</div>
            <div className="device-info-card-container__body_row_value">{name}</div>
          </div>
          <div className="device-info-card-container__body_row">
            <div className="device-info-card-container__body_row_label">Device Type:</div>
            <div className="device-info-card-container__body_row_value">{deviceType}</div>
          </div>
        </div>
      </div>
    );
  }
}
