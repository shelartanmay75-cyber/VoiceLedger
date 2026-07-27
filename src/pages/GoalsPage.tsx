import React from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { mockSavingsGoals, mockCategoryBudgets } from '../data/mockFeatureData';

export const GoalsPage: React.FC = () => {
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

  return (
    <PageContainer
      title="Financial Goals & Budget Caps"
      subtitle="Track your long-term savings goals, emergency funds, and monthly category budget allocations."
      badge="Smart Planning"
      actionSlot={
        <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
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
                  88 / 100
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
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Total Goals Saved</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6] mt-0.5">
                  ₹1,95,500
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
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Target Velocity</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6] mt-0.5">
                  On Schedule
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
              {mockSavingsGoals.length} Active Goals
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockSavingsGoals.map((goal) => {
              const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);

              return (
                <Card key={goal.id} hoverable className="flex flex-col justify-between space-y-6">
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${goal.color} p-2.5 flex items-center justify-center shadow-lg`}
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

                  {/* Amount Progress */}
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
                </Card>
              );
            })}
          </div>
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
              <span className="text-xs font-semibold text-[#3B82F6]">July 2026</span>
            </div>
            <CardDescription>Allocated monthly spending caps per category</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockCategoryBudgets.map((b) => {
                const usedPct = Math.round((b.spentAmount / b.allocatedAmount) * 100);
                const remaining = b.allocatedAmount - b.spentAmount;

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

                    <div className="w-full h-2.5 bg-slate-200 dark:bg-[#222934] rounded-full overflow-hidden">
                      <div
                        style={{ width: `${usedPct}%` }}
                        className={`h-full rounded-full ${
                          usedPct > 90 ? 'bg-[#EF4444]' : 'bg-[#3B82F6]'
                        }`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#9CA3AF]">
                      <span>Spent: ₹{b.spentAmount.toLocaleString('en-IN')}</span>
                      <span className="font-semibold text-[#22C55E]">
                        ₹{remaining.toLocaleString('en-IN')} left
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
