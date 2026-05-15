import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import ProfilePopup from '../header/ProfilePopup';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrentPageTitle } from './useCurrentPageTitle';

export function TopBar() {
  const title = useCurrentPageTitle();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isAuthDisabled } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/device-farm/#/');
  };

  return (
    <header
      className="sticky top-0 z-40 h-14 bg-surface border-b border-border-soft"
      role="banner"
    >
      <div className="flex items-center justify-between h-full pl-6 pr-6">
        <h1 className="text-lg font-semibold text-text-strong truncate">{title}</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-text hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-brand-ring"
              aria-label="Open profile menu"
            >
              <Avatar
                firstname={user?.firstname || ''}
                lastname={user?.lastname || ''}
                size="sm"
                variant="text"
              />
              <span className="text-sm font-medium">{user?.username}</span>
            </button>

            <ProfilePopup
              isOpen={profileOpen}
              onClose={() => setProfileOpen(false)}
              username={user?.username || ''}
              isAdmin={isAdmin()}
              onLogout={handleLogout}
              isAuthDisabled={isAuthDisabled}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
