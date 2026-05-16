import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import ProfilePopup from '../header/ProfilePopup';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrentPageTitle } from './useCurrentPageTitle';
import { useSidebarLayout } from './SidebarLayoutContext';

export function TopBar() {
  const title = useCurrentPageTitle();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isAuthDisabled } = useAuth();
  const { pinned } = useSidebarLayout();
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
      <div
        className="flex items-center justify-between h-full pr-4 transition-[padding-left] duration-200 ease-out"
        style={{ paddingLeft: (pinned ? 240 : 56) + 16 }}
      >
        {/* paddingLeft = sidebar width + 16px gutter, so the title aligns with content below */}
        <h1 className="text-lg font-semibold text-text-strong truncate">{title}</h1>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/device-farm/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-soft hover:text-text px-2 py-1 rounded-md hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-brand-ring"
            title="Open the legacy (proprietary) Use Device page in a new tab"
          >
            Legacy Use Device
          </a>
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
