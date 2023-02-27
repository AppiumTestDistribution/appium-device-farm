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
    console.log(sdk);

    const deviceState = this.getDeviceState();
    const hostName = host.split(':')[1].replace('//', '');
    return (
      <div className={`device-info-card-container ${this.getStatusClassName()}`}>
        <div className="device-info-card-container__title_wrapper">
          {['ios', 'tvos'].includes(platform) ? (
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
          <div className="device-info-card-container__body_row">
            <div className="device-info-card-container__body_row_label">Device Location:</div>
            <div className="device-info-card-container__body_row_value">{hostName}</div>
          </div>
          {totalUtilizationTimeMilliSec != null && (
            <div className="device-info-card-container__body_row">
              <div className="device-info-card-container__body_row_label">Utilization:</div>
              <div className="device-info-card-container__body_row_value">
                {prettyMilliseconds(totalUtilizationTimeMilliSec)}
              </div>
            </div>
          )}
          <button
            className="device-info-card__body_block-device"
            onClick={() =>
              DeviceFarmApiService.blockDevice(
                sdk,
                platform,
                udid,
                deviceState === 'busy',
                deviceState === 'offline'
              )
            }
          >
            {busy && userBlocked ? 'Unblock' : 'Block'} Device
          </button>
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
