import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { useSidebarLayout } from './SidebarLayoutContext';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  /** When provided, treat any path starting with this prefix as active. */
  matchPrefix?: string;
}

export function SidebarItem({ icon: Icon, label, to, matchPrefix }: SidebarItemProps) {
  const { expanded } = useSidebarLayout();

  return (
    <NavLink
      to={to}
      end={!matchPrefix}
      aria-label={label}
      title={!expanded ? label : undefined}
      className={({ isActive }) => {
        const active =
          isActive ||
          (matchPrefix !== undefined && window.location.pathname.startsWith(matchPrefix));
        const base =
          'relative flex items-center h-10 mx-2 rounded-md text-sm transition-colors';
        const state = active
          ? 'bg-brand-soft text-brand'
          : 'text-text-muted hover:bg-surface-2 hover:text-text-strong';
        return `${base} ${state}`;
      }}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              aria-hidden
              className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-brand"
            />
          )}
          <span className="flex items-center justify-center w-10 shrink-0">
            <Icon size={18} strokeWidth={2} />
          </span>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="whitespace-nowrap pr-3 font-medium"
            >
              {label}
            </motion.span>
          )}
        </>
      )}
    </NavLink>
  );
}
