import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import ProfilePopup from '../header/ProfilePopup';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrentPageTitle } from './useCurrentPageTitle';
import { logo } from './logo';

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
      className="sticky top-0 z-50 h-14 bg-surface border-b border-border-soft"
      role="banner"
    >
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center min-w-0">
          {/* Brand: logo + wordmark + divider — fixed at 56px wide column visually aligns with sidebar rail */}
          <div className="flex items-center w-12 shrink-0">
            <img src={logo} alt="" className="h-7 w-7" />
          </div>
          <span className="font-semibold text-text-strong tracking-tight mr-4">Falx</span>
          <div className="h-6 w-px bg-border-soft mr-4" aria-hidden />
          <h1 className="text-lg font-semibold text-text-strong truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
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
