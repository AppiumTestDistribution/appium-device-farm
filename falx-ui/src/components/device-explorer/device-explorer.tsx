import React from 'react';
import { IDeviceFilter } from '../../interfaces/IDeviceFilter';
import { IDevice } from '../../interfaces/IDevice';
import DeviceFarmApiService from '../../api-service';
import '../session/style.css';
import { RefreshCw } from 'lucide-react';
import DeviceCard from '../devicecard/DeviceCard';

interface IDeviceExplorerState {
  filter: IDeviceFilter;
  devices: IDevice[];
  activeSessionsCount: number;
  pendingSessionsCount: number;
  enableDevicePolling: boolean;
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
  version: '',
  deviceType: undefined,
  versions: [],
  tags: [],
};

// CustomDropdown component for custom select UI
function CustomDropdown({
  label,
  value,
  options,
  onChange,
  placeholder,
  clearable,
  onClear,
}: {
  label: string;
  value: string | undefined;
  options: { label: string; value: string | undefined }[];
  onChange: (v: string | undefined) => void;
  placeholder?: string;
  clearable?: boolean;
  onClear?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);
  const selected = options.find((o) => o.value === value);
  return (
    <div className="flex flex-col relative" ref={ref}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-gray-200 text-left">{label}</label>
        {clearable && value && (
          <button
            type="button"
            className="text-xs text-blue-400 hover:underline ml-2"
            onClick={onClear}
          >
            Clear
          </button>
        )}
      </div>
      <button
        type="button"
        className="w-full px-4 py-2.5 bg-gray-800/30 border border-gray-700/30 rounded-lg text-white text-left focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 text-sm flex items-center justify-between"
        onClick={() => setOpen((v) => !v)}
        style={{ textAlign: 'left' }}
      >
        <span
          className={selected ? '' : 'text-gray-500'}
          style={{ textAlign: 'left', width: '100%' }}
        >
          {selected ? selected.label : placeholder || 'Select'}
        </span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-gray-900/95 border-2 border-gray-600 rounded-lg shadow-lg z-10 max-h-56 overflow-auto">
          {options.map((opt) => (
            <div
              key={opt.label}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-700/40 ${opt.value === value ? 'bg-gray-700/30' : ''} text-gray-100`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              style={{ textAlign: 'left' }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// MultiSelectDropdown component for custom multi-select UI
function MultiSelectDropdown({
  label,
  values,
  options,
  onChange,
  placeholder,
  clearable,
  onClear,
}: {
  label: string;
  values: string[];
  options: { label: string; value: string }[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  clearable?: boolean;
  onClear?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);
  const selectedLabels = options.filter((o) => values.includes(o.value)).map((o) => o.label);
  return (
    <div className="flex flex-col relative" ref={ref}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-gray-200 text-left">{label}</label>
        {clearable && values.length > 0 && (
          <button
            type="button"
            className="text-xs text-blue-400 hover:underline ml-2"
            onClick={onClear}
          >
            Clear
          </button>
        )}
      </div>
      <button
        type="button"
        className="w-full px-4 py-2.5 bg-gray-800/30 border border-gray-700/30 rounded-lg text-white text-left focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 text-sm flex items-center justify-between"
        onClick={() => setOpen((v) => !v)}
        style={{ textAlign: 'left' }}
      >
        <span
          className={selectedLabels.length ? '' : 'text-gray-500'}
          style={{ textAlign: 'left', width: '100%' }}
        >
          {selectedLabels.length ? selectedLabels.join(', ') : placeholder || 'Select'}
        </span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-gray-900/95 border-2 border-gray-600 rounded-lg shadow-lg z-10 max-h-56 overflow-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-700/40 flex items-center gap-2 ${values.includes(opt.value) ? 'bg-gray-700/30' : ''} text-gray-100`}
              onClick={() => {
                if (values.includes(opt.value)) {
                  onChange(values.filter((v) => v !== opt.value));
                } else {
                  onChange([...values, opt.value]);
                }
              }}
              style={{ textAlign: 'left' }}
            >
              <input
                type="checkbox"
                checked={values.includes(opt.value)}
                readOnly
                className="form-checkbox h-4 w-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-0"
              />
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// EmptyState component for when no devices are available
const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] px-4 text-center">
      <div className="relative w-64 h-64 mb-6">
        {/* Animated space illustration */}
        <div className="absolute inset-0 animate-float">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Stars */}
            {[...Array(20)].map((_, i) => (
              <circle
                key={i}
                cx={Math.random() * 200}
                cy={Math.random() * 200}
                r={Math.random() * 1.5}
                className="fill-yellow-300 animate-twinkle"
                style={{
                  animationDelay: `${Math.random() * 2}s`,
                  opacity: Math.random() * 0.8 + 0.2,
                }}
              />
            ))}
            {/* Planet */}
            <circle
              cx="100"
              cy="100"
              r="40"
              className="fill-blue-500/20"
              style={{ filter: 'blur(8px)' }}
            />
            <circle
              cx="100"
              cy="100"
              r="35"
              className="fill-blue-600/30"
              style={{ filter: 'blur(4px)' }}
            />
            <circle cx="100" cy="100" r="30" className="fill-blue-700" />
            {/* Rings */}
            <ellipse
              cx="100"
              cy="100"
              rx="45"
              ry="15"
              className="fill-blue-400/20"
              transform="rotate(-20 100 100)"
            />
            {/* Satellite */}
            <g className="animate-orbit" style={{ transformOrigin: '100px 100px' }}>
              <circle cx="160" cy="100" r="5" className="fill-gray-400" />
              <line
                x1="100"
                y1="100"
                x2="160"
                y2="100"
                className="stroke-gray-400/30"
                strokeWidth="1"
              />
            </g>
          </svg>
        </div>
      </div>
      <h3 className="text-2xl font-semibold text-gray-100 mb-2">No Devices Found</h3>
      <p className="text-gray-400 max-w-md mb-6">
        It seems there are no devices available at the moment.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-blue-600/90 text-white rounded-lg hover:bg-blue-700/90 transition-all duration-200 flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Refresh Devices
      </button>
    </div>
  );
};

