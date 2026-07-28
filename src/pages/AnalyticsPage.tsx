import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  ShoppingBag,
  Fuel,
  Coffee,
  ShoppingCart,
  Utensils,
  Sparkles,
  TrendingDown,
  Calendar,
  Layers,
  Inbox,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { useData } from '../context/DataContext';

export const AnalyticsPage: React.FC = () => {
  const { expenses, profile } = useData();

  const getMerchantIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingCart':
        return <ShoppingCart className="w-4 h-4 text-[#22C55E]" />;
      case 'Fuel':
        return <Fuel className="w-4 h-4 text-[#3B82F6]" />;
      case 'Coffee':
        return <Coffee className="w-4 h-4 text-[#F97316]" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-4 h-4 text-[#EC4899]" />;
      case 'Utensils':
        return <Utensils className="w-4 h-4 text-[#F59E0B]" />;
      default:
        return <ShoppingBag className="w-4 h-4 text-[#3B82F6]" />;
    }
  };

  // Dynamic calculations from real user expenses
  const totalAnalyticsSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Category Distribution
  const categoryTotals: { [key: string]: number } = {};
  expenses.forEach((item) => {
    const cat = item.category || 'Miscellaneous';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + item.amount;
  });

  const colors = ['#22C55E', '#F97316', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#06B6D4'];

  const dynamicCategories = Object.keys(categoryTotals).map((cat, idx) => ({
    category: cat,
    amount: categoryTotals[cat],
    percentage: totalAnalyticsSpent > 0 ? Math.round((categoryTotals[cat] / totalAnalyticsSpent) * 100) : 0,
    color: colors[idx % colors.length],
  }));

  // Top Merchants dynamically calculated from expenses
  const merchantTotals: { [key: string]: { amount: number; count: number; category: string } } = {};
  expenses.forEach((item) => {
    const mName = item.title || 'General Store';
    if (!merchantTotals[mName]) {
      merchantTotals[mName] = { amount: 0, count: 0, category: item.category };
    }
    merchantTotals[mName].amount += item.amount;
    merchantTotals[mName].count += 1;
  });

  const topMerchants = Object.keys(merchantTotals)
    .map((mName) => ({
      name: mName,
      amount: merchantTotals[mName].amount,
      transactions: merchantTotals[mName].count,
      category: merchantTotals[mName].category,
      iconName: 'ShoppingBag',
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Day-wise spending over current week
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyData = days.map((day) => {
    const amount = expenses
      .filter((e) => {
        if (!e.isoDate) return false;
        const d = new Date(e.isoDate);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        return dayName === day;
      })
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { day, amount };
  });

  const maxWeeklyAmount = Math.max(...weeklyData.map((d) => d.amount), 100);

  // Top Trends summary cards
  const monthlyBudget = profile.monthlyBudget || 40000;
  const budgetRatio = Math.round((totalAnalyticsSpent / monthlyBudget) * 100);

  const trends = [
    {
      title: 'Total Expenses Recorded',
      value: `₹${totalAnalyticsSpent.toLocaleString('en-IN')}`,
      subtitle: `${expenses.length} total entries`,
      change: `${expenses.length > 0 ? 'Active' : 'Clean Slate'}`,
      isPositive: true,
    },
    {
      title: 'Budget Consumed',
      value: `${budgetRatio}%`,
      subtitle: `Out of ₹${monthlyBudget.toLocaleString('en-IN')}`,
      change: budgetRatio > 90 ? 'High' : 'Normal',
      isPositive: budgetRatio <= 90,
    },
    {
      title: 'Active Categories',
      value: `${Object.keys(categoryTotals).length} Categories`,
      subtitle: 'Recorded spendings',
      change: '+0 this week',
      isPositive: true,
    },
  ];

  return (
    <PageContainer
      title="Analytics & Financial Insights"
      subtitle="Deep-dive breakdown of your monthly spending, category distribution, and merchant trends."
      badge="AI Reports"
    >
      <div className="space-y-6">
        {/* ------------------------------------------------------------- */}
        {/* 1. SPENDING TRENDS TOP METRICS CARDS                          */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {trends.map((trend, idx) => (
            <Card key={idx} hoverable className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-500 dark:text-[#9CA3AF]">
                  {trend.title}
                </span>
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#222934]">
                  {trend.isPositive ? (
                    <TrendingDown className="w-4 h-4 text-[#22C55E]" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-[#EF4444]" />
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                  {trend.value}
                </p>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 dark:text-[#6B7280]">{trend.subtitle}</span>
                  <span className={`font-bold ${trend.isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                    {trend.change}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. MONTHLY SPENDING CHART & CATEGORY PIE CHART GRID            */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Monthly Spending Summary Card */}
          <Card className="lg:col-span-7 flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#3B82F6]" />
                  Monthly Spending vs Budget
                </CardTitle>
                <span className="text-xs font-bold text-[#3B82F6] bg-[#3B82F6]/10 px-2.5 py-0.5 rounded-full border border-[#3B82F6]/30">
                  Current Month
                </span>
              </div>
              <CardDescription>Visual comparison of actual spending vs allocated monthly budget</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {expenses.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400">
                  <Inbox className="w-10 h-10 mb-2 opacity-50 text-[#3B82F6]" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Expenses Recorded Yet</p>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">Speak into the voice recorder on your Dashboard to record your first expense!</p>
                </div>
              ) : (
                <div className="pt-6 pb-2 px-2 flex items-end justify-between gap-3 sm:gap-6 h-56 border-b border-slate-200 dark:border-[#222934]">
                  {/* Current month bar */}
                  <div className="w-full flex items-end justify-center gap-4 h-full relative">
                    <div className="flex flex-col items-center h-full justify-end group w-24">
                      <div className="w-full flex items-end justify-center gap-2 h-full relative">
                        {/* Budget Bar */}
                        <div
                          style={{ height: '100%' }}
                          className="w-5 bg-slate-200 dark:bg-[#222934] rounded-t-md"
                          title={`Budget: ₹${monthlyBudget.toLocaleString('en-IN')}`}
                        />
                        {/* Spent Bar */}
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.min(100, (totalAnalyticsSpent / monthlyBudget) * 100)}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="w-8 bg-gradient-to-t from-[#2563EB] to-[#3B82F6] rounded-t-md relative"
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-0.5 px-1.5 rounded whitespace-nowrap">
                            ₹{totalAnalyticsSpent.toLocaleString('en-IN')}
                          </div>
                        </motion.div>
                      </div>
                      <span className="text-xs font-bold text-slate-600 dark:text-[#9CA3AF] mt-2">Current Month</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-[#3B82F6]" />
                  <span className="text-slate-600 dark:text-[#9CA3AF]">Actual Spent</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-slate-200 dark:bg-[#222934]" />
                  <span className="text-slate-600 dark:text-[#9CA3AF]">Target Budget</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution Donut Chart */}
          <Card className="lg:col-span-5 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-[#3B82F6]" />
                Category Distribution
              </CardTitle>
              <CardDescription>Proportional spending by category</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex justify-center py-2 relative">
                <div className="w-40 h-40 rounded-full border-8 border-slate-100 dark:border-[#151A21] relative flex items-center justify-center shadow-inner">
                  <div className="text-center z-10 space-y-0.5">
                    <span className="text-xs text-slate-400 dark:text-[#6B7280]">Total</span>
                    <p className="text-base font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                      ₹{totalAnalyticsSpent.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Legend List */}
              {dynamicCategories.length === 0 ? (
                <p className="text-xs text-center text-slate-400 py-2">No categories yet</p>
              ) : (
                <div className="space-y-2">
                  {dynamicCategories.map((item) => (
                    <div key={item.category} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-700 dark:text-[#D1D5DB] font-medium">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 dark:text-[#F3F4F6]">
                          ₹{item.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold w-9 text-right">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3. WEEKLY SPENDING & TOP MERCHANTS LEADERBOARD                */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Weekly Day-Wise Spending */}
          <Card className="lg:col-span-5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#3B82F6]" />
                Weekly Day-Wise Spending
              </CardTitle>
              <CardDescription>Daily spending variance over the current week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {weeklyData.map((w) => (
                <div key={w.day} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-[#D1D5DB]">{w.day}</span>
                    <span className="font-bold text-slate-900 dark:text-[#F3F4F6]">
                      ₹{w.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-[#0B0F14] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(w.amount / maxWeeklyAmount) * 100}%` }}
                      className="h-full bg-[#3B82F6] rounded-full"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Merchants Leaderboard */}
          <Card className="lg:col-span-7">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#3B82F6]" />
                  Top Merchants Leaderboard
                </CardTitle>
                <span className="text-xs font-semibold text-[#3B82F6]">Top Merchants</span>
              </div>
              <CardDescription>Highest volume vendors and transaction frequencies</CardDescription>
            </CardHeader>

            <CardContent>
              {topMerchants.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center text-center text-slate-400">
                  <Layers className="w-8 h-8 mb-2 opacity-40 text-[#3B82F6]" />
                  <p className="text-xs font-semibold">No merchant history yet</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {topMerchants.map((m, idx) => (
                    <div
                      key={m.name}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F14]/60 border border-slate-200/80 dark:border-[#222934]/60 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-center font-extrabold text-xs text-slate-400 dark:text-[#6B7280]">
                          #{idx + 1}
                        </span>
                        <div className="p-2 rounded-xl bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] shrink-0">
                          {getMerchantIcon(m.iconName)}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6]">
                            {m.name}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400 dark:text-[#6B7280]">
                              {m.category}
                            </span>
                            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-[#222934] text-slate-600 dark:text-[#9CA3AF]">
                              {m.transactions} txns
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                          ₹{m.amount.toLocaleString('en-IN')}
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
    </PageContainer>
  );
};
