import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AccountCircle, AdminPanelSettings } from '@mui/icons-material';
import { Menu } from '@mui/material';

const UserMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const handleAdminDashboard = () => {
    handleMenuClose();
    navigate('/admin');
  };

  return (
    <div>
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-md text-white hover:bg-gray-700 ml-4"
        onClick={handleMenuOpen}
      >
        <AccountCircle fontSize="medium" />
        <span>{user?.username}</span>
      </button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {isAdmin() && (
          <button
            onClick={handleAdminDashboard}
            className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
          >
            <AdminPanelSettings fontSize="small" />
            <span>Admin Dashboard</span>
          </button>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 text-red-600"
        >
          <span>Logout</span>
        </button>
      </Menu>
    </div>
  );
};

export default UserMenu;
