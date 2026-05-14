import { Clock, MapPin, Smartphone, Tag, User2Icon } from 'lucide-react';
import prettyMilliseconds from 'pretty-ms';
import React, { useEffect, useMemo, useState } from 'react';
import DeviceFarmApiService from '../../api-service';
import { useAuth } from '../../contexts/AuthContext';
import { IDevice } from '../../interfaces/IDevice';
import Avatar from '../common/Avatar';

// Lightweight server type for fetching hub node id
interface MinimalServerInfo {
  id: string;
  isHub: boolean;
  isOnline: boolean;
}

// Simple in-memory cache to avoid N calls from multiple cards
let HUB_NODE_ID_CACHE: string | null = null;
let HUB_NODE_ID_PROMISE: Promise<string | null> | null = null;

async function fetchHubNodeIdOnce(): Promise<string | null> {
  if (HUB_NODE_ID_CACHE !== null) return HUB_NODE_ID_CACHE;
  if (HUB_NODE_ID_PROMISE) return HUB_NODE_ID_PROMISE;
  HUB_NODE_ID_PROMISE = (async () => {
    try {
      const servers: MinimalServerInfo[] = await DeviceFarmApiService.getServers();
      const hub = servers.find((s) => s.isHub && s.isOnline);
      HUB_NODE_ID_CACHE = hub ? hub.id : null;
      return HUB_NODE_ID_CACHE;
    } catch {
      HUB_NODE_ID_CACHE = null;
      return null;
    } finally {
      HUB_NODE_ID_PROMISE = null;
    }
  })();
  return HUB_NODE_ID_PROMISE;
}

interface DeviceCardProps {
  device: IDevice;
  reloadDevices: () => void;
  setDevicePollingStatus: (status: boolean) => void;
}

interface SessionResponse {
  status: number;
  sessionID?: number;
  message?: string;
}

interface StreamResponse {
  status: number;
  device?: {
    width: string;
    height: string;
  };
}

