import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Target,
  Plane,
  Users,
  Settings,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Mic,
  X,
  Shield,
  ChevronUp,
} from 'lucide-react';
import type { NavItem } from '../../types/navigation';
import { useAuth } from '../../hooks/useAuth';

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
];

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  onCloseMobile,
  isTabletCollapsed,
  onToggleTabletCollapse,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();

  const getUserInitials = (name: string | null): string => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

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

  const renderUserProfileCard = (collapsed: boolean = false) => {
    if (collapsed) {
      return (
        <div
          onClick={() => navigate('/profile')}
          className="flex justify-center p-2 cursor-pointer group"
          title={`${user?.displayName || 'User Profile'} (${isGuest ? 'Guest Mode' : 'Google Account'})`}
        >
          <div className="relative">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#3B82F6] group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] text-white font-bold text-xs flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                {isGuest ? (
                  <UserCheck className="w-5 h-5 text-[#FACC15]" />
                ) : (
                  getUserInitials(user?.displayName || 'User')
                )}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#22C55E] ring-2 ring-white dark:ring-[#0B0F14]" />
          </div>
        </div>
      );
    }

    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => {
          onCloseMobile();
          navigate('/profile');
        }}
        className="bg-white dark:bg-[#151A21] p-3 rounded-2xl border border-slate-200 dark:border-[#222934] shadow-sm hover:border-[#3B82F6]/40 cursor-pointer transition-all duration-200 group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Avatar with Online Status Dot */}
            <div className="relative shrink-0">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#3B82F6]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] text-white font-bold text-xs flex items-center justify-center shadow-md">
                  {isGuest ? (
                    <UserCheck className="w-5 h-5 text-[#FACC15]" />
                  ) : (
                    getUserInitials(user?.displayName || 'User')
                  )}
                </div>
              )}
              {/* Online Status Green Indicator */}
              <span
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#22C55E] ring-2 ring-white dark:ring-[#0B0F14]"
                title="Online Status: Active"
              />
            </div>

            {/* Name, Email, and Account Type Badge */}
            <div className="flex flex-col overflow-hidden text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6] truncate group-hover:text-[#3B82F6] transition-colors">
                {user?.displayName || (isGuest ? 'Guest User' : 'Authenticated User')}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-[#9CA3AF] truncate mt-0.5">
                {user?.email || (isGuest ? 'Guest Session' : 'Active Account')}
              </span>
              <div className="mt-1 flex items-center gap-1">
                {isGuest ? (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#FACC15]/10 text-[#FACC15] border border-[#FACC15]/30 flex items-center gap-1">
                    <UserCheck className="w-2.5 h-2.5" /> Guest
                  </span>
                ) : (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5" /> Google
                  </span>
                )}
                <span className="text-[9px] text-[#22C55E] font-semibold">● Online</span>
              </div>
            </div>
          </div>

          <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-[#3B82F6] transition-colors shrink-0" />
        </div>
      </motion.div>
    );
  };

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

        {/* Sidebar Bottom: User Profile Card */}
        <div className="p-3 border-t border-slate-200 dark:border-[#222934]">
          {renderUserProfileCard(isTabletCollapsed)}
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

              {/* Mobile Drawer Footer: User Profile Card */}
              <div className="p-3 border-t border-slate-200 dark:border-[#222934] bg-slate-100/50 dark:bg-[#151A21]/50">
                {renderUserProfileCard(false)}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
