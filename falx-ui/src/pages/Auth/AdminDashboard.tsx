import React, { useState, useEffect } from 'react';
import { Card, Tabs, Button, Alert } from 'flowbite-react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { TrashIcon, UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/outline';

// API base URL
const API_URL = '/device-farm/admin';

// Team interface
interface Team {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  teamMembers?: TeamMember[];
}

// User interface
interface User {
  id: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Device interface
interface Device {
  udid: string;
  name: string;
  platform: string;
  version: string;
  busy: boolean;
}

// Device allocation interface
interface DeviceAllocation {
  id: string;
  deviceUdid: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  team: Team;
}

interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  user: User;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [allocations, setAllocations] = useState<DeviceAllocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // New team form state
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');

  // New user form state
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');

  // Allocation form state
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');

  // Team member management state
  const [selectedTeamForMembers, setSelectedTeamForMembers] = useState<string>('');
  const [selectedUserForTeam, setSelectedUserForTeam] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch teams
        const teamsResponse = await axios.get(`${API_URL}/teams`);
        setTeams(teamsResponse.data);

        // Fetch users
        const usersResponse = await axios.get(`${API_URL}/auth/users`);
        setUsers(usersResponse.data);

        // Fetch devices
        const devicesResponse = await axios.get('/device-farm/api/device');
        setDevices(devicesResponse.data);

