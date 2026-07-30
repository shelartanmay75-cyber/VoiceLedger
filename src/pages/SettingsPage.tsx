import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../context/DataContext';
import { MonthlyBudgetSetupModal } from '../components/modals/MonthlyBudgetSetupModal';
import {
  Mic,
  Wallet,
  IndianRupee,
  RotateCcw,
  AlertTriangle,
  ChevronRight,
  Save,
  CheckCircle2,
  Trash2,
  X,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, isGuest } = useAuth();
  const { profile, updateProfile, resetAllLedgerData } = useData();
  const navigate = useNavigate();

  // Settings state
  const [monthlyBudget, setMonthlyBudget] = useState(profile.monthlyBudget?.toString() || '0');
  const [voiceEngine, setVoiceEngine] = useState('Google Speech API (en-IN)');
  const [currency, setCurrency] = useState('INR (₹)');
  const [notifications, setNotifications] = useState(true);
  const [autoSaveVoice, setAutoSaveVoice] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Reset modal state
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  React.useEffect(() => {
    setMonthlyBudget(profile.monthlyBudget?.toString() || '0');
  }, [profile.monthlyBudget]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ monthlyBudget: parseFloat(monthlyBudget) || 0 });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleConfirmResetAll = async () => {
    await resetAllLedgerData();
    setIsResetConfirmOpen(false);
    setIsBudgetModalOpen(true);
  };

  return (
    <PageContainer
      title="Application & Profile Settings"
      subtitle="Manage profile identity, monthly budget preferences, voice recognition engine, and system preferences"
      badge="Preferences"
    >
      <div className="space-y-6">
        {/* ------------------------------------------------------------- */}
        {/* 1. PROFILE CONNECTIVITY CARD                                  */}
        {/* ------------------------------------------------------------- */}
        <Card accentBorder hoverable>
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] text-white font-extrabold text-xl flex items-center justify-center shadow-lg shrink-0">
                {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'VL'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                    {user?.displayName || (isGuest ? 'Guest User' : 'VoiceLedger User')}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
                    Connected
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">
                  {user?.email || (isGuest ? 'Guest Mode (No email)' : 'Google Account')}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/profile')}
              rightIcon={<ChevronRight className="w-4 h-4" />}
              className="shrink-0 font-bold"
              id="settings-go-to-profile-btn"
            >
              View Full Profile
            </Button>
          </div>
        </Card>

        {/* ------------------------------------------------------------- */}
        {/* 2. SETTINGS GRID: BUDGET & VOICE ENGINE                       */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget & Currency Preferences */}
          <Card hoverable>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#3B82F6]" />
                Budget & Currency Setup
              </CardTitle>
              <CardDescription>Configure target limits and default currency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <Input
                  label="Monthly Target Budget (₹)"
                  type="number"
                  placeholder="40000"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  leftIcon={<IndianRupee className="w-4 h-4" />}
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-[#9CA3AF]">
                    Default Currency Format
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-[#F3F4F6] text-xs font-semibold rounded-xl border border-slate-200 dark:border-[#222934] px-4 py-2.5 outline-none focus:border-[#3B82F6]/50 focus:ring-2 focus:ring-[#3B82F6]/30 transition-all cursor-pointer"
                  >
                    <option value="INR (₹)" className="bg-white dark:bg-[#151A21]">Indian Rupee (INR ₹)</option>
                    <option value="USD ($)" className="bg-white dark:bg-[#151A21]">US Dollar (USD $)</option>
                    <option value="EUR (€)" className="bg-white dark:bg-[#151A21]">Euro (EUR €)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    fullWidth
                    leftIcon={saveSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  >
                    {saveSuccess ? 'Settings Saved!' : 'Save Budget Preferences'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Voice Recognition & System Controls */}
          <Card hoverable>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#3B82F6]" />
                Voice Engine & Automation
              </CardTitle>
              <CardDescription>AI transcript processing and notification controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-[#9CA3AF]">
                  Speech-to-Text Language Engine
                </label>
                <select
                  value={voiceEngine}
                  onChange={(e) => setVoiceEngine(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-[#F3F4F6] text-xs font-semibold rounded-xl border border-slate-200 dark:border-[#222934] px-4 py-2.5 outline-none focus:border-[#3B82F6]/50 focus:ring-2 focus:ring-[#3B82F6]/30 transition-all cursor-pointer"
                >
                  <option value="Google Speech API (en-IN)" className="bg-white dark:bg-[#151A21]">English (India - en-IN)</option>
                  <option value="Google Speech API (hi-IN)" className="bg-white dark:bg-[#151A21]">Hindi (India - hi-IN)</option>
                  <option value="Google Speech API (en-US)" className="bg-white dark:bg-[#151A21]">English (US - en-US)</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#222934]">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6] block">
                      Auto-Save AI Voice Expenses
                    </span>
                    <span className="text-[10px] text-slate-400">Automatically add high-confidence voice entries</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSaveVoice}
                    onChange={(e) => setAutoSaveVoice(e.target.checked)}
                    className="w-4 h-4 accent-[#3B82F6] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#222934]">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6] block">
                      Over-Budget Alert Notifications
                    </span>
                    <span className="text-[10px] text-slate-400">Receive alerts when exceeding 80% monthly budget</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="w-4 h-4 accent-[#3B82F6] cursor-pointer"
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3. DANGER ZONE: DELETE ALL MY LEDGER & RESTART NEW            */}
        {/* ------------------------------------------------------------- */}
        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-5 h-5" />
              <CardTitle className="text-red-500">Danger Zone & Ledger Reset</CardTitle>
            </div>
            <CardDescription>
              Wipe all recorded expenses, goals, trips, subscriptions, and split balances to start fresh all over again.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#151A21] border border-red-200 dark:border-red-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                  Delete All Ledger Data & Start Fresh
                </h4>
                <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">
                  This will permanently clear all your expenses, goals, trips, and split debts so you can configure a brand new monthly budget.
                </p>
              </div>

              <Button
                variant="danger"
                size="md"
                onClick={() => setIsResetConfirmOpen(true)}
                leftIcon={<RotateCcw className="w-4 h-4" />}
                className="shrink-0 font-bold bg-[#EF4444] hover:bg-[#DC2626] shadow-lg shadow-[#EF4444]/20"
                id="settings-delete-all-ledger-restart-btn"
              >
                Delete All My Ledger & Restart New
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CONFIRM RESET ALL MODAL */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsResetConfirmOpen(false)} className="fixed inset-0 bg-slate-900/70 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-white dark:bg-[#151A21] border border-red-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#222934]">
                <div className="flex items-center gap-2 text-red-500 font-extrabold text-lg">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Delete All Ledger & Restart?</span>
                </div>
                <button onClick={() => setIsResetConfirmOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-[#9CA3AF] leading-relaxed">
                  Are you sure you want to delete <strong className="text-slate-900 dark:text-white">ALL</strong> your recorded expenses, savings goals, trips, subscriptions, split balances, and monthly budget?
                </p>
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-semibold flex items-center gap-2">
                  <Trash2 className="w-4 h-4 shrink-0" />
                  <span>This action is permanent and cannot be undone. You will immediately be prompted to set up a new monthly budget.</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" size="md" onClick={() => setIsResetConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="md"
                  onClick={handleConfirmResetAll}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                  className="bg-[#EF4444] hover:bg-[#DC2626] text-white border-none font-bold"
                >
                  Yes, Delete Everything & Restart
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MONTHLY BUDGET SETUP MODAL (FOR FRESH RESTART) */}
      <MonthlyBudgetSetupModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />
    </PageContainer>
  );
};
