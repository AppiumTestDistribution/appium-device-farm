import React from 'react';
import AndroidIcon from '../../assets/android-icon.svg';
import AppleIcon from '../../assets/apple-icon.svg';
import CardView from './card-view/card-view';
import './device-explorer.css';
import DeviceFarmApiService from '../../api-service';
import { IDeviceFilter } from '../../interfaces/IDeviceFilter';
import { IDevice } from '../../interfaces/IDevice';

interface IDeviceExplorerState {
  filter: IDeviceFilter;
  devices: IDevice[];
  activeSessionsCount: number;
  pendingSessionsCount: number;
}
const DEFAULT_FILTER: IDeviceFilter = {
  platform: {
    ios: true,
    android: true,
  },
  state: {
    ready: true,
    offline: true,
    busy: true,
  },
  name: '',
};

export default class DeviceExplorer extends React.Component<any, IDeviceExplorerState> {
  private devicePolling: any;

  constructor(props: any) {
    super(props);
    this.state = {
      devices: [],
      activeSessionsCount: 0,
      pendingSessionsCount: 0,
      filter: DEFAULT_FILTER,
    };
  }

  componentDidMount() {
    this.fetchDevices();
    this.devicePolling = setInterval(() => {
      this.fetchDevices();
    }, 10000);
  }

  componentWillUnmount() {
    if (this.devicePolling) {
      clearInterval(this.devicePolling);
      this.devicePolling = undefined;
    }
  }

  async fetchDevices() {
    try {
      const devices = await DeviceFarmApiService.getDevices();
      const activeSessionsCount = await this.getBusyDevicesCount(devices);
      const pendingSessionsCount = await DeviceFarmApiService.getPendingSessionsCount();
      this.setState({ devices, activeSessionsCount, pendingSessionsCount });
    } catch (error) {
      console.log(error);
    }
  }

  getBusyDevicesCount(devices: Array<IDevice>) {
    const filters = [(d: IDevice) => d.busy];
    return filters.reduce((devices: Array<IDevice>, predicate: (d: IDevice) => boolean) => {
      return devices.filter(predicate);
    }, devices).length;
  }

  getFilteredDevice() {
    const { ready, busy, offline } = this.state.filter.state;
    const { ios, android } = this.state.filter.platform;
    const filters = [
      (d: IDevice) => (ios && d.platform == 'ios') || (android && d.platform == 'android'),
      (d: IDevice) =>
        (ready && !d.busy && !d.offline) || (busy && d.busy) || (offline && d.offline),
    ];

    if (this.state.filter.name != '') {
      filters.push(
        (d: IDevice) =>
          d.name.toLowerCase().includes(this.state.filter.name.toLowerCase()) ||
          d.udid.toLowerCase().includes(this.state.filter.name.toLowerCase())
      );
    }
    return filters.reduce((acc: Array<IDevice>, predicate: (d: IDevice) => boolean) => {
      return acc.filter(predicate);
    }, this.state.devices);
  }

  setFilter(newFilter: Partial<IDeviceFilter>) {
    this.setState({
      filter: {
        ...this.state.filter,
        ...newFilter,
      },
    });
  }

  /* Render filter components */
  getPlatformFilterComponent() {
    const { ios, android } = this.state.filter.platform;
    return (
      <div className="device-explorer-header-value">
        <img
          className={`device-explorer-header__device-platform ${android && 'selected'}`}
          src={AndroidIcon}
          onClick={() =>
            this.setFilter({
              platform: {
                ...this.state.filter.platform,
                android: !this.state.filter.platform.android,
              },
            })
          }
        />
        <img
          className={`device-explorer-header__device-platform ${ios && 'selected'}`}
          src={AppleIcon}
          onClick={() =>
            this.setFilter({
              platform: {
                ...this.state.filter.platform,
                ios: !this.state.filter.platform.ios,
              },
            })
          }
        />
      </div>
    );
  }

  getDeviceStateFilterComponent() {
    const { ready, busy, offline } = this.state.filter.state;
    return (
      <div className="device-explorer-header-value">
        <div
          className={`device-explorer-header__device-state ready ${ready && 'selected'}`}
          onClick={() =>
            this.setFilter({
              state: {
                ...this.state.filter.state,
                ready: !this.state.filter.state.ready,
              },
            })
          }
        >
          Ready
        </div>
        <div
          className={`device-explorer-header__device-state busy ${busy && 'selected'}`}
          onClick={() =>
            this.setFilter({
              state: {
                ...this.state.filter.state,
                busy: !this.state.filter.state.busy,
              },
            })
          }
        >
          Busy
        </div>
        <div
          className={`device-explorer-header__device-state offline ${offline && 'selected'}`}
          onClick={() =>
            this.setFilter({
              state: {
                ...this.state.filter.state,
                offline: !this.state.filter.state.offline,
              },
            })
          }
        >
          Offline
        </div>
      </div>
    );
  }

  render() {
    const devices = this.getFilteredDevice();
    return (
      <div className="device-explorer-container">
        <div className="device-explorer-header-container">
          <div className="device-explorer-header-left-container">
            <div className="device-explorer-header-entry">
              <div className="device-explorer-header-entry-header">Platform</div>
              {this.getPlatformFilterComponent()}
            </div>
            <div className="device-explorer-header-entry">
              <div className="device-explorer-header-entry-header">Device state</div>
              {this.getDeviceStateFilterComponent()}
            </div>
            <div className="device-explorer-header-entry">
              <div className="device-explorer-header-entry-header">Search by name or udid</div>
              <div className="device-explorer-header-value">
                <input
                  type="text"
                  className="device-explorer-header-text-filter"
                  placeholder="Search.."
                  onChange={(e) => {
                    this.setState({
                      filter: {
                        ...this.state.filter,
                        name: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            </div>
            <div className="device-explorer-header-filter-count">
              Displaying
              <span>{devices.length}</span> of <span>{this.state.devices.length}</span>
              devices
            </div>
          </div>
          <div className="device-explorer-header-right-container">
            <div className="device-explorer-header-filter-count">
              <span>{this.state.activeSessionsCount}</span>
              Active session{this.state.activeSessionsCount > 1 ? 's' : ''}
            </div>
            <div className="device-explorer-header-filter-count">
              <span>{this.state.pendingSessionsCount}</span>
              Pending session{this.state.pendingSessionsCount > 1 ? 's' : ''}
            </div>
          </div>
        </div>
        <CardView devices={devices} />
      </div>
    );
  }
}
