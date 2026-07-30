import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Sparkles,
  TrendingDown,
  CreditCard,
  Receipt,
  Target,
  Coffee,
  Fuel,
  Tv,
  ShoppingCart,
  Car,
  Calendar,
  Wallet,
  Inbox,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../context/DataContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AddExpenseModal } from '../components/expenses/AddExpenseModal';
import { VoiceRecorder } from '../components/voice/VoiceRecorder';
import { MonthlyBudgetSetupModal } from '../components/modals/MonthlyBudgetSetupModal';
import { formatExpenseDisplayDate, toISODateString } from '../utils/dateUtils';

export const DashboardPage: React.FC = () => {
  const { user, isGuest } = useAuth();
  const { expenses, goals, profile, isLoading } = useData();
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const isGuestBudgetConfigured = isGuest && (
    profile.hasConfiguredBudget ||
    profile.monthlyBudget > 0 ||
    localStorage.getItem('voiceledger_configured_guest_user_demo') === 'true' ||
    sessionStorage.getItem('voiceledger_guest_budget_configured') === 'true'
  );

  const isUserBudgetConfigured = Boolean(
    profile.hasConfiguredBudget ||
    profile.monthlyBudget > 0 ||
    (user?.uid && localStorage.getItem(`voiceledger_configured_${user.uid}`) === 'true')
  );

  const isBudgetAlreadyConfigured = isGuest ? isGuestBudgetConfigured : isUserBudgetConfigured;

  // Auto-prompt budget setup modal for new unconfigured users on initial load
  useEffect(() => {
    if (!isLoading && Boolean(user || isGuest) && !isBudgetAlreadyConfigured) {
      setIsBudgetModalOpen(true);
    }
  }, [isLoading, user, isGuest, isBudgetAlreadyConfigured]);

  // Dynamic spending calculations from real user expenses
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const monthlyBudget = profile.monthlyBudget || 0;
  const remainingBudget = Math.max(0, monthlyBudget - totalSpent);
  const percentageUsed = monthlyBudget > 0 ? Math.min(100, Math.round((totalSpent / monthlyBudget) * 100)) : 0;
  const recentTransactions = expenses.slice(0, 5);

  // Today's spending calculation
  const todayIso = toISODateString('today');
  const todaySpent = expenses
    .filter((e) => (e.isoDate ? toISODateString(e.isoDate) === todayIso : formatExpenseDisplayDate(e.isoDate, e.date) === 'Today'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Quick stats derived dynamically
  const dynamicQuickStats = [
    {
      id: 'stat-1',
      title: "Today's Spending",
      value: `₹${todaySpent.toLocaleString('en-IN')}`,
      change: todaySpent > 0 ? 'Today active' : 'Clean Slate',
      isPositive: true,
      iconName: 'CreditCard',
    },
    {
      id: 'stat-2',
      title: 'Total Spending',
      value: `₹${totalSpent.toLocaleString('en-IN')}`,
      change: `${percentageUsed}% of budget`,
      isPositive: percentageUsed < 80,
      iconName: 'TrendingDown',
    },
    {
      id: 'stat-3',
      title: 'Total Transactions',
      value: `${expenses.length} items`,
      change: expenses.length > 0 ? `${expenses.length} logged` : '0 entries',
      isPositive: true,
      iconName: 'Receipt',
    },
    {
      id: 'stat-4',
      title: 'Savings Goals',
      value: goals.length > 0
        ? `₹${goals.reduce((acc, g) => acc + g.currentAmount, 0).toLocaleString('en-IN')} / ₹${goals.reduce((acc, g) => acc + g.targetAmount, 0).toLocaleString('en-IN')}`
        : '₹0 / ₹0',
      change: goals.length > 0
        ? `${Math.round((goals.reduce((acc, g) => acc + g.currentAmount, 0) / Math.max(1, goals.reduce((acc, g) => acc + g.targetAmount, 0))) * 100)}% saved`
        : 'Clean Slate',
      isPositive: true,
      iconName: 'Target',
    },
  ];

  // AI insights derived dynamically
  const dynamicAIInsights = expenses.length > 0 ? [
    {
      id: 'insight-1',
      title: 'Voice Ledger Synchronized',
      description: `You have successfully recorded ${expenses.length} transaction(s) totaling ₹${totalSpent.toLocaleString('en-IN')}.`,
      type: 'success' as const,
      category: 'Overview',
    },
    {
      id: 'insight-2',
      title: 'Budget Health Indicator',
      description: `You have used ${percentageUsed}% of your ₹${monthlyBudget.toLocaleString('en-IN')} monthly budget limit.`,
      type: percentageUsed > 80 ? ('warning' as const) : ('info' as const),
      category: 'Budgeting',
    },
  ] : [
    {
      id: 'insight-welcome',
      title: 'AI Engine Ready',
      description: 'Your voice ledger is ready! Click the microphone above and speak your expense to start building your ledger.',
      type: 'info' as const,
      category: 'Voice Assistant',
    },
  ];

  // Determine time-aware greeting
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Format current date
  const currentDateFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getUserFirstName = (): string => {
    if (isGuest) return 'Guest';
    if (!user?.displayName) return 'User';
    return user.displayName.trim().split(' ')[0];
  };

  // Icon mapping helper for recent transactions
  const getTxIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className="w-4 h-4 text-[#F97316]" />;
      case 'Fuel':
        return <Fuel className="w-4 h-4 text-[#3B82F6]" />;
      case 'Tv':
        return <Tv className="w-4 h-4 text-[#8B5CF6]" />;
      case 'ShoppingCart':
        return <ShoppingCart className="w-4 h-4 text-[#22C55E]" />;
      case 'Car':
        return <Car className="w-4 h-4 text-[#06B6D4]" />;
      default:
        return <Receipt className="w-4 h-4 text-slate-400" />;
    }
  };

  // Icon mapping helper for quick stats
  const getStatIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-[#3B82F6]" />;
      case 'TrendingDown':
        return <TrendingDown className="w-5 h-5 text-[#22C55E]" />;
      case 'Receipt':
        return <Receipt className="w-5 h-5 text-[#8B5CF6]" />;
      case 'Target':
        return <Target className="w-5 h-5 text-[#F59E0B]" />;
      default:
        return <Wallet className="w-5 h-5 text-[#3B82F6]" />;
    }
  };

  return (
    <PageContainer
      title={`${getGreeting()}, ${getUserFirstName()}`}
      subtitle="Here is your financial overview and voice expense tracker dashboard."
      badge="Voice Ledger AI"
      actionSlot={
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsBudgetModalOpen(true)}
            leftIcon={<Wallet className="w-4 h-4 text-[#3B82F6]" />}
            id="dashboard-edit-budget-btn"
          >
            {profile.monthlyBudget > 0 ? 'Edit Monthly Budget' : 'Add Monthly Budget'}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsAddExpenseModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            id="dashboard-new-record-btn"
          >
            New Record
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* ------------------------------------------------------------- */}
        {/* 1. GREETING & DATE BANNER SUB-HEADER                          */}
        {/* ------------------------------------------------------------- */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] shadow-sm">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-[#9CA3AF]">
            <Calendar className="w-4 h-4 text-[#3B82F6]" />
            <span>{currentDateFormatted}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#3B82F6] bg-[#3B82F6]/10 px-3 py-1 rounded-full border border-[#3B82F6]/30">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
            <span>Voice Engine Active</span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. MAIN KEY FEATURE: VOICE RECORDING HERO BOX (FULL WIDTH)   */}
        {/* ------------------------------------------------------------- */}
        <Card accentBorder id="dashboard-voice-recorder" className="w-full relative overflow-hidden p-6 sm:p-8">
          {/* Background Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#2563EB]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Primary Feature • AI Voice Ledger Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F3F4F6] tracking-tight">
                Record your expenses with voice
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9CA3AF] leading-relaxed">
                Simply tap the microphone and speak naturally (e.g. <span className="font-semibold text-slate-800 dark:text-[#F3F4F6]">"Spent ₹250 on coffee at Starbucks"</span>). Our Gemini AI extracts structured expense data automatically.
              </p>
            </div>

            {/* AI-Powered Voice Recorder */}
            <VoiceRecorder />
          </div>
        </Card>

        {/* ------------------------------------------------------------- */}
        {/* 3. MONTHLY SPENDING CARD (POSITIONED DIRECTLY BELOW HERO BOX) */}
        {/* ------------------------------------------------------------- */}
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#3B82F6]" />
                Monthly Spending Summary
              </CardTitle>
              <span className="text-xs font-bold text-[#3B82F6] bg-[#3B82F6]/10 px-2.5 py-0.5 rounded-full border border-[#3B82F6]/30">
                July 2026
              </span>
            </div>
            <CardDescription>Overall budget allocation & remaining balance</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Spending & Budget Figures */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#0B0F14]/60 border border-slate-200/80 dark:border-[#222934]/60">
              <div>
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Total Spent</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6] mt-0.5">
                  ₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Monthly Budget</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6] mt-0.5">
                  ₹{monthlyBudget.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Remaining Budget</span>
                <p className="text-2xl font-extrabold text-[#22C55E] mt-0.5">
                  ₹{remainingBudget.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Budget Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-[#D1D5DB]">
                  Budget Allocation Progress
                </span>
                <span className="font-bold text-[#3B82F6]">
                  {percentageUsed}% used
                </span>
              </div>

              <div className="w-full h-3.5 bg-slate-200 dark:bg-[#222934] rounded-full overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentageUsed}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500 dark:text-[#9CA3AF]">
                  Safe Daily Spend Allowance: ₹{Math.round(remainingBudget / 30)} / day
                </span>
                <span className="font-bold text-[#22C55E]">
                  ₹{remainingBudget.toLocaleString('en-IN', { minimumFractionDigits: 2 })} left
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ------------------------------------------------------------- */}
        {/* 4. QUICK STATS CARDS (4 COLS GRID)                            */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dynamicQuickStats.map((stat) => (
            <Card key={stat.id} hoverable className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500 dark:text-[#9CA3AF]">
                  {stat.title}
                </span>
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#222934]">
                  {getStatIcon(stat.iconName)}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                  {stat.value}
                </p>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 dark:text-[#6B7280]">Current Ledger</span>
                  <span className="font-bold text-[#22C55E]">
                    {stat.change}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 5. AI INSIGHTS & RECENT TRANSACTIONS GRID                     */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* AI Financial Insights */}
          <Card className="lg:col-span-5 flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#3B82F6]" />
                  AI Financial Insights
                </CardTitle>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
                  Real-time
                </span>
              </div>
              <CardDescription>Automated pattern detection & budget advice</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {dynamicAIInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F14]/60 border border-slate-200/80 dark:border-[#222934]/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6]">
                      {insight.title}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-[#6B7280]">
                      {insight.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-[#9CA3AF] leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Transactions List */}
          <Card className="lg:col-span-7 flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#3B82F6]" />
                  Recent Transactions
                </CardTitle>
                <span className="text-xs font-semibold text-slate-500">
                  {recentTransactions.length} items
                </span>
              </div>
              <CardDescription>Your latest voice and manual expense records</CardDescription>
            </CardHeader>

            <CardContent>
              {recentTransactions.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center text-center text-slate-400">
                  <Inbox className="w-8 h-8 mb-2 opacity-40 text-[#3B82F6]" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Clean Slate — No Transactions Recorded</p>
                  <p className="text-[11px] text-slate-400 max-w-xs mt-0.5">Use the microphone above to record your first expense!</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F14]/60 border border-slate-200/80 dark:border-[#222934]/60 flex items-center justify-between hover:border-[#3B82F6]/30 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] shrink-0">
                          {getTxIcon(tx.iconName || 'Receipt')}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6]">
                            {tx.title}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400 dark:text-[#6B7280]">
                              {tx.category}
                            </span>
                            <span className="text-[9px] text-slate-500">
                              • {formatExpenseDisplayDate(tx.isoDate, tx.date)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                          -₹{tx.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Manual Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
      />

      {/* Monthly Budget Setup & Edit Modal */}
      <MonthlyBudgetSetupModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />
    </PageContainer>
  );
};
