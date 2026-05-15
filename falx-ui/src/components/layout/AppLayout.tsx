import React, { type ReactNode } from 'react';
import { SidebarLayoutProvider, useSidebarLayout } from './SidebarLayoutContext';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarLayoutProvider>
      <Shell>{children}</Shell>
    </SidebarLayoutProvider>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const { pinned } = useSidebarLayout();
  return (
    <div className="min-h-screen bg-app-bg text-text">
      <Sidebar />
      <div
        className="flex min-h-screen flex-col transition-[margin-left] duration-200 ease-out"
        style={{ marginLeft: pinned ? 240 : 56 }}
      >
        <TopBar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export default AppLayout;
