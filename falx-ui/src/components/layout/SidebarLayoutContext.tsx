import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { usePinned } from './usePinned';

interface SidebarLayoutValue {
  pinned: boolean;
  setPinned: (next: boolean) => void;
  hovering: boolean;
  setHovering: (next: boolean) => void;
  /** True when the drawer is visible (pinned or hovering). */
  expanded: boolean;
}

const SidebarLayoutContext = createContext<SidebarLayoutValue | undefined>(undefined);

export function SidebarLayoutProvider({ children }: { children: ReactNode }) {
  const [pinned, setPinned] = usePinned();
  const [hovering, setHovering] = useState(false);
  const value = useMemo<SidebarLayoutValue>(
    () => ({
      pinned,
      setPinned,
      hovering,
      setHovering,
      expanded: pinned || hovering,
    }),
    [pinned, setPinned, hovering],
  );
  return <SidebarLayoutContext.Provider value={value}>{children}</SidebarLayoutContext.Provider>;
}

export function useSidebarLayout(): SidebarLayoutValue {
  const ctx = useContext(SidebarLayoutContext);
  if (!ctx) throw new Error('useSidebarLayout must be used inside <SidebarLayoutProvider>');
  return ctx;
}