// Add these styles to your existing CSS
const styles = `
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}

@keyframes orbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-twinkle {
  animation: twinkle 2s ease-in-out infinite;
}

.animate-orbit {
  animation: orbit 20s linear infinite;
}
`;

export default class DeviceExplorer extends React.Component<
  object,
  IDeviceExplorerState & { showFilterPopup: boolean }
> {
  private devicePolling?: NodeJS.Timeout;
  private isMountedFlag = false;
  filterButtonRef = React.createRef<HTMLButtonElement>();
  filterPopupRef = React.createRef<HTMLDivElement>();

  constructor(props: object) {
    super(props);
    this.state = {
      devices: [],
      activeSessionsCount: 0,
      pendingSessionsCount: 0,
      filter: DEFAULT_FILTER,
      enableDevicePolling: true,
      showFilterPopup: false,
    };
  }

  componentDidMount() {
    this.isMountedFlag = true;
    this.fetchDevices();
    this.devicePolling = setInterval(() => {
      if (this.state.enableDevicePolling) {
        this.fetchDevices();
      }
    }, 10000);
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    this.isMountedFlag = false;
    if (this.devicePolling) {
      clearInterval(this.devicePolling);
    }
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event: MouseEvent) => {
    if (
      this.state.showFilterPopup &&
      this.filterPopupRef.current &&
      !this.filterPopupRef.current.contains(event.target as Node) &&
      this.filterButtonRef.current &&
      !this.filterButtonRef.current.contains(event.target as Node)
    ) {
      this.setState({ showFilterPopup: false });
    }
  };

  getBusyDevicesCount = (devices: IDevice[]) => devices.filter((d) => d.busy).length;

  fetchDevices = async () => {
    try {
      const devices = await DeviceFarmApiService.getDevices();
      const activeSessionsCount = this.getBusyDevicesCount(devices);
      const pendingSessionsCount = await DeviceFarmApiService.getPendingSessionsCount();

      if (this.isMountedFlag) {
        this.setState({ devices, activeSessionsCount, pendingSessionsCount });
      }
    } catch (error) {
      console.log(error);
    }
  };

  setPollingStatus(_state: boolean) {
    this.setState({
      ...this.state,
      enableDevicePolling: _state,
    });
  }

  getFilteredDevice = () => {
    const { filter, devices } = this.state;
    const rawDevices: IDevice[] = devices.filter((device) => {
      const { ios, android } = filter.platform;
      const { ready, busy, offline } = filter.state;
      const platformMatch =
        (ios && (device.platform === 'ios' || device.platform === 'tvos')) ||
        (android && device.platform === 'android');
      const stateMatch =
        (ready && !device.busy && !device.offline) ||
        (busy && device.busy) ||
        (offline && device.offline);
      const nameMatch =
        filter.name === '' ||
        device.name.toLowerCase().includes(filter.name.toLowerCase()) ||
        device.udid.toLowerCase().includes(filter.name.toLowerCase());
      // Multi-version filter
      const versionsMatch =
        !filter.versions ||
        filter.versions.length === 0 ||
        (device.sdk && filter.versions.includes(device.sdk));
      // Multi-tag filter
      const tagsMatch =
        !filter.tags ||
        filter.tags.length === 0 ||
        (device.tags && filter.tags.some((tag) => device.tags.includes(tag)));
      const versionMatch = !filter.version || (device.version && device.version === filter.version); // legacy, for backward compat
      const deviceTypeMatch = !filter.deviceType || device.deviceType === filter.deviceType;
      return (
        platformMatch &&
        stateMatch &&
        nameMatch &&
        versionsMatch &&
        tagsMatch &&
        versionMatch &&
        deviceTypeMatch
      );
    });
    rawDevices.sort((a, b) => {
      if (a.offline && !b.offline) {
        return 1;
      } else if (!a.offline && b.offline) {
        return -1;
      } else {
        return 0;
      }
    });
    return rawDevices;
  };

  setFilter = (newFilterPart: Partial<IDeviceFilter>) => {
    this.setState((prevState) => ({
      ...prevState,
      filter: {
        ...prevState.filter,
        ...newFilterPart,
        platform: {
          ...prevState.filter.platform,
          ...(newFilterPart.platform || {}),
        },
        state: {
          ...prevState.filter.state,
          ...(newFilterPart.state || {}),
        },
      },
    }));
  };

  getPlatformFilterComponent() {
    const { ios, android } = this.state.filter.platform;
    return (
      <div className="flex space-x-2 text-sm">
        <button
          className="flex items-center justify-center space-x-1 w-24 h-10 border rounded-lg"
          style={{ color: '#ffc200', borderColor: '#ffc200' }}
          onClick={() =>
            this.setFilter({ platform: { ...this.state.filter.platform, android: !android } })
          }
        >
          {android && (
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span>Android</span>
        </button>
        <button
          className="flex items-center justify-center border space-x-1 w-24 h-10 rounded-lg"
          style={{ color: '#ffc200', borderColor: '#ffc200' }}
          onClick={() => this.setFilter({ platform: { ...this.state.filter.platform, ios: !ios } })}
        >
          {ios && (
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span>iOS</span>
        </button>
      </div>
    );
  }

  getDeviceStateFilterComponent() {
    const { ready, busy, offline } = this.state.filter.state;

    const isAllSelected = ready && busy && offline;
    return (
      <div className="flex">
        <div className="flex items-center me-3">
          <input
            id="inline-radio-all"
            type="radio"
            value=""
            name="inline-radio-group"
            checked={isAllSelected}
            onChange={() =>
              this.setFilter({
                state: {
                  ready: true,
                  busy: true,
                  offline: true,
                },
              })
            }
            className="w-4 h-4 text-blue-600 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600"
          />
          <label htmlFor="inline-radio-all" className="ms-2 text-sm font-medium text-gray-300">
            All
          </label>
        </div>
        <div className="flex items-center me-3">
          <input
            id="inline-radio-ready"
            type="radio"
            value=""
            name="inline-radio-group"
            onChange={() =>
              this.setFilter({
                state: {
                  ready: true,
                  busy: false,
                  offline: false,
                },
              })
            }
            className="w-4 h-4 text-blue-600 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600"
          />
          <label htmlFor="inline-radio-ready" className="ms-2 text-sm font-medium text-gray-300">
            Ready
          </label>
        </div>
        <div className="flex items-center me-3">
          <input
            id="inline-radio-busy"
            type="radio"
            value=""
            name="inline-radio-group"
            onChange={() =>
              this.setFilter({
                state: {
                  ready: false,
                  busy: true,
                  offline: false,
                },
              })
            }
            className="w-4 h-4 text-blue-600 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600"
          />
          <label htmlFor="inline-radio-busy" className="ms-2 text-sm font-medium text-gray-300">
            Busy
          </label>
        </div>
        <div className="flex items-center me-3">
          <input
            id="inline-radio-offline"
            type="radio"
            value=""
            name="inline-radio-group"
            onChange={() =>
              this.setFilter({
                state: {
                  ready: false,
                  busy: false,
                  offline: true,
                },
              })
            }
            className="w-4 h-4 text-blue-600 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600"
          />
          <label htmlFor="inline-radio-offline" className="ms-2 text-sm font-medium text-gray-300">
            Offline
          </label>
        </div>
        <div className="flex items-center me-3">
          <button
            onClick={this.fetchDevices}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className={'w-4 h-4'} />
            Refresh
          </button>
        </div>
      </div>
    );
  }
  getStatusColor = (status: string) => {
    if (!status) return 'text-gray-400 bg-gray-400/10';
    if (status === 'ready') return 'text-emerald-400 bg-emerald-400/10';
    if (status === 'busy') return 'text-amber-400 bg-amber-400/10';
    if (status === 'offline') return 'text-red-400 bg-red-400/10';
    return 'text-gray-400 bg-gray-400/10';
  };

  render() {
    const devices = this.getFilteredDevice();
    const { showFilterPopup } = this.state;
    const { ios, android } = this.state.filter.platform;
    // Collect unique versions for dropdown
    const versions = Array.from(new Set(this.state.devices.map((d) => d.version).filter(Boolean)));
    // Device types for dropdown
    const deviceTypes = [
      { label: 'All', value: undefined },
      { label: 'Real', value: 'real' },
      { label: 'Emulator', value: 'emulator' },
      { label: 'Simulator', value: 'simulator' },
    ];
    // State options for dropdown
    const stateOptions = [
      { label: 'All', value: undefined },
      { label: 'Ready', value: 'ready' },
      { label: 'Busy', value: 'busy' },
      { label: 'Offline', value: 'offline' },
    ];
    // Platform options for dropdown
    const platformOptions = [
      { label: 'All', value: undefined },
      { label: 'iOS', value: 'ios' },
      { label: 'Android', value: 'android' },
    ];
    // For versions, use sdk from filtered devices
    const versionOptions = Array.from(new Set(devices.map((d) => d.sdk).filter(Boolean))).map(
      (v) => ({ label: v, value: v }),
    );
    // For tags, collect all unique tags from all devices
    const allTags = Array.from(new Set(this.state.devices.flatMap((d) => d.tags || []))).filter(
      Boolean,
    );
    const tagOptions = allTags.map((t) => ({ label: t, value: t }));
    return (
      <div className="w-full min-h-screen bg-gray-900 p-6">
        <style>{styles}</style>
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Search input and Filter Button */}
          <div className="flex justify-end mb-4 relative gap-2">
            <div className="relative w-72">
              <input
                type="text"
                className="pl-10 pr-4 py-2.5 bg-gray-800/30 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 text-sm w-full"
                placeholder="Search with device name or udid"
                value={this.state.filter.name}
                onChange={(e) => this.setFilter({ name: e.target.value })}
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <button
              ref={this.filterButtonRef}
              className={`flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors border border-gray-700 ${showFilterPopup ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => this.setState({ showFilterPopup: !showFilterPopup })}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 017 17v-3.586a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z"
                />
              </svg>
              Filter
            </button>
            {showFilterPopup && (
              <div
                ref={this.filterPopupRef}
                className="absolute right-0 mt-2 z-50 bg-gray-900/95 rounded-lg p-0 w-[380px] border-2 border-gray-600 shadow-2xl animate-fadeIn"
                style={{ minWidth: 340 }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-2 border-b border-gray-800/30">
                  <div className="text-lg font-semibold text-gray-100">Filter</div>
                  <button
                    className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-800/30"
                    onClick={() => this.setState({ showFilterPopup: false })}
                    aria-label="Close"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="px-6 pt-4 pb-2 flex flex-col gap-4">
                  {/* Platform Dropdown */}
                  <CustomDropdown
                    label="Platform"
                    value={(() => {
                      if (ios && android) return undefined;
                      if (ios) return 'ios';
                      if (android) return 'android';
                      return undefined;
                    })()}
                    options={platformOptions}
                    onChange={(v) => {
                      if (!v) this.setFilter({ platform: { ios: true, android: true } });
                      else if (v === 'ios')
                        this.setFilter({ platform: { ios: true, android: false } });
                      else if (v === 'android')
                        this.setFilter({ platform: { ios: false, android: true } });
                    }}
                    placeholder="All"
                    clearable
                    onClear={() => this.setFilter({ platform: { ios: true, android: true } })}
                  />
                  {/* Version MultiSelectDropdown */}
                  <MultiSelectDropdown
                    label="Version"
                    values={this.state.filter.versions || []}
                    options={versionOptions}
                    onChange={(vals) => this.setFilter({ versions: vals })}
                    placeholder="All"
                    clearable
                    onClear={() => this.setFilter({ versions: [] })}
                  />
                  {/* Tags MultiSelectDropdown */}
                  <MultiSelectDropdown
                    label="Tags"
                    values={this.state.filter.tags || []}
                    options={tagOptions}
                    onChange={(vals) => this.setFilter({ tags: vals })}
                    placeholder="All"
                    clearable
                    onClear={() => this.setFilter({ tags: [] })}
                  />
                  {/* Device Type Dropdown */}
                  <CustomDropdown
                    label="Device Type"
                    value={this.state.filter.deviceType || undefined}
                    options={deviceTypes}
                    onChange={(v) => this.setFilter({ deviceType: v as any })}
                    placeholder="All"
                    clearable
                    onClear={() => this.setFilter({ deviceType: undefined })}
                  />
                  {/* State Dropdown */}
                  <CustomDropdown
                    label="State"
                    value={(() => {
                      const { ready, busy, offline } = this.state.filter.state;
                      if (ready && busy && offline) return undefined;
                      if (ready) return 'ready';
                      if (busy) return 'busy';
                      if (offline) return 'offline';
                      return undefined;
                    })()}
                    options={stateOptions}
                    onChange={(v) => {
                      if (!v) {
                        this.setFilter({ state: { ready: true, busy: true, offline: true } });
                      } else if (v === 'ready') {
                        this.setFilter({ state: { ready: true, busy: false, offline: false } });
                      } else if (v === 'busy') {
                        this.setFilter({ state: { ready: false, busy: true, offline: false } });
                      } else if (v === 'offline') {
                        this.setFilter({ state: { ready: false, busy: false, offline: true } });
                      }
                    }}
                    placeholder="All"
                    clearable
                    onClear={() =>
                      this.setFilter({ state: { ready: true, busy: true, offline: true } })
                    }
                  />
                </div>
                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800/30 bg-gray-900/80 rounded-b-lg">
                  <button
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200"
                    onClick={() => this.setState({ filter: { ...DEFAULT_FILTER } })}
                  >
                    Reset
                  </button>
                  <button
                    className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600/90 rounded-lg hover:bg-blue-700/90 transition-all duration-200"
                    onClick={() => {
                      this.fetchDevices();
                      this.setState({ showFilterPopup: false });
                    }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            )}
          </div>
          {devices.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {devices.map((device) => (
                <DeviceCard
                  key={`${device.udid}-${device.nodeId}`}
                  device={device}
                  reloadDevices={() => this.fetchDevices()}
                  setDevicePollingStatus={this.setPollingStatus.bind(this)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
