import React from 'react';
import './device-card.css';
import { ReactComponent as AndroidIcon } from '../../../assets/android-icon.svg';
import { ReactComponent as AppleIcon } from '../../../assets/apple-new-icon.svg';
import { ReactComponent as SessionIcon } from '../../../assets/session-icon.svg';
import { IDevice } from '../../../interfaces/IDevice';
import prettyMilliseconds from 'pretty-ms';
import DeviceFarmApiService from '../../../api-service';

interface IDeviceCardProps {
  device: IDevice;
  reloadDevices: () => void;
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

  blockDevice(sdk: string, platform: string, udid: string, deviceState: string) {
    DeviceFarmApiService.blockDevice(
      sdk,
      platform,
      udid,
      deviceState === 'busy',
      deviceState === 'offline'
    );

    this.props.reloadDevices();
  }

  unblockDevice(sdk: string, platform: string, udid: string, deviceState: string) {
    DeviceFarmApiService.unblockDevice(
      sdk,
      platform,
      udid,
      deviceState === 'busy',
      deviceState === 'offline'
    );

    this.props.reloadDevices();
  }

  render() {
    const {
      name,
      sdk,
      deviceType,
      platform,
      udid,
      dashboard_link,
      total_session_count,
      host,
      totalUtilizationTimeMilliSec,
      userBlocked,
      busy,
    } = this.props.device;

    const deviceState = this.getDeviceState();
    const hostName = host.split(':')[1].replace('//', '');
    return (
      <div className={`device-info-card-container ${this.getStatusClassName()}`}>
        <div className={`device-state ${deviceState}`}>{deviceState}</div>
        <div className="device-info-card-container__title_wrapper">
          <div className="code device-info-card-container__device-title">{udid}</div>
          {['ios', 'tvos'].includes(platform) ? (
            <AppleIcon className="device-info-card-container__device-icon" />
          ) : (
            <AndroidIcon className="device-info-card-container__device-icon" />
          )}
        </div>
        <div className="device-info-card-container__body">
          <div className="device-info-card-container__body_row">
            <div className="device-info-card-container__body_row_label">Version:</div>
            <div className="device-info-card-container__body_row_value" title={sdk}>
              {sdk}
            </div>
          </div>
          <div className="device-info-card-container__body_row">
            <div className="device-info-card-container__body_row_label">Name:</div>
            <div className="device-info-card-container__body_row_value" title={name}>
              {name}
            </div>
          </div>
          <div className="device-info-card-container__body_row">
            <div className="device-info-card-container__body_row_label">Device Type:</div>
            <div className="device-info-card-container__body_row_value" title={deviceType}>
              {deviceType}
            </div>
          </div>
          <div className="device-info-card-container__body_row">
            <div className="device-info-card-container__body_row_label">Device Location:</div>
            <div className="device-info-card-container__body_row_value" title={hostName}>
              {hostName}
            </div>
          </div>
          {totalUtilizationTimeMilliSec != null && (
            <div className="device-info-card-container__body_row">
              <div className="device-info-card-container__body_row_label">Utilization:</div>
              <div
                className="device-info-card-container__body_row_value"
                title={prettyMilliseconds(totalUtilizationTimeMilliSec)}
              >
                {prettyMilliseconds(totalUtilizationTimeMilliSec)}
              </div>
            </div>
          )}
          {busy && userBlocked && (
            <button
              className="device-info-card__body_unblock-device"
              onClick={() => this.unblockDevice(sdk, platform, udid, deviceState)}
            >
              Unblock Device
            </button>
          )}
          {!busy && (
            <button
              className="device-info-card__body_block-device"
              onClick={() => this.blockDevice(sdk, platform, udid, deviceState)}
            >
              Block Device
            </button>
          )}
        </div>
        <div className="device-info-card-container__footer_wrapper">
          {dashboard_link && !!total_session_count && total_session_count > 0 && (
            <div className="dashboard-link-wrapper">
              <SessionIcon className="footer-icon" />
              <a className="footer-deeplink" href={dashboard_link} target="_blank">
                {`${total_session_count} session${total_session_count > 1 ? 's' : ''}`}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}
