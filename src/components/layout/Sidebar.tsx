import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Target,
  Plane,
  Users,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Mic,
  X,
  Sparkles,
} from 'lucide-react';
import type { NavItem } from '../../types/navigation';

export interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isTabletCollapsed: boolean;
  onToggleTabletCollapse: () => void;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Expenses', path: '/expenses', icon: Receipt, badge: '12' },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Goals', path: '/goals', icon: Target },
  { name: 'Trips', path: '/trips', icon: Plane, badge: 'New' },
  { name: 'Shared Expenses', path: '/shared-expenses', icon: Users },
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'Profile', path: '/profile', icon: User },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  onCloseMobile,
  isTabletCollapsed,
  onToggleTabletCollapse,
}) => {
  const location = useLocation();

  const renderNavLinks = (collapsed: boolean = false) => (
    <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => onCloseMobile()}
            className={`group relative flex items-center ${
              collapsed ? 'justify-center px-0' : 'justify-between px-3.5'
            } py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              isActive
                ? 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 shadow-[0_0_15px_rgba(59,130,246,0.15)] font-semibold'
                : 'text-slate-600 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-[#F3F4F6] hover:bg-slate-200/60 dark:hover:bg-[#151A21] border border-transparent'
            }`}
            title={collapsed ? item.name : undefined}
          >
            <div className="flex items-center gap-3">
              <Icon
                className={`w-5 h-5 shrink-0 transition-all duration-200 ${
                  isActive
                    ? 'text-[#3B82F6] scale-110'
                    : 'text-slate-400 dark:text-[#6B7280] group-hover:text-slate-900 dark:group-hover:text-[#F3F4F6] group-hover:scale-105'
                }`}
              />
              {!collapsed && <span>{item.name}</span>}
            </div>

            {!collapsed && item.badge && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-[#3B82F6] text-white'
                    : 'bg-slate-200 text-slate-600 dark:bg-[#222934] dark:text-[#9CA3AF] group-hover:bg-slate-300 dark:group-hover:bg-[#2C3544]'
                }`}
              >
                {item.badge}
              </span>
            )}

            {collapsed && item.badge && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#3B82F6]" />
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Permanent / Collapsible Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-slate-50 dark:bg-[#0B0F14] border-r border-slate-200 dark:border-[#222934] h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300 z-20 select-none ${
          isTabletCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div
          className={`px-4 py-3 border-b border-slate-200/80 dark:border-[#222934]/60 flex items-center ${
            isTabletCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {!isTabletCollapsed && (
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#6B7280]">
              Navigation
            </span>
          )}
          <button
            onClick={onToggleTabletCollapse}
            className="p-1.5 text-slate-500 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-[#F3F4F6] hover:bg-slate-200 dark:hover:bg-[#151A21] rounded-lg border border-slate-200 dark:border-[#222934] transition-colors"
            title={isTabletCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            id="tablet-sidebar-collapse-btn"
          >
            {isTabletCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        {renderNavLinks(isTabletCollapsed)}

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-[#222934]">
          {!isTabletCollapsed ? (
            <div className="bg-white dark:bg-gradient-to-b dark:from-[#151A21] dark:to-[#0D1117] p-3.5 rounded-2xl border border-slate-200 dark:border-[#222934] shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#3B82F6]/5 rounded-full blur-2xl group-hover:bg-[#3B82F6]/10 transition-all" />
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">
                  <Mic className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6]">Voice Engine</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#9CA3AF] leading-tight mb-2.5">
                Record expenses naturally in over 30 languages.
              </p>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-[#3B82F6]">
                <Sparkles className="w-3 h-3" />
                <span>Ready to listen</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center p-2">
              <div
                className="p-2 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20"
                title="Voice Engine Active"
              >
                <Mic className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-slate-900/40 dark:bg-[#0B0F14]/80 backdrop-blur-md z-40 md:hidden"
            />

            {/* Mobile Drawer Panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-slate-50 dark:bg-[#0B0F14] border-r border-slate-200 dark:border-[#222934] z-50 flex flex-col md:hidden shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="h-16 px-4 border-b border-slate-200 dark:border-[#222934] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#3B82F6] p-0.5 flex items-center justify-center">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-base text-slate-900 dark:text-[#F3F4F6]">
                    VoiceLedger
                  </span>
                </div>
                <button
                  onClick={onCloseMobile}
                  className="p-2 text-slate-500 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-[#F3F4F6] hover:bg-slate-200 dark:hover:bg-[#151A21] rounded-xl transition-colors"
                  aria-label="Close mobile menu"
                  id="mobile-drawer-close-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation links */}
              {renderNavLinks(false)}

              {/* Mobile Drawer Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-[#222934] bg-slate-100/50 dark:bg-[#151A21]/50">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#9CA3AF]">
                  <span>VoiceLedger v1.0.0</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#3B82F6]/10 text-[#3B82F6] font-semibold text-[10px]">
                    UI Foundation
                  </span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