        // Fetch allocations
        const allocationsResponse = await axios.get(`${API_URL}/device-allocations`);
        setAllocations(allocationsResponse.data);
      } catch (err) {
        setError('Error fetching data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Create new team
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/teams`, {
        name: newTeamName,
        description: newTeamDescription || null,
      });

      setTeams([...teams, response.data]);
      setNewTeamName('');
      setNewTeamDescription('');
    } catch (err) {
      console.error('Error creating team:', err);
      setError('Error creating team');
    }
  };

  // Create new user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username: newUsername,
        password: newPassword,
        role: newRole,
      });

      setUsers([...users, response.data]);
      setNewUsername('');
      setNewPassword('');
      setNewRole('user');
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Error creating user');
    }
  };

  // Allocate device to team
  const handleAllocateDevice = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/device-allocations`, {
        deviceUdid: selectedDevice,
        teamId: selectedTeam,
      });

      setAllocations([...allocations, response.data]);
      setSelectedDevice('');
      setSelectedTeam('');
    } catch (err) {
      console.error('Error allocating device:', err);
      setError('Error allocating device');
    }
  };

  // Deallocate device from team
  const handleDeallocateDevice = async (allocationId: string) => {
    try {
      await axios.delete(`${API_URL}/device-allocations/${allocationId}`);
      setAllocations(allocations.filter((allocation) => allocation.id !== allocationId));
    } catch (err) {
      console.error('Error deallocating device:', err);
      setError('Error deallocating device');
    }
  };

  // Delete team
  const handleDeleteTeam = async (teamId: string) => {
    if (!window.confirm('Are you sure you want to delete this team?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/teams/${teamId}`);
      setTeams(teams.filter((team) => team.id !== teamId));
      setSuccessMessage('Team deleted successfully');
    } catch (err) {
      console.error('Error deleting team:', err);
      setError('Error deleting team');
    }
  };

  // Add user to team
  const handleAddUserToTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedTeamForMembers || !selectedUserForTeam) {
      setError('Please select both team and user');
      return;
    }

    try {
      console.log('Adding user to team:', {
        teamId: selectedTeamForMembers,
        userId: selectedUserForTeam,
        selectedUser: users.find((u) => u.id === selectedUserForTeam),
        selectedTeam: teams.find((t) => t.id === selectedTeamForMembers),
      });

      const response = await axios.post(`${API_URL}/teams/${selectedTeamForMembers}/members`, {
        userId: selectedUserForTeam,
      });

      console.log('Response from server:', response.data);

      // Update the teams state to include the new team member
      setTeams(
        teams.map((team) =>
          team.id === selectedTeamForMembers
            ? {
                ...team,
                teamMembers: [...(team.teamMembers || []), response.data],
              }
            : team,
        ),
      );

      setSelectedUserForTeam('');
      setSelectedTeamForMembers('');
      setSuccessMessage('User added to team successfully');
    } catch (err: any) {
      console.error('Error details:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(err.response?.data?.message || 'Error adding user to team');
    }
  };

  // Remove user from team
  const handleRemoveUserFromTeam = async (teamId: string, userId: string) => {
    try {
      await axios.delete(`${API_URL}/teams/${teamId}/members/${userId}`);

      // Update the teams state to remove the team member
      setTeams(
        teams.map((team) =>
          team.id === teamId
            ? {
                ...team,
                teamMembers: (team.teamMembers || []).filter((member) => member.userId !== userId),
              }
            : team,
        ),
      );

      setSuccessMessage('User removed from team successfully');
    } catch (err) {
      console.error('Error removing user from team:', err);
      setError('Error removing user from team');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Admin Dashboard</h1>

      {error && (
        <Alert color="failure" className="mb-4">
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert color="success" className="mb-4" onDismiss={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}

      <Tabs>
        <Tabs.Item title="Teams">
          <Card>
            <h2 className="text-xl font-bold mb-4">Teams</h2>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Create New Team</h3>
              <form onSubmit={handleCreateTeam} className="flex flex-col gap-4">
                <div>
                  <label className="block mb-2">Team Name</label>
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Description</label>
                  <textarea
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <Button type="submit">Create Team</Button>
              </form>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Existing Teams</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2">Name</th>
                      <th className="p-2">Description</th>
                      <th className="p-2">Members</th>
                      <th className="p-2">Created At</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team) => (
                      <tr key={team.id} className="border-b">
                        <td className="p-2">{team.name}</td>
                        <td className="p-2">{team.description || '-'}</td>
                        <td className="p-2">
                          <div className="flex flex-col gap-2">
                            {team.teamMembers?.map((member) => (
                              <div key={member.id} className="flex items-center gap-2">
                                <span>{member.user.username}</span>
                                <button
                                  onClick={() => handleRemoveUserFromTeam(team.id, member.userId)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <UserMinusIcon className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                            {selectedTeamForMembers === team.id ? (
                              <form
                                onSubmit={handleAddUserToTeam}
                                className="flex items-center gap-2"
                              >
                                <select
                                  value={selectedUserForTeam}
                                  onChange={(e) => setSelectedUserForTeam(e.target.value)}
                                  className="p-1 border rounded"
                                  required
                                >
                                  <option value="">Select User</option>
                                  {users
                                    .filter(
                                      (user) =>
                                        !team.teamMembers?.some(
                                          (member) => member.userId === user.id,
                                        ),
                                    )
                                    .map((user) => (
                                      <option key={user.id} value={user.id}>
                                        {user.username}
                                      </option>
                                    ))}
                                </select>
                                <Button size="xs" type="submit">
                                  <UserPlusIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="xs"
                                  color="gray"
                                  onClick={() => setSelectedTeamForMembers('')}
                                >
                                  Cancel
                                </Button>
                              </form>
                            ) : (
                              <Button size="xs" onClick={() => setSelectedTeamForMembers(team.id)}>
                                Add Member
                              </Button>
                            )}
                          </div>
                        </td>
                        <td className="p-2">{new Date(team.createdAt).toLocaleString()}</td>
                        <td className="p-2">
                          <button
                            onClick={() => handleDeleteTeam(team.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {teams.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-2 text-center">
                          No teams found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </Tabs.Item>

        <Tabs.Item title="Users">
          <Card>
            <h2 className="text-xl font-bold mb-4">Users</h2>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Create New User</h3>
              <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
                <div>
                  <label className="block mb-2">Username</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <Button type="submit">Create User</Button>
              </form>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Existing Users</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2">Username</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-2">{user.username}</td>
                        <td className="p-2">{user.role}</td>
                        <td className="p-2">{new Date(user.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-2 text-center">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </Tabs.Item>

        <Tabs.Item title="Device Allocations">
          <Card>
            <h2 className="text-xl font-bold mb-4">Device Allocations</h2>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Allocate Device to Team</h3>
              <form onSubmit={handleAllocateDevice} className="flex flex-col gap-4">
                <div>
                  <label className="block mb-2">Team</label>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Device</label>
                  <select
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Device</option>
                    {devices.map((device) => (
                      <option key={device.udid} value={device.udid}>
                        {device.name || device.udid} ({device.platform} {device.version})
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit">Allocate Device</Button>
              </form>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Current Allocations</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2">Device</th>
                      <th className="p-2">Team</th>
                      <th className="p-2">Created At</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations.map((allocation) => {
                      const device = devices.find((d) => d.udid === allocation.deviceUdid);
                      return (
                        <tr key={allocation.id} className="border-b">
                          <td className="p-2">
                            {device
                              ? `${device.name || device.udid} (${device.platform} ${device.version})`
                              : allocation.deviceUdid}
                          </td>
                          <td className="p-2">{allocation.team.name}</td>
                          <td className="p-2">{new Date(allocation.createdAt).toLocaleString()}</td>
                          <td className="p-2">
                            <Button
                              color="failure"
                              size="xs"
                              onClick={() => handleDeallocateDevice(allocation.id)}
                            >
                              Deallocate
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                    {allocations.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-2 text-center">
                          No allocations found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </Tabs.Item>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
