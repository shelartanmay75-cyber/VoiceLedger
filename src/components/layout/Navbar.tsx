import React, { useState } from 'react';
import {
  Mic,
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  Command,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { ProfileDropdown } from './ProfileDropdown';

export interface NavbarProps {
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
  onToggleTabletSidebar: () => void;
  isTabletCollapsed: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  isMobileSidebarOpen,
}) => {
  const { user, isGuest } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [hasUnreadNotifications] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const getUserInitials = (name: string | null): string => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-white/90 dark:bg-[#0B0F14]/90 backdrop-blur-xl border-b border-slate-200 dark:border-[#222934] px-4 md:px-6 flex items-center justify-between transition-colors duration-200">
      {/* Left Section: Logo & Mobile Toggle */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#9CA3AF] dark:hover:text-[#F3F4F6] dark:hover:bg-[#151A21] rounded-xl transition-colors focus:outline-none"
          aria-label="Toggle navigation menu"
          id="mobile-menu-toggle-btn"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] via-[#3B82F6] to-[#60A5FA] p-0.5 shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
            <div className="w-full h-full bg-white dark:bg-[#0B0F14] rounded-[10px] flex items-center justify-center">
              <Mic className="w-4 h-4 text-[#3B82F6]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-[#F3F4F6] flex items-center gap-1.5 font-sans">
              VoiceLedger
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 uppercase tracking-widest">
                AI
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section: Search Bar Placeholder */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full group">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#6B7280] group-focus-within:text-[#3B82F6] transition-colors" />
          <input
            type="text"
            readOnly
            placeholder="Search expenses, tags, or try asking 'Coffee yesterday'..."
            className="w-full bg-slate-100/80 hover:bg-slate-100 dark:bg-[#151A21]/80 dark:hover:bg-[#151A21] text-xs text-slate-900 dark:text-[#F3F4F6] placeholder-slate-400 dark:placeholder-[#4B5563] pl-10 pr-14 py-2 rounded-xl border border-slate-200 dark:border-[#222934] group-focus-within:border-[#3B82F6]/40 outline-none transition-all cursor-pointer"
            id="navbar-search-placeholder"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-slate-500 dark:text-[#6B7280] bg-slate-200 dark:bg-[#0B0F14] px-1.5 py-0.5 rounded border border-slate-300 dark:border-[#222934]">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Section: Actions & User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Voice Prompt Button */}
        <Button
          variant="secondary"
          size="sm"
          className="hidden sm:flex items-center gap-1.5 border-[#3B82F6]/20 bg-[#3B82F6]/5 text-[#3B82F6] hover:bg-[#3B82F6]/15 hover:border-[#3B82F6]/40"
          id="navbar-voice-action-btn"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span className="text-xs font-semibold">Speak Expense</span>
        </Button>

        {/* Animated Theme Toggle Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2 text-slate-600 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-[#F3F4F6] hover:bg-slate-100 dark:hover:bg-[#151A21] rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-[#222934] transition-all relative overflow-hidden focus:outline-none"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          id="navbar-theme-toggle-btn"
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === 'dark' ? (
              <motion.div
                key="sun"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-4.5 h-4.5 text-[#FACC15]" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ scale: 0, rotate: 90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-4.5 h-4.5 text-slate-700" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Notification Icon Placeholder */}
        <button
          className="p-2 text-slate-600 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-[#F3F4F6] hover:bg-slate-100 dark:hover:bg-[#151A21] rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-[#222934] transition-all relative"
          title="Notifications (Placeholder)"
          id="navbar-notifications-btn"
        >
          <Bell className="w-4 h-4" />
          {hasUnreadNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#3B82F6] ring-4 ring-white dark:ring-[#0B0F14]" />
          )}
        </button>

        {/* Vertical Divider */}
        <div className="w-[1px] h-6 bg-slate-200 dark:bg-[#222934] mx-1" />

        {/* User Profile Section with Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-[#151A21] transition-colors focus:outline-none"
            id="navbar-user-avatar-btn"
          >
            <div className="relative">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User Avatar'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#3B82F6]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] text-white font-bold text-xs flex items-center justify-center shadow-md">
                  {isGuest ? (
                    <UserCheck className="w-4 h-4 text-[#FACC15]" />
                  ) : (
                    getUserInitials(user?.displayName || 'User')
                  )}
                </div>
              )}
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${
                  isGuest ? 'bg-[#FACC15]' : 'bg-[#22C55E]'
                } ring-2 ring-white dark:ring-[#0B0F14]`}
              />
            </div>

            {/* User Name & Badge */}
            <div className="hidden xl:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900 dark:text-[#F3F4F6] leading-none">
                  {user?.displayName || (isGuest ? 'Guest User' : 'Authenticated User')}
                </span>
                {isGuest && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#FACC15]/10 text-[#FACC15] border border-[#FACC15]/30">
                    Guest
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 dark:text-[#6B7280] leading-tight mt-0.5 truncate max-w-[120px]">
                {user?.email || (isGuest ? 'Guest Session' : 'Active')}
              </span>
            </div>
          </button>

          {/* Profile Dropdown Component */}
          <ProfileDropdown
            isOpen={isProfileDropdownOpen}
            onClose={() => setIsProfileDropdownOpen(false)}
          />
        </div>
      </div>
    </header>
  );
};
