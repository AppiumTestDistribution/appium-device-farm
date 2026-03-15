import { useEffect, useState } from 'react';
import deviceService, { Device } from '../services/DeviceService';
import {
  Android,
  Apple,
  Edit,
  Delete,
  Tag,
  Refresh,
  MoreVert,
  Devices as DevicesIcon,
  CheckCircle,
  PauseCircle,
  RadioButtonUnchecked,

} from '@mui/icons-material';
import { format } from 'date-fns';
import { FiX, FiFlag } from 'react-icons/fi';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// Device thumbnails
const deviceThumbnails = {
  ios: 'https://cdn-icons-png.flaticon.com/512/0/747.png',
  android: 'https://cdn-icons-png.flaticon.com/512/888/888846.png',
};

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [editName, setEditName] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState('');
  const [editFlagged, setEditFlagged] = useState(false);
  const [editFlagReason, setEditFlagReason] = useState('');
  const [editError, setEditError] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionMenuDevice, setActionMenuDevice] = useState<Device | null>(null);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const data = await deviceService.listDevices();
      setDevices(data);
      setError(null);
    } catch (err) {
      setError('Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    return platform === 'android' ? (
      <Android className="text-green-500" sx={{ fontSize: 20 }} />
    ) : (
      <Apple className="text-gray-400" sx={{ fontSize: 20 }} />
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Online') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold gap-1">
          <CheckCircle sx={{ fontSize: 16 }} /> Online
        </span>
      );
    }
    if (status === 'Busy') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold gap-1">
          <PauseCircle sx={{ fontSize: 16 }} /> Busy
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold gap-1">
        <RadioButtonUnchecked sx={{ fontSize: 16 }} /> Offline
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy HH:mm');
  };

  const formatUsage = (usage: number) => {
    if (usage === 0) return '0s';
    // Convert milliseconds to seconds
    const totalSeconds = Math.floor(usage / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;
  };

  // Count platforms and status
  const iosCount = devices.filter((d) => d.platform.toLowerCase() === 'ios').length;
  const androidCount = devices.filter((d) => d.platform.toLowerCase() === 'android').length;
  const onlineCount = devices.filter((d) => d.isActive).length;
  const offlineCount = devices.length - onlineCount;

  const handleDeleteClick = (device: Device) => {
    setDeviceToDelete(device);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deviceToDelete) return;

    try {
      await deviceService.deleteDevice(deviceToDelete.id);
      setDeleteDialogOpen(false);
      setDeviceToDelete(null);
      // Refresh the devices list
      loadDevices();
    } catch (err) {
      setError('Failed to delete device');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeviceToDelete(null);
  };

  const handleEditDevice = (device: Device) => {
    setEditingDevice(device);
    setEditName(device.name);
    setEditTags(
      device.tags
        ? device.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    );
    setEditTagInput('');
    setEditFlagged(device.isFlagged);
    setEditFlagReason(device.flaggedReason || '');
    setEditError('');
    setEditModalOpen(true);
  };

  const handleEditTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editTagInput.trim()) {
      e.preventDefault();
      const newTag = editTagInput.trim();
      if (newTag && !editTags.includes(newTag)) {
        setEditTags([...editTags, newTag]);
      }
      setEditTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditTags(editTags.filter((t) => t !== tag));
  };

  const handleEditSave = async () => {
    if (!editName.trim()) {
      setEditError('Device name is required.');
      return;
    }
    if (editFlagged && !editFlagReason.trim()) {
      setEditError('Flag reason is required when flagged.');
      return;
    }
    setEditSaving(true);
    try {
      await deviceService.updateDevice(editingDevice!.id, {
        name: editName.trim(),
        tags: editTags.length > 0 ? editTags.join(',') : null,
        isFlagged: editFlagged,
        flaggedReason: editFlagged ? editFlagReason : '',
      });
      setEditModalOpen(false);
      setEditingDevice(null);
      loadDevices();
    } catch (err) {
      setEditError('Failed to update device.');
    } finally {
      setEditSaving(false);
    }
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditingDevice(null);
  };

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, device: Device) => {
    setActionMenuAnchor(event.currentTarget);
    setActionMenuDevice(device);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setActionMenuDevice(null);
  };

  const handleMenuEdit = () => {
    if (actionMenuDevice) handleEditDevice(actionMenuDevice);
    handleActionMenuClose();
  };

  const handleMenuDelete = () => {
    if (actionMenuDevice) handleDeleteClick(actionMenuDevice);
    handleActionMenuClose();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
  }

  return (
    <div className="p-8 bg-gray-900 h-screen flex flex-col">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Total Devices Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-gray-400">Total Devices</div>
            <DevicesIcon className="text-gray-600" sx={{ fontSize: 16 }} />
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-2">{devices.length}</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded-md">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/20"></div>
              <div>
                <div className="text-xs font-medium text-green-400">{onlineCount}</div>
                <div className="text-[10px] text-green-500/70">Online</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-500/10 px-2 py-1 rounded-md">
              <div className="w-2 h-2 rounded-full bg-gray-500 shadow-sm shadow-gray-500/20"></div>
              <div>
                <div className="text-xs font-medium text-gray-400">{offlineCount}</div>
                <div className="text-[10px] text-gray-500/70">Offline</div>
              </div>
            </div>
          </div>
        </div>

        {/* iOS Devices Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-gray-400">iOS Devices</div>
            <Apple className="text-gray-600" sx={{ fontSize: 16 }} />
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-2">{iosCount}</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded-md">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/20"></div>
              <div>
                <div className="text-xs font-medium text-green-400">
                  {devices.filter((d) => d.platform.toLowerCase() === 'ios' && d.isActive).length}
                </div>
                <div className="text-[10px] text-green-500/70">Online</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-500/10 px-2 py-1 rounded-md">
              <div className="w-2 h-2 rounded-full bg-gray-500 shadow-sm shadow-gray-500/20"></div>
              <div>
                <div className="text-xs font-medium text-gray-400">
                  {devices.filter((d) => d.platform.toLowerCase() === 'ios' && !d.isActive).length}
                </div>
                <div className="text-[10px] text-gray-500/70">Offline</div>
              </div>
            </div>
          </div>
        </div>

        {/* Android Devices Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-3 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-gray-400">Android Devices</div>
            <Android className="text-green-500" sx={{ fontSize: 16 }} />
          </div>
          <div className="text-2xl font-bold text-gray-100 mb-2">{androidCount}</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded-md">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/20"></div>
              <div>
                <div className="text-xs font-medium text-green-400">
                  {
                    devices.filter((d) => d.platform.toLowerCase() === 'android' && d.isActive)
                      .length
                  }
                </div>
                <div className="text-[10px] text-green-500/70">Online</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-500/10 px-2 py-1 rounded-md">
              <div className="w-2 h-2 rounded-full bg-gray-500 shadow-sm shadow-gray-500/20"></div>
              <div>
                <div className="text-xs font-medium text-gray-400">
                  {
                    devices.filter((d) => d.platform.toLowerCase() === 'android' && !d.isActive)
                      .length
                  }
                </div>
                <div className="text-[10px] text-gray-500/70">Offline</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal - styled like Users modal */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gray-900/90 rounded-lg p-8 w-full max-w-md border border-gray-800/30 animate-slideIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Delete className="text-red-500" sx={{ fontSize: 24 }} />
              </div>
              <h2 className="text-2xl font-semibold text-white/90 m-0 text-left">Delete Device</h2>
            </div>
            <div className="mb-4 text-left">
              <p className="text-white font-semibold mb-2">
                You are about to delete{' '}
                <span className="text-white font-semibold">{deviceToDelete?.name}</span>
              </p>
              <p className="text-gray-300">
                Deleting the device will remove all its associated build details and test results.
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={handleDeleteCancel}
                className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800/30"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-200"
                autoFocus
              >
                Delete Device
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Device Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gray-900/90 rounded-lg p-8 w-full max-w-md border border-gray-800/30 animate-slideIn">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-white/90">Edit Device</h2>
              <button
                onClick={handleEditCancel}
                className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-800/30"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1.5 text-left">
                  Device Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-gray-800/30 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 text-left placeholder:text-sm placeholder:text-gray-500 text-sm"
                  placeholder="Enter device name *"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1.5 text-left">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editTags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center bg-gray-700 text-gray-200 px-2 py-0.5 rounded-md text-xs font-medium"
                    >
                      {tag}
                      <button
                        type="button"
                        className="ml-1 text-gray-400 hover:text-red-400"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={editTagInput}
                  onChange={(e) => setEditTagInput(e.target.value)}
                  onKeyDown={handleEditTagInputKeyDown}
                  className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 text-left placeholder:text-sm placeholder:text-gray-500 text-sm"
                  placeholder="Type a tag and press Enter"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="flagged"
                  type="checkbox"
                  checked={editFlagged}
                  onChange={(e) => setEditFlagged(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-red-500 bg-gray-800 border-gray-600 rounded focus:ring-0"
                />
                <label htmlFor="flagged" className="text-sm text-gray-200 flex items-center gap-1">
                  <FiFlag className="text-red-500" size={16} /> Flagged
                </label>
              </div>
              <div className="text-xs text-gray-400 mb-2 ml-6 text-left max-w-md">
                Flagging a device marks it as unavailable for other users (e.g., during
                maintenance). Unflag to make it usable again.
              </div>
              {editFlagged && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1.5 text-left">
                    Flag Reason <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={editFlagReason}
                    onChange={(e) => setEditFlagReason(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800/30 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 text-left placeholder:text-sm placeholder:text-gray-500 text-sm min-h-[60px]"
                    placeholder="Enter reason for flagging"
                  />
                  {editFlagReason.trim() === '' &&
                    editError === 'Flag reason is required when flagged.' && (
                      <div className="text-red-400 text-xs mt-1">
                        Flag reason is required when flagged.
                      </div>
                    )}
                </div>
              )}
              {/* Only show general error if it's not the flag reason error */}
              {editError && editError !== 'Flag reason is required when flagged.' && (
                <div className="text-red-400 text-sm text-left">{editError}</div>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={handleEditCancel}
                className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800/30"
                disabled={editSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600/90 rounded-lg hover:bg-blue-700/90 transition-all duration-200"
                disabled={editSaving}
              >
                {editSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 flex-1 flex flex-col overflow-hidden">
        <div className="overflow-auto flex-1">
          <table className="w-full min-w-[900px]">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-gray-700 bg-gray-900">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Host
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {devices.length > 0 ? (
                devices.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-700 transition-colors group">
                    {/* Device with thumbnail */}
                    <td className="px-4 py-4 align-top max-w-[230px]">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="relative w-8 h-14 bg-gray-800 rounded-[8px] border border-gray-600 shadow-lg overflow-hidden">
                            {/* Device Screen */}
                            <div className="absolute inset-0.5 bg-gray-900 rounded-[6px] overflow-hidden">
                              {/* Status Bar */}
                              <div className="h-3 bg-gray-800 flex items-center justify-between px-0.5">
                                <div className="flex items-center gap-0.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                                </div>
                                <div className="w-6 h-1 rounded-full bg-gray-600"></div>
                              </div>
                              {/* Home Indicator */}
                              <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gray-600 rounded-full"></div>
                            </div>
                            {/* Platform Icon */}
                            <div className="absolute -bottom-0.5 -right-0.5 bg-gray-800 rounded-full p-0.5">
                              {device.platform.toLowerCase() === 'ios' ? (
                                <Apple className="text-gray-400" sx={{ fontSize: 10 }} />
                              ) : (
                                <Android className="text-green-500" sx={{ fontSize: 10 }} />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-start min-w-[160px]">
                          <div className="text-sm font-semibold text-gray-200 flex text-left gap-1 w-full">
                            {device.name}
                            {device.isFlagged && (
                              <Tooltip
                                title={
                                  <span className="text-white text-xs">
                                    {device.flaggedReason || 'Flagged'}
                                  </span>
                                }
                                placement="top"
                                arrow
                                componentsProps={{
                                  tooltip: {
                                    sx: {
                                      bgcolor: '#18181b',
                                      color: '#fff',
                                      fontSize: '0.85rem',
                                      borderRadius: 1,
                                      boxShadow: 3,
                                      px: 2,
                                      py: 1,
                                    },
                                  },
                                  arrow: {
                                    sx: {
                                      color: '#18181b',
                                    },
                                  },
                                }}
                              >
                                <span className="ml-1 cursor-pointer">
                                  <FiFlag className="text-red-500" size={14} />
                                </span>
                              </Tooltip>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 text-left flex items-center gap-2">
                            <span>{device.platform === 'android' ? 'Android' : 'iOS'}</span>
                            <span className="text-gray-500">•</span>
                            <span>{device.version}</span>
                            {!device.real && (
                              <span
                                className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${device.platform.toLowerCase() === 'android' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-200'}`}
                              >
                                {device.platform.toLowerCase() === 'android'
                                  ? 'Emulator'
                                  : 'Simulator'}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-500 font-mono mt-1 break-all">
                            {device.udid}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Host column */}
                    <td className="px-6 py-4 text-left align-top">
                      <span className="flex items-center gap-1 text-gray-300">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                          <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                          <line x1="6" y1="6" x2="6" y2="6"></line>
                          <line x1="6" y1="18" x2="6" y2="18"></line>
                        </svg>
                        {/^https?:\/\//.test(device.host) ? (
                          <a
                            href={device.host}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-blue-400 text-sm break-all underline-offset-2 hover:underline hover:text-blue-300 cursor-pointer transition-colors"
                          >
                            {device.host}
                          </a>
                        ) : (
                          <span className="font-mono text-blue-400 text-sm break-all">
                            {device.host}
                          </span>
                        )}
                      </span>
                    </td>
                    {/* Status badge */}
                    <td className="px-6 py-4 text-left">
                      {getStatusBadge(device.isActive ? 'Online' : 'Offline')}
                    </td>
                    {/* Usage */}
                    <td className="px-6 py-4 text-sm text-gray-200 font-medium text-left">
                      {formatUsage(device.usage)}
                    </td>
                    {/* Tags column */}
                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        {device.tags && device.tags.trim() !== '' ? (
                          device.tags.split(',').map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-700 text-gray-200 px-2 py-0.5 rounded-md text-xs font-medium"
                            >
                              {tag.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div>
                        <button
                          className="p-1 text-gray-400 hover:text-white bg-gray-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                          title="Actions"
                          onClick={(e) => handleActionMenuOpen(e, device)}
                        >
                          <MoreVert sx={{ fontSize: 20 }} />
                        </button>
                        <Menu
                          anchorEl={actionMenuAnchor}
                          open={Boolean(actionMenuAnchor) && actionMenuDevice?.id === device.id}
                          onClose={handleActionMenuClose}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                          PaperProps={{
                            sx: {
                              bgcolor: '#18181b',
                              color: '#e5e7eb',
                              borderRadius: 2,
                              boxShadow: 6,
                              minWidth: 160,
                              p: 0.5,
                            },
                          }}
                          MenuListProps={{ sx: { p: 0 } }}
                        >
                          <MenuItem
                            onClick={handleMenuEdit}
                            sx={{ fontWeight: 500, gap: 1, fontSize: 15 }}
                          >
                            <Edit sx={{ fontSize: 18 }} className="text-gray-200" /> Edit
                          </MenuItem>
                          <MenuItem
                            onClick={handleMenuDelete}
                            sx={{ color: '#ef4444', fontWeight: 500, gap: 1, fontSize: 15 }}
                          >
                            <Delete sx={{ fontSize: 18 }} className="text-red-500" /> Delete
                          </MenuItem>
                        </Menu>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="mb-6">
                        <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
                          <rect
                            x="8"
                            y="16"
                            width="48"
                            height="32"
                            rx="6"
                            fill="#23272e"
                            stroke="#374151"
                            strokeWidth="2"
                          />
                          <rect x="20" y="24" width="24" height="8" rx="2" fill="#374151" />
                          <rect x="28" y="36" width="8" height="4" rx="1" fill="#374151" />
                          <circle cx="32" cy="48" r="2" fill="#4B5563" />
                        </svg>
                      </div>
                      <div className="text-lg font-semibold text-gray-200 mb-2">
                        No Devices Found
                      </div>
                      <div className="text-gray-400 text-sm max-w-xs mx-auto">
                        There are currently no devices available. Add a new device to get started
                        and see it appear here.
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
