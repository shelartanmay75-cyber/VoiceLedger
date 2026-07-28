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
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { useData } from '../context/DataContext';
import { mockAnalyticsData } from '../data/mockFeatureData';

export const AnalyticsPage: React.FC = () => {
  const { expenses } = useData();

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

  // Dynamic calculations from expenses
  const totalAnalyticsSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const categoryTotals: { [key: string]: number } = {};
  expenses.forEach((item) => {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
  });

  const colors = ['#22C55E', '#F97316', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#06B6D4'];

  const dynamicCategories = Object.keys(categoryTotals).map((cat, idx) => ({
    category: cat,
    amount: categoryTotals[cat],
    percentage: totalAnalyticsSpent > 0 ? Math.round((categoryTotals[cat] / totalAnalyticsSpent) * 100) : 0,
    color: colors[idx % colors.length],
  }));

  const maxMonthlyAmount = Math.max(...mockAnalyticsData.monthlyData.map((d) => d.budget));
  const maxWeeklyAmount = Math.max(...mockAnalyticsData.weeklyData.map((d) => d.amount));

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
          {mockAnalyticsData.trends.map((trend, idx) => (
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
          {/* Monthly Spending Bar Chart Placeholder (7 cols) */}
          <Card className="lg:col-span-7 flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#3B82F6]" />
                  Monthly Spending vs Budget
                </CardTitle>
                <span className="text-xs font-bold text-[#3B82F6] bg-[#3B82F6]/10 px-2.5 py-0.5 rounded-full border border-[#3B82F6]/30">
                  Past 6 Months
                </span>
              </div>
              <CardDescription>Visual comparison of actual spending vs allocated monthly budget</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Custom SVG/CSS Bar Chart Presentation */}
              <div className="pt-6 pb-2 px-2 flex items-end justify-between gap-3 sm:gap-6 h-56 border-b border-slate-200 dark:border-[#222934]">
                {mockAnalyticsData.monthlyData.map((data) => {
                  const spentHeight = (data.amount / maxMonthlyAmount) * 100;
                  const budgetHeight = (data.budget / maxMonthlyAmount) * 100;

                  return (
                    <div key={data.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      {/* Bars Group */}
                      <div className="w-full flex items-end justify-center gap-1.5 h-full relative">
                        {/* Budget Outline Bar */}
                        <div
                          style={{ height: `${budgetHeight}%` }}
                          className="w-2.5 sm:w-3 bg-slate-200 dark:bg-[#222934] rounded-t-md transition-all group-hover:bg-slate-300 dark:group-hover:bg-[#2C3544]"
                          title={`Budget: ₹${data.budget.toLocaleString('en-IN')}`}
                        />
                        {/* Spent Filled Bar */}
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${spentHeight}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="w-3.5 sm:w-5 bg-gradient-to-t from-[#2563EB] to-[#3B82F6] rounded-t-md shadow-[0_0_12px_rgba(59,130,246,0.3)] relative group-hover:brightness-110"
                        >
                          {/* Hover Tooltip */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded shadow-lg pointer-events-none whitespace-nowrap z-20">
                            ₹{data.amount.toLocaleString('en-IN')}
                          </div>
                        </motion.div>
                      </div>

                      {/* Month Label */}
                      <span className="text-xs font-bold text-slate-600 dark:text-[#9CA3AF]">
                        {data.month}
                      </span>
                    </div>
                  );
                })}
              </div>

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

          {/* Category Pie/Donut Chart Placeholder (5 cols) */}
          <Card className="lg:col-span-5 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-[#3B82F6]" />
                Category Distribution
              </CardTitle>
              <CardDescription>Proportional spending by category for July 2026</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Donut Chart Visual Graphic */}
              <div className="flex justify-center py-2 relative">
                <div className="w-40 h-40 rounded-full border-8 border-slate-100 dark:border-[#151A21] relative flex items-center justify-center shadow-inner">
                  {/* Conic Gradient Donut Wheel Simulation */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(
                        #22C55E 0% 34.5%,
                        #F97316 34.5% 57.3%,
                        #3B82F6 57.3% 74.3%,
                        #8B5CF6 74.3% 87.1%,
                        #EC4899 87.1% 100%
                      )`,
                      maskImage: 'radial-gradient(transparent 58%, black 59%)',
                      WebkitMaskImage: 'radial-gradient(transparent 58%, black 59%)',
                    }}
                  />
                  <div className="text-center z-10 space-y-0.5">
                    <span className="text-xs text-slate-400 dark:text-[#6B7280]">Total</span>
                    <p className="text-base font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                      ₹{totalAnalyticsSpent.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Legend List */}
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
            </CardContent>
          </Card>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3. WEEKLY SPENDING & TOP MERCHANTS LEADERBOARD                */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Weekly Spending Breakdown (5 cols) */}
          <Card className="lg:col-span-5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#3B82F6]" />
                Weekly Day-Wise Spending
              </CardTitle>
              <CardDescription>Daily spending variance over the current week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockAnalyticsData.weeklyData.map((w) => (
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

          {/* Top Merchants Leaderboard (7 cols) */}
          <Card className="lg:col-span-7">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#3B82F6]" />
                  Top Merchants Leaderboard
                </CardTitle>
                <span className="text-xs font-semibold text-[#3B82F6]">Top 5 Merchants</span>
              </div>
              <CardDescription>Highest volume vendors and transaction frequencies</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-2.5">
                {mockAnalyticsData.topMerchants.map((m, idx) => (
                  <div
                    key={m.name}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F14]/60 border border-slate-200/80 dark:border-[#222934]/60 flex items-center justify-between hover:border-[#3B82F6]/30 transition-all duration-200"
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
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
