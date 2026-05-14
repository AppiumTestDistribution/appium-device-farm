import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TeamsService, { Team } from '../services/TeamsService';
import AuthService, { User } from '../services/AuthService';
import DeviceService, { Device } from '../services/DeviceService';
import {
  FiEdit,
  FiTrash2,
  FiX,
  FiPlus,
  FiUsers,
  FiSearch,
  FiSmartphone,
  FiMoreVertical,
} from 'react-icons/fi';
import Avatar from '../components/common/Avatar';

const Teams: React.FC = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState<boolean>(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState<Partial<Team>>({});
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deviceSearchQuery, setDeviceSearchQuery] = useState<string>('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [versionFilter, setVersionFilter] = useState<string>('all');

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedTeams, fetchedUsers, fetchedDevices] = await Promise.all([
          TeamsService.getAll(),
          AuthService.getAllUsers(),
          DeviceService.listDevicesForPermissions(),
        ]);
        setTeams(fetchedTeams);
        setUsers(fetchedUsers);
        setDevices(fetchedDevices);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (teamId: string) => {
    const teamToEdit = teams.find((team) => team.id === teamId);
    if (teamToEdit) {
      setEditingTeam(teamToEdit);
      setFormData({
        name: teamToEdit.name,
        description: teamToEdit.description,
      });
      setIsModalOpen(true);
    }
  };

  const handleManageUsers = (teamId: string) => {
    const teamToEdit = teams.find((team) => team.id === teamId);
    if (teamToEdit) {
      setEditingTeam(teamToEdit);
      // Set selected users based on existing team members
      const existingMemberIds = teamToEdit.teamMembers?.map((member) => member.userId) || [];
      setSelectedUsers(existingMemberIds);
      setIsUserModalOpen(true);
    }
  };

  const handleManageDevices = async (teamId: string) => {
    const teamToEdit = teams.find((team) => team.id === teamId);
    if (teamToEdit) {
      setEditingTeam(teamToEdit);
      try {
        const fetchedDevices = await DeviceService.listDevicesForPermissions();
        setDevices(fetchedDevices);
        // Set selected devices based on existing team device allocations
        const existingDeviceIds = teamToEdit.teamDevices?.map((device) => device.deviceId) || [];
        setSelectedDevices(existingDeviceIds);
        setIsDeviceModalOpen(true);
      } catch (err) {
        console.error('Failed to fetch devices:', err);
        setError('Failed to fetch devices. Please try again.');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeam(null);
    setFormData({});
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setEditingTeam(null);
    setSelectedUsers([]);
  };

  const handleCloseDeviceModal = () => {
    setIsDeviceModalOpen(false);
    setEditingTeam(null);
    setSelectedDevices([]);
    setDeviceSearchQuery('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedUsers(selectedOptions);
  };

  const handleSave = async () => {
    try {
      if (editingTeam) {
        // Update existing team
        await TeamsService.updateTeam(editingTeam.id, formData);
      } else {
        // Create new team
        await TeamsService.create({
          name: formData.name || '',
          description: formData.description || '',
        });
      }
      handleCloseModal();
      // Refresh the teams list
      const fetchedTeams = await TeamsService.getAll();
      setTeams(fetchedTeams);
    } catch (err) {
      console.error('Failed to save team:', err);
      setError('Failed to save team. Please try again.');
    }
  };

  const handleSaveUsers = async () => {
    try {
      if (editingTeam) {
        // Get existing member IDs
        const existingMemberIds = editingTeam.teamMembers?.map((member) => member.userId) || [];

        // Calculate users to add and remove
        const usersToAdd = selectedUsers.filter((id) => !existingMemberIds.includes(id));
        const usersToRemove = existingMemberIds.filter((id) => !selectedUsers.includes(id));

        await TeamsService.manageMembers(editingTeam.id, usersToAdd, usersToRemove);
        handleCloseUserModal();
        // Refresh the teams list
        const fetchedTeams = await TeamsService.getAll();
        setTeams(fetchedTeams);
      }
    } catch (err) {
      console.error('Failed to save team members:', err);
      setError('Failed to save team members. Please try again.');
    }
  };

  const handleSaveDevices = async () => {
    try {
      if (editingTeam) {
        // Get existing device IDs
        const existingDeviceIds = editingTeam.teamDevices?.map((device) => device.deviceId) || [];

        // Calculate devices to add and remove
        const devicesToAdd = selectedDevices.filter((id) => !existingDeviceIds.includes(id));
        const devicesToRemove = existingDeviceIds.filter((id) => !selectedDevices.includes(id));

        // Call the API to manage devices
        await TeamsService.manageDevices(editingTeam.id, devicesToAdd, devicesToRemove);
        handleCloseDeviceModal();
        // Refresh the teams list
        const fetchedTeams = await TeamsService.getAll();
        setTeams(fetchedTeams);
      }
    } catch (err) {
      console.error('Failed to save team devices:', err);
      setError('Failed to save team devices. Please try again.');
    }
  };

  const handleDelete = async (teamId: string) => {
    const teamToDelete = teams.find((team) => team.id === teamId);
    const teamName = teamToDelete?.name || 'this team';

    if (
      !window.confirm(
        `Are you sure you want to permanently delete team "${teamName}"?\n\nThis action cannot be undone.`,
      )
    ) {
      return;
    }

    // Close the menu immediately after confirmation
    setActiveMenu(null);

    try {
      await TeamsService.deleteTeam(teamId);

      // Remove the team from the local state
      setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
    } catch (err) {
      console.error('Failed to delete team:', err);
      setError(`Failed to delete team: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleMenuClick = (teamId: string, e: React.MouseEvent) => {
    // Get position information from the click event
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    // Calculate position for the menu - position it below the button
    setMenuPosition({
      top: rect.bottom + window.scrollY,
      right: window.innerWidth - rect.right,
    });

    setActiveMenu(activeMenu === teamId ? null : teamId);
  };

  const handleMenuClose = () => {
    setActiveMenu(null);
  };

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.role !== 'admin' && // Exclude admin users
      (user.username.toLowerCase().includes(searchLower) ||
        user.firstname.toLowerCase().includes(searchLower) ||
        user.lastname.toLowerCase().includes(searchLower))
    );
  });

  // Get unique platforms and versions from devices
  const platforms = ['all', ...new Set(devices.map((device) => device.platform))];
  const versions = ['all', ...new Set(devices.map((device) => device.version))];

  const filteredDevices = devices.filter((device) => {
    const searchLower = deviceSearchQuery.toLowerCase();
    const matchesSearch =
      device.name.toLowerCase().includes(searchLower) ||
      device.udid.toLowerCase().includes(searchLower);
    const matchesPlatform = platformFilter === 'all' || device.platform === platformFilter;
    const matchesVersion = versionFilter === 'all' || device.version === versionFilter;

    return matchesSearch && matchesPlatform && matchesVersion;
  });

  const handleSelectAllToggle = () => {
    const filteredDeviceIds = filteredDevices.map((device) => device.id);
    const allFilteredSelected = filteredDeviceIds.every((id) => selectedDevices.includes(id));

    if (allFilteredSelected) {
      // Deselect all filtered devices
      setSelectedDevices((prev) => prev.filter((id) => !filteredDeviceIds.includes(id)));
    } else {
      // Select all filtered devices
      setSelectedDevices((prev) => {
        const newSelection = new Set([...prev, ...filteredDeviceIds]);
        return Array.from(newSelection);
      });
    }
  };

  const handleUserSelectAllToggle = () => {
    const filteredUserIds = filteredUsers.map((user) => user.id);
    const allFilteredSelected = filteredUserIds.every((id) => selectedUsers.includes(id));

    if (allFilteredSelected) {
      // Deselect all filtered users
      setSelectedUsers((prev) => prev.filter((id) => !filteredUserIds.includes(id)));
    } else {
      // Select all filtered users
      setSelectedUsers((prev) => {
        const newSelection = new Set([...prev, ...filteredUserIds]);
        return Array.from(newSelection);
      });
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading teams...</div>;
  }

  if (error) {
    return (
      <div className="p-8 m-6 text-center text-red-400 bg-red-900/20 border border-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full p-6 text-gray-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Teams Management</h1>
        <button
          onClick={() => {
            setEditingTeam(null);
            setFormData({});
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FiPlus size={16} />
          Add Team
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-md">
        {/* Table Wrapper with horizontal scroll */}
        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="min-w-[800px] grid grid-cols-[2fr,2fr,2fr,auto] gap-4 px-6 py-3 bg-gray-800/50 border-b border-gray-800 sticky top-0 z-10">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-left">
              Team Name
            </div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-left">
              Description
            </div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-left">
              Members
            </div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-right">
              Actions
            </div>
          </div>

          {/* Table Body with vertical scroll */}
          <div className="divide-y divide-gray-800 max-h-[70vh] overflow-y-auto">
            {teams.length > 0 ? (
              teams.map((team) => (
                <div
                  key={team.id}
                  className="min-w-[800px] grid grid-cols-[2fr,2fr,2fr,auto] gap-4 px-6 py-4 items-center group hover:bg-gray-800/50 transition-colors duration-150"
                >
                  <div className="text-sm font-medium text-gray-200 truncate text-left">
                    {team.name}
                  </div>
                  <div className="text-sm text-gray-400 text-left">{team.description}</div>
                  <div className="text-sm text-gray-400 text-left">
                    <div className="flex gap-2">
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/20 text-blue-400">
                        {team.teamMembers?.length || 0} member
                        {team.teamMembers?.length !== 1 ? 's' : ''}
                      </div>
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/20 text-purple-400">
                        {team.teamDevices?.length || 0} device
                        {team.teamDevices?.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <div className="relative">
                      <button
                        onClick={(e) => handleMenuClick(team.id, e)}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        title="Actions"
                      >
                        <FiMoreVertical size={16} />
                      </button>
                      {activeMenu === team.id && (
                        <div
                          ref={menuRef}
                          className="fixed z-50"
                          style={{
                            top: `${menuPosition.top}px`,
                            right: `${menuPosition.right}px`,
                          }}
                        >
                          <div className="w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  handleEdit(team.id);
                                  handleMenuClose();
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                              >
                                <FiEdit size={14} />
                                Edit Team
                              </button>
                              <button
                                onClick={() => {
                                  handleManageUsers(team.id);
                                  handleMenuClose();
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                              >
                                <FiUsers size={14} />
                                Manage Users
                              </button>
                              <button
                                onClick={() => {
                                  handleManageDevices(team.id);
                                  handleMenuClose();
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                              >
                                <FiSmartphone size={14} />
                                Manage Devices
                              </button>
                              <button
                                onClick={() => handleDelete(team.id)}
                                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors flex items-center gap-2"
                              >
                                <FiTrash2 size={14} />
                                Delete Team
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No teams found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gray-900/90 rounded-lg p-8 w-full max-w-2xl border border-gray-800/30 animate-slideIn">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-white/90">
                {editingTeam ? 'Edit Team' : 'Add Team'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-800/30"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1.5 text-left">
                  Team Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-800/30 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 text-left"
                  placeholder="Enter team name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1.5 text-left">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-800/30 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 text-left min-h-[100px]"
                  placeholder="Enter team description"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800/30"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600/90 rounded-lg hover:bg-blue-700/90 transition-all duration-200"
              >
                {editingTeam ? 'Save Changes' : 'Create Team'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Management Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gray-900/90 rounded-lg p-8 w-full max-w-2xl border border-gray-800/30 animate-slideIn">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-white/90">Manage Team Members</h2>
              <button
                onClick={handleCloseUserModal}
                className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-800/30"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2 bg-transparent border-b border-gray-700/30 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/30 transition-colors"
                  />
                </div>

                {/* Select All Toggle */}
                <button
                  onClick={handleUserSelectAllToggle}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors ml-4"
                >
                  {filteredUsers.length > 0 &&
                  filteredUsers.every((user) => selectedUsers.includes(user.id))
                    ? 'Deselect All'
                    : 'Select All'}
                </button>
              </div>

              <div className="bg-gray-800/30 rounded-lg border border-gray-700/30 overflow-hidden">
                <div className="max-h-[400px] overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className={`flex items-center p-4 border-b border-gray-700/30 last:border-b-0 hover:bg-gray-700/20 transition-colors cursor-pointer ${
                          selectedUsers.includes(user.id) ? 'bg-blue-900/20' : ''
                        }`}
                        onClick={() => {
                          setSelectedUsers((prev) =>
                            prev.includes(user.id)
                              ? prev.filter((id) => id !== user.id)
                              : [...prev, user.id],
                          );
                        }}
                      >
                        <div className="flex items-center justify-center w-6 h-6 mr-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => {}}
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Avatar
                            firstname={user.firstname}
                            lastname={user.lastname}
                            size="sm"
                            variant="text"
                          />
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium text-white">
                              {user.firstname} {user.lastname}
                            </div>
                            <div className="text-xs text-gray-400">@{user.username}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                      <FiUsers className="w-12 h-12 mb-3 opacity-50" />
                      <p className="text-sm font-medium">
                        {searchQuery
                          ? 'No users found matching your search'
                          : 'No users available to add to the team'}
                      </p>
                      {searchQuery && (
                        <p className="text-xs mt-1">Try adjusting your search criteria</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8">
              <div className="text-sm text-gray-400">
                {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleCloseUserModal}
                  className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800/30"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUsers}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-green-600/90 rounded-lg hover:bg-green-700/90 transition-all duration-200"
                >
                  Save Members
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Device Management Modal */}
      {isDeviceModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gray-900/90 rounded-lg p-8 w-full max-w-2xl border border-gray-800/30 animate-slideIn">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-white/90">Manage Team Devices</h2>
              <button
                onClick={handleCloseDeviceModal}
                className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-800/30"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {/* Search Input */}
                  <div className="relative flex-[3]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={deviceSearchQuery}
                      onChange={(e) => setDeviceSearchQuery(e.target.value)}
                      placeholder="Search devices by name or UDID..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-800/30 text-white placeholder-gray-400 focus:outline-none focus:ring-0 transition-colors rounded-lg"
                    />
                  </div>

                  {/* Platform Filter */}
                  <div className="w-36">
                    <select
                      value={platformFilter}
                      onChange={(e) => setPlatformFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800/30 text-gray-300 focus:outline-none focus:ring-0 appearance-none cursor-pointer hover:bg-gray-700/30 transition-colors rounded-lg"
                    >
                      <option value="all" className="bg-gray-800">
                        All Platforms
                      </option>
                      {platforms
                        .filter((p) => p !== 'all')
                        .map((platform) => (
                          <option key={platform} value={platform} className="bg-gray-800">
                            {platform}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Version Filter */}
                  <div className="w-36">
                    <select
                      value={versionFilter}
                      onChange={(e) => setVersionFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800/30 text-gray-300 focus:outline-none focus:ring-0 appearance-none cursor-pointer hover:bg-gray-700/30 transition-colors rounded-lg"
                    >
                      <option value="all" className="bg-gray-800">
                        All Versions
                      </option>
                      {versions
                        .filter((v) => v !== 'all')
                        .map((version) => (
                          <option key={version} value={version} className="bg-gray-800">
                            {version}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Select All Toggle */}
                <button
                  onClick={handleSelectAllToggle}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors ml-4"
                >
                  {filteredDevices.length > 0 &&
                  filteredDevices.every((device) => selectedDevices.includes(device.id))
                    ? 'Deselect All'
                    : 'Select All'}
                </button>
              </div>

              {/* Device List */}
              <div className="bg-gray-800/30 rounded-lg border border-gray-700/30 overflow-hidden">
                <div className="max-h-[400px] overflow-y-auto">
                  {filteredDevices.length > 0 ? (
                    filteredDevices.map((device) => (
                      <div
                        key={device.id}
                        className={`flex items-center p-4 border-b border-gray-700/30 last:border-b-0 hover:bg-gray-700/20 transition-colors cursor-pointer ${
                          selectedDevices.includes(device.id) ? 'bg-purple-900/20' : ''
                        }`}
                        onClick={() => {
                          setSelectedDevices((prev) =>
                            prev.includes(device.id)
                              ? prev.filter((id) => id !== device.id)
                              : [...prev, device.id],
                          );
                        }}
                      >
                        <div className="flex items-center justify-center w-6 h-6 mr-4">
                          <input
                            type="checkbox"
                            checked={selectedDevices.includes(device.id)}
                            onChange={() => {}}
                            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium text-white">{device.name}</div>
                          <div className="text-xs text-gray-400">
                            {device.platform} {device.version} •{' '}
                            {device.real ? 'Real Device' : 'Emulator'} • {device.udid}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                      <FiSmartphone className="w-12 h-12 mb-3 opacity-50" />
                      <p className="text-sm font-medium">
                        {deviceSearchQuery
                          ? 'No devices found matching your search'
                          : 'No devices available to add to the team'}
                      </p>
                      {deviceSearchQuery && (
                        <p className="text-xs mt-1">Try adjusting your search criteria</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8">
              <div className="text-sm text-gray-400">
                {selectedDevices.length} device{selectedDevices.length !== 1 ? 's' : ''} selected
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleCloseDeviceModal}
                  className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800/30"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDevices}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-purple-600/90 rounded-lg hover:bg-purple-700/90 transition-all duration-200"
                >
                  Save Devices
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
