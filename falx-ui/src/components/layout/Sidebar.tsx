import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Smartphone,
  Hammer,
  Package,
  BarChart3,
  Server,
  Users,
  Building2,
  Settings,
  ShieldCheck,
  LifeBuoy,
  ChevronsRight,
  Github,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebarLayout } from './SidebarLayoutContext';
import { SidebarItem } from './SidebarItem';

const RAIL_WIDTH = 56;
const DRAWER_WIDTH = 240;
const OPEN_DELAY_MS = 120;
const CLOSE_DELAY_MS = 250;

export function Sidebar() {
  const { pinned, setPinned, hovering, setHovering, expanded } = useSidebarLayout();
  const { isAdmin } = useAuth();
  const reduceMotion = useReducedMotion();

  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const clearTimers = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };

  const handleEnter = () => {
    if (pinned) return;
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    openTimer.current = window.setTimeout(() => setHovering(true), OPEN_DELAY_MS);
  };

  const handleLeave = () => {
    if (pinned) return;
    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    closeTimer.current = window.setTimeout(() => setHovering(false), CLOSE_DELAY_MS);
  };

  useEffect(() => clearTimers, []);

  return (
    <motion.aside
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      animate={{ width: expanded ? DRAWER_WIDTH : RAIL_WIDTH }}
      transition={
        reduceMotion
          ? { duration: 0.1 }
          : { type: 'spring', stiffness: 300, damping: 30 }
      }
      className={[
        'fixed left-0 top-14 bottom-0 z-40',
        'flex flex-col',
        'bg-surface-2 border-r border-border-soft',
        // Drawer overlay shadow only when hover-expanded (not pinned).
        expanded && !pinned ? 'bg-surface shadow-xl' : '',
        pinned ? 'bg-surface' : '',
      ].join(' ')}
      aria-label="Primary"
    >
      {/* Pin toggle, only when drawer is expanded */}
      {expanded && (
        <div className="flex items-center justify-end h-12 px-2 shrink-0">
          <button
            type="button"
            onClick={() => setPinned(!pinned)}
            aria-label={pinned ? 'Unpin sidebar' : 'Pin sidebar'}
            aria-pressed={pinned}
            className="rounded p-1 text-text-muted hover:bg-surface-2 hover:text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-ring"
          >
            <ChevronsRight
              size={16}
              className={`transition-transform ${pinned ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      )}

      {/* Primary section */}
      <nav className="flex flex-col py-2 gap-0.5">
        <SidebarItem icon={Smartphone} label="Devices" to="/" />
        <SidebarItem icon={Hammer} label="Builds" to="/builds" matchPrefix="/builds" />
        <SidebarItem icon={Package} label="Apps" to="/apps" />
        <SidebarItem icon={BarChart3} label="Stats" to="/stats" />
        <SidebarItem icon={Server} label="Servers" to="/servers" matchPrefix="/servers" />
      </nav>

      {/* Admin section (only for admins) */}
      {isAdmin() && (
        <>
          <div className="h-px bg-border-soft mx-2" />
          <nav className="flex flex-col py-2 gap-0.5">
            <SidebarItem icon={Users} label="Users" to="/users" />
            <SidebarItem icon={Building2} label="Teams" to="/teams" />
            <SidebarItem icon={Settings} label="Device admin" to="/devices" />
            <SidebarItem icon={ShieldCheck} label="Admin" to="/admin" />
          </nav>
        </>
      )}

      <div className="flex-1" />

      {/* Bottom utility section */}
      <div className="h-px bg-border-soft mx-2" />
      <div className="flex flex-col py-2 gap-0.5">
        <a
          href="https://github.com/AppiumTestDistribution/appium-device-farm"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
          title={!expanded ? 'GitHub' : undefined}
          className="relative flex items-center h-10 mx-2 rounded-md text-sm text-text-muted hover:bg-surface-2 hover:text-text-strong transition-colors"
        >
          <span className="flex items-center justify-center w-10 shrink-0">
            <Github size={18} strokeWidth={2} />
          </span>
          {expanded && <span className="whitespace-nowrap pr-3 font-medium">GitHub</span>}
        </a>
        <a
          href="#"
          aria-label="Help"
          title={!expanded ? 'Help' : undefined}
          onClick={(e) => e.preventDefault()}
          className="relative flex items-center h-10 mx-2 rounded-md text-sm text-text-muted hover:bg-surface-2 hover:text-text-strong transition-colors"
        >
          <span className="flex items-center justify-center w-10 shrink-0">
            <LifeBuoy size={18} strokeWidth={2} />
          </span>
          {expanded && <span className="whitespace-nowrap pr-3 font-medium">Help</span>}
        </a>
      </div>
    </motion.aside>
  );
}