const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  reloadDevices,
  setDevicePollingStatus,
}) => {
  const { isAdmin, isCurrentUser } = useAuth();
  const [isBlocked, setIsBlocked] = useState<boolean>(device.busy);
  const [showActionButtons] = useState(device.session_id ? isAdmin() : true);
  const [hubNodeId, setHubNodeId] = useState<string | null>(null);

  useEffect(() => {
    setIsBlocked(!!(device.busy || device.userBlocked));
  }, [device.busy, device.userBlocked]);

  // Load hub node id (cached across cards)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const id = await fetchHubNodeIdOnce();
      if (isMounted) setHubNodeId(id);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Extract hostname from device.host URL
  const hostLocation = useMemo(() => {
    try {
      const url = new URL(device.host);
      return url.hostname;
    } catch {
      return device.host.split(':')[1]?.replace('//', '') || 'Unknown location';
    }
  }, [device.host]);

  const getStatusColor = (status: string): string => {
    if (!status) return 'text-gray-400 bg-gray-400/10';
    if (status === 'ready') return 'text-emerald-400 bg-emerald-400/10';
    if (status === 'busy') return 'text-amber-400 bg-amber-400/10';
    if (status === 'offline') return 'text-red-400 bg-red-400/10';
    if (status === 'blocked') return 'text-purple-400 bg-red-400/10';
    return 'text-gray-400 bg-gray-400/10';
  };

  const getPlatformIcon = (platform: string): JSX.Element => {
    if (platform === 'ios' || platform === 'tvos') {
      return (
        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.537 12.625a4.421 4.421 0 0 0 2.684 4.047 10.96 10.96 0 0 1-1.384 2.845c-.834 1.218-1.7 2.432-3.062 2.457-1.34.025-1.77-.794-3.3-.794-1.531 0-2.01.769-3.275.82-1.316.049-2.317-1.318-3.158-2.532-1.72-2.484-3.032-7.017-1.27-10.077A4.9 4.9 0 0 1 8.91 6.884c1.292-.025 2.51.869 3.3.869.789 0 2.27-1.075 3.828-.917a4.67 4.67 0 0 1 3.66 1.984 4.524 4.524 0 0 0-2.16 3.805m-2.52-7.432A4.4 4.4 0 0 0 16.06 2a4.482 4.482 0 0 0-2.945 1.516 4.185 4.185 0 0 0-1.061 3.093 3.708 3.708 0 0 0 2.967-1.416Z" />
        </svg>
      );
    }
    // Sleek Android icon SVG
    if (platform === 'android') {
      return (
        <svg className="h-5 w-5 text-green-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.6 9.48l1.43-2.48a.5.5 0 1 0-.87-.5l-1.44 2.5A7.97 7.97 0 0 0 6.28 9l-1.44-2.5a.5.5 0 1 0-.87.5l1.43 2.48A7.98 7.98 0 0 0 4 13v5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-2h4v2a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-5a7.98 7.98 0 0 0-1.4-3.52zM7.5 17a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 1 0zm10 0a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 1 0z" />
        </svg>
      );
    }
    return <Smartphone className="h-5 w-5 text-gray-400" />;
  };

  const handleBlockDevice = async (): Promise<void> => {
    try {
      await DeviceFarmApiService.blockDevice(device.udid, device.host);
      setIsBlocked(true);
      reloadDevices();
    } catch (error) {
      console.error('Error blocking device:', error);
    }
  };

  const handleUnblockDevice = async (): Promise<void> => {
    try {
      await DeviceFarmApiService.unblockDevice(device.udid, device.host);
      setIsBlocked(false);
      reloadDevices();
    } catch (error) {
      console.error('Error unblocking device:', error);
    }
  };

  const status =
    isBlocked || device.userBlocked
      ? 'blocked'
      : device.busy
        ? 'busy'
        : device.offline
          ? 'offline'
          : 'ready';

  // Determine Local / Remote / Cloud label
  const isCloud = Boolean(device.cloud);
  const isLocal = !isCloud && hubNodeId && device.nodeId === hubNodeId;
  const locationTypeLabel = isCloud ? 'Cloud' : isLocal ? 'Local' : 'Remote';
  const locationTypeClass = isCloud
    ? 'bg-purple-900 text-purple-300'
    : isLocal
      ? 'bg-cyan-900 text-cyan-300'
      : 'bg-orange-900 text-orange-300';

  return (
    <div className="bg-gray-800 rounded-md p-5 flex flex-col gap-2 items-stretch">
      {/* Top: Name, icon, and version */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-left" style={{ color: '#ffc200' }}>
          {device.name || 'Unnamed Device'}
        </span>
        {getPlatformIcon(device.platform)}
        {/* Version number next to icon for Android/iOS */}
        {['android', 'ios', 'tvos'].includes(device.platform) && (
          <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-300 font-medium whitespace-nowrap">
            {device.sdk ? `v${device.sdk}` : 'v1.0'}
          </span>
        )}
      </div>
      {/* UDID */}
      <div className="text-xs text-gray-400 font-mono truncate text-left">{device.udid}</div>
      {/* Device type, status row (no platform text) */}
      <div className="flex items-center gap-2 mt-1 mb-1 flex-wrap">
        {device.deviceType === 'real' && (
          <span className={'px-2 py-0.5 rounded text-xs font-semibold bg-blue-900 text-blue-300'}>
            Real
          </span>
        )}
        {device.deviceType !== 'real' && (
          <span className={'px-2 py-0.5 rounded text-xs font-semibold bg-green-900 text-green-300'}>
            {device.platform === 'android'
              ? 'Emulator'
              : device.platform === 'ios' || device.platform === 'tvos'
                ? 'Simulator'
                : 'Emulator'}
          </span>
        )}
        <span className="text-gray-500">•</span>
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${locationTypeClass}`}>
          {locationTypeLabel}
        </span>
        <span className="text-gray-500">•</span>
        <span
          className={`px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${getStatusColor(status)}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        {(device.platform === 'ios' ||
          device.platform === 'tvos' ||
          device.platform === 'android') && (
          <>
            <span className="text-gray-500">•</span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${getStatusColor(
                status,
              )}`}
            >
              {device.platform === 'android'
                ? 'Booted'
                : device.deviceType === 'real'
                  ? 'Booted'
                  : device.state}
            </span>
          </>
        )}
      </div>
      {/* Location, Utilization */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-1 mb-2">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4 text-yellow-400" />
          <span>{hostLocation}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-yellow-400" />
          <span>
            {device.totalUtilizationTimeMilliSec
              ? prettyMilliseconds(device.totalUtilizationTimeMilliSec)
              : '0ms'}
          </span>
        </div>
      </div>

      {/* Tags (always on a new row) */}
      <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
        <Tag className="w-4 h-4 text-yellow-400" />
        {device.tags && device.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {device.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-xs font-medium bg-gray-700 rounded-full text-gray-300 truncate max-w-[100px]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </div>
      {device.activeUser && (
        <>
          <div className="flex flex-wrap items-center gap-1.5">
            <User2Icon className="w-4 h-4 text-yellow-400" />
            <Avatar
              firstname={device.activeUser.firstname}
              lastname={device.activeUser.lastname}
              size="sm"
              variant="text"
            />
            <span className="text-sm text-white">
              {device.activeUser.firstname} {device.activeUser.lastname}
            </span>
          </div>
        </>
      )}
      {/* Action Buttons */}

      {(!device.session_id || isAdmin() || isCurrentUser(device.activeUser?.id)) && (
        <>
          <div className="pt-2 flex gap-3">
            {isAdmin() && (device.userBlocked || device.busy) && (
              <button
                onClick={handleUnblockDevice}
                disabled={status === 'offline' || Boolean(device.cloud)}
                className="hover:border hover:border-yellow-400 flex-1 px-4 py-2.5 bg-gray-700 text-gray-200 hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm rounded-md"
              >
                Unblock
              </button>
            )}
            {isAdmin() && !device.userBlocked && !device.busy && (
              <button
                onClick={handleBlockDevice}
                disabled={status === 'offline' || Boolean(device.cloud)}
                className="hover:border hover:border-yellow-400 flex-1 px-4 py-2.5 bg-gray-700 text-gray-200 hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm rounded-md"
              >
                Block
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DeviceCard;
