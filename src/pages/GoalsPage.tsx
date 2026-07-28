import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Plus,
  ShieldCheck,
  Plane,
  Laptop,
  TrendingUp,
  Award,
  Sparkles,
  PieChart,
  X,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useData } from '../context/DataContext';

export const GoalsPage: React.FC = () => {
  const { goals, expenses, profile, addGoal, depositToGoal } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  // Add goal state
  const [goalTitle, setGoalTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const targetDate = 'Dec 2026';
  const [targetCategory, setTargetCategory] = useState('Safety');

  const totalGoalsSaved = goals.reduce((acc, curr) => acc + curr.currentAmount, 0);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !targetAmount) return;

    await addGoal({
      title: goalTitle,
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      targetDate,
      category: targetCategory,
      iconName: targetCategory === 'Travel' ? 'Plane' : targetCategory === 'Electronics' ? 'Laptop' : 'ShieldCheck',
      color: targetCategory === 'Travel' ? 'from-[#F59E0B] to-[#D97706]' : targetCategory === 'Electronics' ? 'from-[#8B5CF6] to-[#6D28D9]' : 'from-[#3B82F6] to-[#1D4ED8]',
    });

    setGoalTitle('');
    setTargetAmount('');
    setIsAddModalOpen(false);
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositGoalId || !depositAmount) return;
    const targetGoal = goals.find((g) => g.id === depositGoalId);
    if (!targetGoal) return;

    await depositToGoal(depositGoalId, parseFloat(depositAmount), targetGoal.currentAmount);
    setDepositGoalId(null);
    setDepositAmount('');
  };

  const getGoalIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-white" />;
      case 'Plane':
        return <Plane className="w-6 h-6 text-white" />;
      case 'Laptop':
        return <Laptop className="w-6 h-6 text-white" />;
      default:
        return <Target className="w-6 h-6 text-white" />;
    }
  };

  // Dynamic Category Caps calculated from expenses
  const categorySpentMap: { [key: string]: number } = {};
  expenses.forEach((e) => {
    categorySpentMap[e.category] = (categorySpentMap[e.category] || 0) + e.amount;
  });

  const categories = ['Food & Beverages', 'Transportation', 'Bills & Subscriptions', 'Shopping', 'Miscellaneous'];
  const monthlyBudget = profile.monthlyBudget || 40000;

  const dynamicCategoryBudgets = categories.map((cat, idx) => {
    const allocatedAmount = Math.round(monthlyBudget * (idx === 0 ? 0.35 : idx === 1 ? 0.25 : idx === 2 ? 0.15 : 0.15));
    const spentAmount = categorySpentMap[cat] || 0;
    return {
      id: `cb-${idx}`,
      category: cat,
      spentAmount,
      allocatedAmount,
    };
  });

  return (
    <PageContainer
      title="Financial Goals & Budget Caps"
      subtitle="Track your long-term savings goals, emergency funds, and monthly category budget allocations."
      badge="Smart Planning"
      actionSlot={
        <Button variant="primary" size="md" onClick={() => setIsAddModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Create New Goal
        </Button>
      }
    >
      <div className="space-y-6">
        {/* ------------------------------------------------------------- */}
        {/* 1. FINANCIAL HEALTH & PROGRESS ACHIEVEMENTS SUMMARY           */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card accentBorder hoverable className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Goal Health Score</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6] mt-0.5">
                  {goals.length > 0 ? '92 / 100' : '100 / 100'}
                </p>
              </div>
            </div>
          </Card>

          <Card hoverable className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Total Savings Deposited</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6] mt-0.5">
                  ₹{totalGoalsSaved.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </Card>

          <Card hoverable className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Target Status</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6] mt-0.5">
                  {goals.length > 0 ? 'Active Tracking' : 'Clean Slate'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. SAVINGS GOALS CARDS SECTION                                */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-[#F3F4F6] tracking-tight">
              Active Savings Targets
            </h2>
            <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">
              {goals.length} Active Goals
            </span>
          </div>

          {goals.length === 0 ? (
            <Card className="p-8 text-center flex flex-col items-center justify-center space-y-4 border-dashed">
              <div className="w-14 h-14 rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center border border-[#3B82F6]/30">
                <Target className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">No Savings Goals Set Yet</h3>
                <p className="text-xs text-slate-500">Create your first target (Emergency Fund, Vacation, Gadgets) to start tracking savings progress!</p>
              </div>
              <Button variant="primary" size="md" onClick={() => setIsAddModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
                Create Your First Goal
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {goals.map((goal) => {
                const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

                return (
                  <Card key={goal.id} hoverable className="flex flex-col justify-between space-y-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${goal.color || 'from-[#3B82F6] to-[#1D4ED8]'} p-2.5 flex items-center justify-center shadow-lg`}
                        >
                          {getGoalIcon(goal.iconName)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">
                            {goal.title}
                          </h3>
                          <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">
                            Target: {goal.targetDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-[#9CA3AF]">Saved So Far</span>
                        <span className="font-bold text-[#3B82F6]">{percentage}% Completed</span>
                      </div>

                      <div className="w-full h-3 bg-slate-100 dark:bg-[#0B0F14] rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-[#222934]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] rounded-full shadow-sm"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                          ₹{goal.currentAmount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-slate-400 dark:text-[#6B7280]">
                          of ₹{goal.targetAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => setDepositGoalId(goal.id)}
                    >
                      + Add Funds / Deposit
                    </Button>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3. MONTHLY CATEGORY BUDGET CARDS                              */}
        {/* ------------------------------------------------------------- */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[#3B82F6]" />
                Monthly Category Budget Caps
              </CardTitle>
              <span className="text-xs font-semibold text-[#3B82F6]">Current Month</span>
            </div>
            <CardDescription>Allocated monthly spending caps per category</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dynamicCategoryBudgets.map((b) => {
                const usedPct = Math.min(100, Math.round((b.spentAmount / b.allocatedAmount) * 100));

                return (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0F14]/60 border border-slate-200/80 dark:border-[#222934]/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 dark:text-[#F3F4F6]">
                        {b.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-[#9CA3AF]">
                        {usedPct}% Used
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 dark:bg-[#222934] rounded-full overflow-hidden">
                      <div
                        style={{ width: `${usedPct}%` }}
                        className={`h-full rounded-full ${usedPct > 90 ? 'bg-[#EF4444]' : 'bg-[#3B82F6]'}`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Spent: ₹{b.spentAmount.toLocaleString('en-IN')}</span>
                      <span>Cap: ₹{b.allocatedAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Goal Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] rounded-3xl p-6 space-y-6 relative"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#222934] pb-4">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-[#F3F4F6]">Create Savings Target</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-[#D1D5DB]">Goal Title</label>
                  <Input
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    placeholder="e.g. New Laptop Fund"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-[#D1D5DB]">Target Amount (₹)</label>
                  <Input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="50000"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-[#D1D5DB]">Category</label>
                  <select
                    value={targetCategory}
                    onChange={(e) => setTargetCategory(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-slate-100 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#222934] text-sm font-semibold text-slate-900 dark:text-[#F3F4F6]"
                  >
                    <option value="Safety">Safety & Emergency</option>
                    <option value="Travel">Travel & Vacation</option>
                    <option value="Electronics">Electronics & Gadgets</option>
                    <option value="General">General Savings</option>
                  </select>
                </div>

                <Button type="submit" variant="primary" size="md" className="w-full">
                  Create Savings Target
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deposit Modal */}
      <AnimatePresence>
        {depositGoalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] rounded-3xl p-6 space-y-6 relative"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#222934] pb-4">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F3F4F6]">Deposit Funds</h3>
                <button onClick={() => setDepositGoalId(null)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleDeposit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-[#D1D5DB]">Deposit Amount (₹)</label>
                  <Input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="1000"
                    required
                  />
                </div>

                <Button type="submit" variant="primary" size="md" className="w-full">
                  Confirm Deposit
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};
