import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose }) => {
  const { user, isGuest, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate('/login');
  };

  const getUserInitials = (name: string | null): string => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute right-0 top-12 w-64 bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] rounded-2xl shadow-xl z-50 overflow-hidden font-sans select-none"
        >
          {/* Header Summary */}
          <div className="p-4 border-b border-slate-100 dark:border-[#222934]/60 bg-slate-50/50 dark:bg-[#0B0F14]/40 flex items-center gap-3">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User Avatar'}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#3B82F6]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] text-white font-bold text-sm flex items-center justify-center shadow-md shrink-0">
                {isGuest ? (
                  <UserCheck className="w-5 h-5 text-[#FACC15]" />
                ) : (
                  getUserInitials(user?.displayName || 'User')
                )}
              </div>
            )}

            <div className="flex flex-col overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900 dark:text-[#F3F4F6] truncate">
                  {user?.displayName || (isGuest ? 'Guest User' : 'Authenticated User')}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-[#9CA3AF] truncate mt-0.5">
                {user?.email || (isGuest ? 'Guest Session' : 'Active Account')}
              </span>
              <div className="mt-1.5">
                {isGuest ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FACC15]/10 text-[#FACC15] border border-[#FACC15]/30">
                    <UserCheck className="w-3 h-3" /> Guest Mode
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
                    <Shield className="w-3 h-3" /> Google Account
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2 space-y-1">
            <button
              onClick={() => handleNavigate('/profile')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#D1D5DB] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1C222C] transition-colors text-left"
            >
              <User className="w-4 h-4 text-[#3B82F6]" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => handleNavigate('/settings')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#D1D5DB] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1C222C] transition-colors text-left"
            >
              <Settings className="w-4 h-4 text-slate-400 dark:text-[#6B7280]" />
              <span>Settings</span>
            </button>
          </div>

          {/* Logout Action Section */}
          <div className="p-2 border-t border-slate-100 dark:border-[#222934]/60">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 text-[#EF4444]" />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
