import React, { useState, useEffect, useRef } from 'react';
import AuthService, { User } from '../../services/AuthService';
import {
  FiEdit,
  FiTrash2,
  FiX,
  FiChevronDown,
  FiPlus,
  FiMoreVertical,
  FiUserCheck,
  FiUserX,
} from 'react-icons/fi';
import Avatar from '../../components/common/Avatar';
// import './UsersPage.css'; // Remove CSS import, use Tailwind

const CustomSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
}> = ({ value, onChange, options, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={selectRef}>
      <label className="block text-sm font-medium text-gray-200 mb-1.5 text-left">{label}</label>
      <div
        className="w-full px-4 py-2.5 bg-gray-800/30 border border-gray-700/30 rounded-lg text-white cursor-pointer flex items-center justify-between hover:border-gray-600/30 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-left">{selectedOption?.label || 'Select role'}</span>
        <FiChevronDown
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800/90 border border-gray-700/30 rounded-lg overflow-hidden">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2.5 cursor-pointer hover:bg-gray-700/30 transition-colors duration-150 text-left ${
                value === option.value ? 'bg-blue-600/20 text-blue-300' : 'text-gray-300'
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User> & { password?: string }>({});
  const [createFormData, setCreateFormData] = useState({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    role: 'user',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [createFormErrors, setCreateFormErrors] = useState<{ [key: string]: string }>({});
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await AuthService.getAllUsers();
        setUsers(fetchedUsers);
        setError(null);
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId: string) => {
    const userToEdit = users.find((user) => user.id === userId);
    if (userToEdit) {
      setEditingUser(userToEdit);
      setFormData({
        username: userToEdit.username,
        firstname: userToEdit.firstname,
        lastname: userToEdit.lastname,
        role: userToEdit.role,
      });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({});
  };

  const validateForm = (data: Partial<User> & { password?: string }) => {
    const errors: { [key: string]: string } = {};
    if (!data.firstname?.trim()) errors.firstname = 'First name is required';
    if (!data.lastname?.trim()) errors.lastname = 'Last name is required';
    if (!data.username?.trim()) errors.username = 'Username is required';
    if (!data.password?.trim()) errors.password = 'Password is required';
    if (!data.role?.trim()) errors.role = 'Role is required';
    return errors;
  };

  const validateCreateForm = (data: typeof createFormData) => {
    const errors: { [key: string]: string } = {};
    if (!data.firstname.trim()) errors.firstname = 'First name is required';
    if (!data.lastname.trim()) errors.lastname = 'Last name is required';
    if (!data.username.trim()) errors.username = 'Username is required';
    if (!data.password.trim()) errors.password = 'Password is required';
    if (!data.role.trim()) errors.role = 'Role is required';
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    if (!editingUser) return;

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await AuthService.updateUser(editingUser.id, {
        firstname: formData.firstname || '',
        lastname: formData.lastname || '',
        role: formData.role || 'user',
        password: formData.password || undefined,
      });
      handleCloseModal();
      // Refresh the users list
      const fetchedUsers = await AuthService.getAllUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Failed to update user:', err);
      setError('Failed to update user. Please try again.');
    }
  };

  const handleCreateUser = async () => {
    const errors = validateCreateForm(createFormData);
    if (Object.keys(errors).length > 0) {
      setCreateFormErrors(errors);
      return;
    }

    try {
      await AuthService.register(
        createFormData.username,
        createFormData.password,
        createFormData.firstname,
        createFormData.lastname,
        createFormData.role,
      );
      setIsCreateModalOpen(false);
      setCreateFormData({
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        role: 'user',
      });
      // Refresh the users list
      const fetchedUsers = await AuthService.getAllUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Failed to create user:', err);
      setError('Failed to create user. Please try again.');
    }
  };

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (createFormErrors[name]) {
      setCreateFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleMenuClick = (userId: string, e: React.MouseEvent) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    setMenuPosition({
      top: rect.bottom + window.scrollY,
      right: window.innerWidth - rect.right,
    });

    setActiveMenu(activeMenu === userId ? null : userId);
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

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      if (isActive) {
        await AuthService.deactivateUser(userId);
      } else {
        await AuthService.activateUser(userId);
      }
      // Refresh the users list
      const fetchedUsers = await AuthService.getAllUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Failed to update user status:', err);
      setError('Failed to update user status. Please try again.');
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    // Find the user being deleted
    const userToDelete = users.find((user) => user.id === userId);

    // Check if this is an admin user
    if (userToDelete?.role === 'admin') {
      // Count active admin users (excluding the one being deleted)
      const activeAdmins = users.filter(
        (user) => user.role === 'admin' && user.isActive && user.id !== userId,
      );

      // If this is the last active admin, prevent deletion
      if (activeAdmins.length === 0) {
        alert(
          '❌ CANNOT DELETE LAST ADMIN\n\nYou cannot delete the last remaining active admin user.\n\nAt least one admin must remain in the system to manage users and maintain administrative access.\n\nPlease:\n• Create another admin user first, OR\n• Reactivate an existing admin user',
        );
        return;
      }
    }

    if (
      !window.confirm(
        `Are you sure you want to permanently delete user "${username}"?\n\nThis action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await AuthService.deleteUser(userId);

      // Remove the user from the local state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      // Close any open menu
      setActiveMenu(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Failed to delete user. Please try again later.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="p-8 m-6 text-center text-red-400 bg-red-900/20 border border-red-700 rounded">
        {error}
      </div>
    );
  }

  // Helper to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full p-6 text-gray-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white/90">Users</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600/90 text-white rounded-lg hover:bg-blue-700/90 transition-all duration-200 flex items-center space-x-2"
        >
          <FiPlus size={18} />
          <span>Create User</span>
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-md">
        {/* Table Wrapper with horizontal scroll */}
        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="min-w-[1000px] grid grid-cols-[auto,2fr,1fr,1fr,1fr,1fr,auto] gap-4 px-6 py-3 bg-gray-800/50 border-b border-gray-800 sticky top-0 z-10">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-left">
              {/* Empty header for avatar column */}
            </div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-left">
              Username
            </div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-left">
              First Name
            </div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-left">
              Last Name
            </div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-left">
              Role
            </div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-left">
              Created At
            </div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider text-left">
              Actions
            </div>
          </div>

          {/* Table Body with vertical scroll */}
          <div className="divide-y divide-gray-800 max-h-[70vh] overflow-y-auto">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className={`min-w-[1000px] grid grid-cols-[auto,2fr,1fr,1fr,1fr,1fr,auto] gap-4 px-6 py-4 items-center group transition-colors duration-150 ${
                    !user.isActive ? 'bg-gray-800/30 hover:bg-gray-800/50' : 'hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center">
                    <Avatar firstname={user.firstname} lastname={user.lastname} />
                  </div>
                  <div className="text-sm font-medium text-gray-200 truncate text-left">
                    {user.username}
                    {!user.isActive && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded bg-gray-700 text-gray-400">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 text-left">{user.firstname}</div>
                  <div className="text-sm text-gray-400 text-left">{user.lastname}</div>
                  <div className="text-sm text-gray-400 text-left">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                        user.role.toLowerCase() === 'admin'
                          ? 'bg-teal-700 text-teal-100'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 text-left">
                    {formatDate(user.createdAt)}
                  </div>
                  <div className="flex justify-start space-x-2">
                    <div className="relative">
                      <button
                        onClick={(e) => handleMenuClick(user.id, e)}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        title="Actions"
                      >
                        <FiMoreVertical size={16} />
                      </button>
                      {activeMenu === user.id && (
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
                                  handleEdit(user.id);
                                  handleMenuClose();
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors flex items-center gap-2"
                              >
                                <FiEdit size={14} />
                                Edit User
                              </button>
                              <button
                                onClick={() => {
                                  handleToggleUserStatus(user.id, user.isActive);
                                  handleMenuClose();
                                }}
                                className={`w-full px-4 py-2 text-left text-sm ${
                                  user.isActive
                                    ? 'text-orange-400 hover:text-orange-300'
                                    : 'text-green-400 hover:text-green-300'
                                } hover:bg-gray-700 transition-colors flex items-center gap-2`}
                              >
                                {user.isActive ? (
                                  <>
                                    <FiUserX size={14} />
                                    Deactivate User
                                  </>
                                ) : (
                                  <>
                                    <FiUserCheck size={14} />
                                    Activate User
                                  </>
                                )}
                              </button>
                              <div className="border-t border-gray-600 my-1"></div>
                              {(() => {
                                const isLastAdmin =
                                  user.role === 'admin' &&
                                  users.filter(
                                    (u) => u.role === 'admin' && u.isActive && u.id !== user.id,
                                  ).length === 0;

                                return (
                                  <button
                                    onClick={() => {
                                      handleDeleteUser(user.id, user.username);
                                      handleMenuClose();
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm ${
                                      isLastAdmin
                                        ? 'text-gray-500 cursor-not-allowed bg-gray-800'
                                        : 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                                    } transition-colors flex items-center gap-2`}
                                    disabled={isLastAdmin}
                                    title={
                                      isLastAdmin
                                        ? 'Cannot delete the last remaining admin user'
                                        : 'Permanently delete this user'
                                    }
                                  >
                                    <FiTrash2 size={14} />
                                    {isLastAdmin
                                      ? 'Last Admin (Cannot Delete)'
                                      : 'Permanently Delete User'}
                                  </button>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No users found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gray-900/90 rounded-lg p-8 w-full max-w-2xl border border-gray-800/30 animate-slideIn">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-white/90">Edit User</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-800/30"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1.5 text-left">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname || ''}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2.5 bg-gray-800/30 border ${
                      formErrors.firstname ? 'border-red-500' : 'border-gray-700/30'
                    } rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 text-left placeholder:text-sm placeholder:text-gray-500 text-sm`}
                    placeholder="Enter first name *"
                  />
                  {formErrors.firstname && (
                    <p className="mt-1 text-sm text-red-500 text-left">{formErrors.firstname}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1.5 text-left">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname || ''}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2.5 bg-gray-800/30 border ${
                      formErrors.lastname ? 'border-red-500' : 'border-gray-700/30'
                    } rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 text-left placeholder:text-sm placeholder:text-gray-500 text-sm`}
                    placeholder="Enter last name *"
                  />
                  {formErrors.lastname && (
                    <p className="mt-1 text-sm text-red-500 text-left">{formErrors.lastname}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1.5 text-left">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username || ''}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2.5 bg-gray-800/30 border ${
                      formErrors.username ? 'border-red-500' : 'border-gray-700/30'
                    } rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 text-left placeholder:text-sm placeholder:text-gray-500 text-sm`}
                    placeholder="Enter username *"
                  />
                  {formErrors.username && (
                    <p className="mt-1 text-sm text-red-500 text-left">{formErrors.username}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1.5 text-left">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password || ''}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2.5 bg-gray-800/30 border ${
                      formErrors.password ? 'border-red-500' : 'border-gray-700/30'
                    } rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 text-left placeholder:text-sm placeholder:text-gray-500 text-sm`}
                    placeholder="Enter password *"
                  />
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-500 text-left">{formErrors.password}</p>
                  )}
                </div>
              </div>

              <CustomSelect
                value={formData.role || ''}
                onChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                options={roleOptions}
                label="Role"
              />
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
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gray-900/90 rounded-lg p-8 w-full max-w-2xl border border-gray-800/30 animate-slideIn">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-white/90">Create New User</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-800/30"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1.5 text-left">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    value={createFormData.firstname}
                    onChange={handleCreateInputChange}
                    required
                    className={`w-full px-4 py-2.5 bg-gray-800/30 border ${
                      createFormErrors.firstname ? 'border-red-500' : 'border-gray-700/30'
                    } rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 text-left placeholder:text-sm placeholder:text-gray-500 text-sm`}
                    placeholder="Enter first name *"
                  />
                  {createFormErrors.firstname && (
                    <p className="mt-1 text-sm text-red-500 text-left">
                      {createFormErrors.firstname}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1.5 text-left">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    value={createFormData.lastname}
                    onChange={handleCreateInputChange}
                    required
                    className={`w-full px-4 py-2.5 bg-gray-800/30 border ${
                      createFormErrors.lastname ? 'border-red-500' : 'border-gray-700/30'
                    } rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 text-left placeholder:text-sm placeholder:text-gray-500 text-sm`}
                    placeholder="Enter last name *"
                  />
                  {createFormErrors.lastname && (
                    <p className="mt-1 text-sm text-red-500 text-left">
                      {createFormErrors.lastname}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1.5 text-left">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={createFormData.username}
                    onChange={handleCreateInputChange}
                    required
                    className={`w-full px-4 py-2.5 bg-gray-800/30 border ${
                      createFormErrors.username ? 'border-red-500' : 'border-gray-700/30'
                    } rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 text-left placeholder:text-sm placeholder:text-gray-500 text-sm`}
                    placeholder="Enter username *"
                  />
                  {createFormErrors.username && (
                    <p className="mt-1 text-sm text-red-500 text-left">
                      {createFormErrors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1.5 text-left">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={createFormData.password}
                    onChange={handleCreateInputChange}
                    required
                    className={`w-full px-4 py-2.5 bg-gray-800/30 border ${
                      createFormErrors.password ? 'border-red-500' : 'border-gray-700/30'
                    } rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-transparent transition-all duration-200 text-left placeholder:text-sm placeholder:text-gray-500 text-sm`}
                    placeholder="Enter password *"
                  />
                  {createFormErrors.password && (
                    <p className="mt-1 text-sm text-red-500 text-left">
                      {createFormErrors.password}
                    </p>
                  )}
                </div>
              </div>

              <CustomSelect
                value={createFormData.role}
                onChange={(value) => setCreateFormData((prev) => ({ ...prev, role: value }))}
                options={roleOptions}
                label="Role"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800/30"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600/90 rounded-lg hover:bg-blue-700/90 transition-all duration-200"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
