import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
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
  AlertTriangle,
  CheckCircle2,
  Info,
  Calendar,
  Wallet,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../context/DataContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AddExpenseModal } from '../components/expenses/AddExpenseModal';
import {
  mockQuickStats,
  mockAIInsights,
} from '../data/mockDashboardData';

export const DashboardPage: React.FC = () => {
  const { user, isGuest } = useAuth();
  const { expenses, profile } = useData();
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  // Dynamic spending calculation
  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const monthlyBudget = profile.monthlyBudget || 40000;
  const remainingBudget = Math.max(0, monthlyBudget - totalSpent);
  const percentageUsed = Math.min(100, Math.round((totalSpent / monthlyBudget) * 100));
  const recentTransactions = expenses.slice(0, 5);

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
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddExpenseModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          id="dashboard-new-record-btn"
        >
          New Record
        </Button>
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
        <Card accentBorder className="w-full relative overflow-hidden p-6 sm:p-8">
          {/* Background Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#2563EB]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Content: Title, Badge, Description */}
            <div className="space-y-3 text-center md:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Primary Feature • AI Voice Ledger Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F3F4F6] tracking-tight">
                Record your expenses with voice
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9CA3AF] leading-relaxed">
                Simply tap the microphone and speak naturally. For example: <br className="hidden sm:inline" />
                <span className="font-semibold text-slate-800 dark:text-[#F3F4F6]">
                  "Spent ₹250 on coffee at Starbucks"
                </span>{' '}
                or{' '}
                <span className="font-semibold text-slate-800 dark:text-[#F3F4F6]">
                  "Paid ₹1,850 for petrol"
                </span>
                . Our AI categorizes it automatically.
              </p>
            </div>

            {/* Right Content: Large Animated Mic Button & Actions */}
            <div className="flex flex-col items-center gap-4 shrink-0">
              <div className="relative py-2">
                {/* Outer Pulsing Aura Rings */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full bg-[#3B82F6]/20 blur-md"
                />
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.2 }}
                  className="absolute inset-0 rounded-full bg-[#3B82F6]/30"
                />

                {/* Main Mic Button */}
                <button
                  id="dashboard-hero-mic-btn"
                  className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#2563EB] via-[#3B82F6] to-[#60A5FA] p-1 shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group"
                >
                  <div className="w-full h-full bg-[#0B0F14] rounded-full flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                    <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-[#3B82F6] group-hover:scale-110 transition-transform" />
                  </div>
                </button>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F3F4F6]">
                  Tap to record an expense
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddExpenseModalOpen(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  id="dashboard-manual-add-btn"
                >
                  Add Manually
                </Button>
              </div>
            </div>
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
          {mockQuickStats.map((stat) => (
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
                <p
                  className={`text-[11px] font-semibold ${
                    stat.isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'
                  }`}
                >
                  {stat.change}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 5. AI INSIGHTS & RECENT TRANSACTIONS PREVIEW GRID              */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* AI Insights Section (5 cols) */}
          <Card className="lg:col-span-5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#3B82F6]" />
                  AI Insights
                </CardTitle>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#0B0F14] text-slate-500 dark:text-[#9CA3AF] border border-slate-200 dark:border-[#222934]">
                  Automated Analysis
                </span>
              </div>
              <CardDescription>Personalized financial patterns and alerts</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {mockAIInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F14]/60 border border-slate-200/80 dark:border-[#222934]/60 flex items-start gap-3 transition-colors hover:border-[#3B82F6]/30"
                >
                  <div className="mt-0.5 shrink-0">
                    {insight.type === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                    )}
                    {insight.type === 'success' && (
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                    )}
                    {insight.type === 'info' && (
                      <Info className="w-4 h-4 text-[#3B82F6]" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6]">
                        {insight.title}
                      </h4>
                      <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-[#222934] text-slate-600 dark:text-[#9CA3AF]">
                        {insight.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#9CA3AF] leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Transactions Preview (7 cols) */}
          <Card className="lg:col-span-7">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#3B82F6]" />
                  Recent Transactions
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                  id="dashboard-view-all-tx-btn"
                >
                  View All
                </Button>
              </div>
              <CardDescription>Latest 5 recorded transactions</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F14]/60 border border-slate-200/80 dark:border-[#222934]/60 flex items-center justify-between hover:border-[#3B82F6]/30 transition-all duration-200"
                  >
                    {/* Left: Icon, Title, and Category */}
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] shrink-0">
                        {getTxIcon(tx.iconName)}
                      </div>

                      <div className="flex flex-col overflow-hidden text-left">
                        <span className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6] truncate">
                          {tx.title}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${tx.categoryColor || 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30'}`}
                          >
                            {tx.category}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-[#6B7280]">
                            {tx.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Amount */}
                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                        -₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Shared Add Expense Modal Dialog */}
      <AddExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
      />
    </PageContainer>
  );
};
