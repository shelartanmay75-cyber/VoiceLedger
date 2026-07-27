import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';

export const AppLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isTabletCollapsed, setIsTabletCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#3B82F6]/30 selection:text-[#3B82F6]">
      {/* Top Navigation Bar */}
      <Navbar
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isTabletCollapsed={isTabletCollapsed}
        onToggleTabletSidebar={() => setIsTabletCollapsed(!isTabletCollapsed)}
      />

      {/* Body Area with Sidebar and Main Content */}
      <div className="flex flex-1 relative">
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isTabletCollapsed={isTabletCollapsed}
          onToggleTabletCollapse={() => setIsTabletCollapsed(!isTabletCollapsed)}
        />

        <MainContent>
          <Outlet />
        </MainContent>
      </div>
    </div>
  );
};
