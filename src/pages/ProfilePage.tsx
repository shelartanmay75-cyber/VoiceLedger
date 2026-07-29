import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../context/DataContext';
import {
  UserCheck,
  Shield,
  Mail,
  Calendar,
  LogOut,
  Sparkles,
  CheckCircle2,
  IndianRupee,
  Save,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, isGuest, logout } = useAuth();
  const { profile, updateProfile } = useData();
  const navigate = useNavigate();

  const [monthlyBudget, setMonthlyBudget] = useState(profile.monthlyBudget?.toString() || '0');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    setMonthlyBudget(profile.monthlyBudget?.toString() || '0');
  }, [profile.monthlyBudget]);

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    updateProfile({ monthlyBudget: parseFloat(monthlyBudget) || 0 });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    setIsSaving(false);
  };

  const handleLogout = async () => {
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
    <PageContainer
      title="User Profile"
      subtitle="Manage your personal account details, session status, and security settings"
      badge="Account Summary"
    >
      <div className="space-y-6">
        {/* Profile Overview Card */}
        <Card accentBorder>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-2 sm:p-4">
            {/* Profile Photo / Avatar */}
            <div className="relative">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User Profile'}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-[#3B82F6] shadow-xl"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] text-white font-extrabold text-2xl flex items-center justify-center shadow-xl">
                  {isGuest ? (
                    <UserCheck className="w-10 h-10 text-[#FACC15]" />
                  ) : (
                    getUserInitials(user?.displayName || 'User')
                  )}
                </div>
              )}
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#22C55E] ring-4 ring-white dark:ring-[#151A21]"
                title="Online Status: Active"
              />
            </div>

            {/* Profile Name & Status Info */}
            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F3F4F6]">
                  {user?.displayName || (isGuest ? 'Guest User' : 'Authenticated User')}
                </h2>
                <div className="inline-flex justify-center sm:justify-start">
                  {isGuest ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FACC15]/10 text-[#FACC15] border border-[#FACC15]/30 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5" /> Guest Mode
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Google Account
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9CA3AF] flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-4 h-4 text-slate-400 dark:text-[#6B7280]" />
                {user?.email || (isGuest ? 'Guest Session (No email attached)' : 'No email address')}
              </p>

              <div className="pt-2 flex items-center justify-center sm:justify-start gap-2 text-xs font-medium text-[#22C55E]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Session Active & Authenticated</span>
              </div>
            </div>

            {/* Logout CTA Button */}
            <div className="sm:self-center shrink-0 w-full sm:w-auto pt-2 sm:pt-0">
              <Button
                variant="danger"
                size="md"
                fullWidth
                onClick={handleLogout}
                leftIcon={<LogOut className="w-4 h-4" />}
                id="profile-logout-btn"
              >
                Log Out
              </Button>
            </div>
          </div>
        </Card>

        {/* Detailed Account Information Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Details Card */}
          <Card hoverable>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Verified profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#222934]/60">
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">User ID (UID)</span>
                <span className="text-xs font-mono font-semibold text-slate-800 dark:text-[#F3F4F6] truncate max-w-[180px]">
                  {user?.uid || 'guest_user_demo'}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#222934]/60">
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Full Name</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-[#F3F4F6]">
                  {user?.displayName || (isGuest ? 'Guest User' : 'N/A')}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#222934]/60">
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Email Address</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-[#F3F4F6]">
                  {user?.email || (isGuest ? 'Guest Session' : 'N/A')}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#222934]/60">
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Account Type</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-[#F3F4F6]">
                  {isGuest ? 'Guest Mode (No Auth Required)' : 'Google OAuth 2.0 Provider'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Member Since</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-[#F3F4F6] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" /> July 2026
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Budget Settings & Session Security Card */}
          <Card hoverable>
            <CardHeader>
              <CardTitle>Budget Settings</CardTitle>
              <CardDescription>Configure monthly spending limits & preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSaveBudget} className="space-y-3">
                <Input
                  label="Monthly Target Budget (₹)"
                  type="number"
                  placeholder="40000"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  leftIcon={<IndianRupee className="w-4 h-4" />}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  fullWidth
                  disabled={isSaving}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  {isSaving ? 'Saving...' : saveSuccess ? 'Saved Successfully!' : 'Save Monthly Budget'}
                </Button>
              </form>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F14]/50 border border-slate-200/80 dark:border-[#222934]/60 space-y-2 mt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-[#F3F4F6]">
                  <Sparkles className="w-4 h-4 text-[#3B82F6]" />
                  <span>Voice Ledger Privacy Mode</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-[#9CA3AF] leading-relaxed">
                  Your voice interactions and personal expense logs remain protected. {isGuest ? 'You are using a transient guest session.' : 'Your session is secured via Firebase Authentication.'}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={handleLogout}
                  leftIcon={<LogOut className="w-4 h-4 text-[#EF4444]" />}
                >
                  Log Out of Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
