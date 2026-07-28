import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  LayoutGrid,
  List,
  Calendar as CalendarIcon,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ExpenseCard } from '../components/expenses/ExpenseCard';
import { AddExpenseModal } from '../components/expenses/AddExpenseModal';
import { EmptyState } from '../components/expenses/EmptyState';
import { ExpenseSkeleton } from '../components/expenses/ExpenseSkeleton';
import { TOP_20_CATEGORIES } from '../data/mockExpensesData';
import { useData } from '../context/DataContext';
import type { Expense, ViewMode, SortOption, DateFilterOption } from '../types/expense';

interface DayGroup {
  dateTitle: string;
  items: Expense[];
  subtotal: number;
}

export const ExpensesPage: React.FC = () => {
  const { expenses } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and Sort Logic
  const filteredExpenses = useMemo(() => {
    return (expenses || [])
      .filter((item) => {
        // Search query filter
        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        // Category filter
        const matchesCategory =
          selectedCategory === 'all' || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortOption === 'newest') return new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime();
        if (sortOption === 'oldest') return new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime();
        if (sortOption === 'highest') return b.amount - a.amount;
        if (sortOption === 'lowest') return a.amount - b.amount;
        return 0;
      });
  }, [searchQuery, selectedCategory, sortOption]);

  // Group expenses day-wise
  const groupedExpenses = useMemo<DayGroup[]>(() => {
    const groupsMap: { [key: string]: DayGroup } = {};

    filteredExpenses.forEach((item) => {
      let dateTitle = item.date.split(',')[0].trim();
      if (dateTitle === 'Today') {
        dateTitle = 'Today';
      } else if (dateTitle === 'Yesterday') {
        dateTitle = 'Yesterday';
      } else {
        const parsedDate = new Date(item.isoDate);
        if (!isNaN(parsedDate.getTime())) {
          const day = parsedDate.getDate();
          const month = parsedDate.toLocaleString('en-IN', { month: 'long' });
          const year = parsedDate.getFullYear();
          dateTitle = `${day} ${month} ${year}`;
        }
      }

      if (!groupsMap[dateTitle]) {
        groupsMap[dateTitle] = {
          dateTitle,
          items: [],
          subtotal: 0,
        };
      }
      groupsMap[dateTitle].items.push(item);
      groupsMap[dateTitle].subtotal += item.amount;
    });

    return Object.values(groupsMap);
  }, [filteredExpenses]);

  // Calculate Summary Stats from filtered set
  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredExpenses]);

  const handleSimulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setDateFilter('all');
    setSortOption('newest');
  };

  return (
    <PageContainer
      title="Expenses History"
      subtitle="View, search, filter, and organize all your voice recorded and manual transactions."
      badge={`${filteredExpenses.length} Items`}
      actionSlot={
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          id="expenses-add-expense-btn"
        >
          Add Expense
        </Button>
      }
    >
      <div className="space-y-6">
        {/* ------------------------------------------------------------- */}
        {/* 1. FILTER & SEARCH CONTROL BAR                                */}
        {/* ------------------------------------------------------------- */}
        <Card className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Live Search Input */}
            <div className="flex-1 max-w-lg">
              <Input
                placeholder="Search merchant, category, or note..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                id="expenses-search-input"
              />
            </div>

            {/* View Switcher & Demo Skeleton Button */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Simulate Refresh Button */}
              <button
                onClick={handleSimulateLoading}
                className="p-2.5 text-slate-500 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#222934] rounded-xl border border-slate-200 dark:border-[#222934] transition-colors"
                title="Refresh Loading Skeleton Demo"
                id="expenses-refresh-demo-btn"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#3B82F6]' : ''}`} />
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center p-1 bg-slate-100 dark:bg-[#0B0F14] rounded-xl border border-slate-200 dark:border-[#222934]">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'timeline'
                      ? 'bg-white dark:bg-[#151A21] text-[#3B82F6] shadow-sm'
                      : 'text-slate-500 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white'
                  }`}
                  id="expenses-view-grid-btn"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Timeline Cards</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-[#151A21] text-[#3B82F6] shadow-sm'
                      : 'text-slate-500 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white'
                  }`}
                  id="expenses-view-table-btn"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Table</span>
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Filters Grid: Top 20 Category, Date Range, Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-[#222934]/60">
            {/* Top 20 Categories Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-[#9CA3AF]">
                Category ({TOP_20_CATEGORIES.length} Categories)
              </label>
              <div className="relative flex items-center">
                <Filter className="w-3.5 h-3.5 absolute left-3 text-slate-400 dark:text-[#6B7280] pointer-events-none" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-[#F3F4F6] text-xs rounded-xl border border-slate-200 dark:border-[#222934] pl-8 pr-4 py-2 outline-none focus:border-[#3B82F6]/50 focus:ring-2 focus:ring-[#3B82F6]/30 transition-all cursor-pointer"
                  id="expenses-category-filter-select"
                >
                  <option value="all" className="bg-white dark:bg-[#151A21]">
                    All Categories ({TOP_20_CATEGORIES.length})
                  </option>
                  {TOP_20_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-white dark:bg-[#151A21]">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-[#9CA3AF]">
                Date Period
              </label>
              <div className="relative flex items-center">
                <CalendarIcon className="w-3.5 h-3.5 absolute left-3 text-slate-400 dark:text-[#6B7280] pointer-events-none" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as DateFilterOption)}
                  className="w-full bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-[#F3F4F6] text-xs rounded-xl border border-slate-200 dark:border-[#222934] pl-8 pr-4 py-2 outline-none focus:border-[#3B82F6]/50 focus:ring-2 focus:ring-[#3B82F6]/30 transition-all cursor-pointer"
                  id="expenses-date-filter-select"
                >
                  <option value="all" className="bg-white dark:bg-[#151A21]">All Time</option>
                  <option value="today" className="bg-white dark:bg-[#151A21]">Today</option>
                  <option value="week" className="bg-white dark:bg-[#151A21]">This Week</option>
                  <option value="month" className="bg-white dark:bg-[#151A21]">This Month</option>
                </select>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-[#9CA3AF]">
                Sort By
              </label>
              <div className="relative flex items-center">
                <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 text-slate-400 dark:text-[#6B7280] pointer-events-none" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="w-full bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-[#F3F4F6] text-xs rounded-xl border border-slate-200 dark:border-[#222934] pl-8 pr-4 py-2 outline-none focus:border-[#3B82F6]/50 focus:ring-2 focus:ring-[#3B82F6]/30 transition-all cursor-pointer"
                  id="expenses-sort-select"
                >
                  <option value="newest" className="bg-white dark:bg-[#151A21]">Newest First</option>
                  <option value="oldest" className="bg-white dark:bg-[#151A21]">Oldest First</option>
                  <option value="highest" className="bg-white dark:bg-[#151A21]">Highest Amount</option>
                  <option value="lowest" className="bg-white dark:bg-[#151A21]">Lowest Amount</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* ------------------------------------------------------------- */}
        {/* 2. TOTAL FILTERED SUMMARY CARD                                */}
        {/* ------------------------------------------------------------- */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Total Filtered Spending:</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-[#F3F4F6]">
              ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {(searchQuery || selectedCategory !== 'all' || dateFilter !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[#3B82F6] hover:underline flex items-center gap-1"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3. DAY-WISE SEGREGATED EXPENSES CONTENT AREA                  */}
        {/* ------------------------------------------------------------- */}
        {isLoading ? (
          <ExpenseSkeleton count={6} layoutMode={viewMode === 'table' ? 'table' : 'grid'} />
        ) : filteredExpenses.length === 0 ? (
          <EmptyState
            type={searchQuery || selectedCategory !== 'all' ? 'no-results' : 'no-expenses'}
            onResetFilters={handleResetFilters}
            onAddExpense={() => setIsModalOpen(true)}
          />
        ) : viewMode === 'table' ? (
          /* Day-wise Segregated Table View */
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#0B0F14] border-b border-slate-200 dark:border-[#222934] text-[11px] font-bold text-slate-500 dark:text-[#9CA3AF] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Merchant & Note</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Payment Method</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Amount (₹)</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#222934]/60">
                  {groupedExpenses.map((group) => (
                    <React.Fragment key={group.dateTitle}>
                      {/* Day Header Row */}
                      <tr className="bg-slate-100/70 dark:bg-[#0B0F14]/90 border-y border-slate-200 dark:border-[#222934]">
                        <td colSpan={6} className="py-2.5 px-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-[#3B82F6]" />
                              <span className="text-xs font-extrabold text-slate-900 dark:text-[#F3F4F6] uppercase tracking-wider">
                                {group.dateTitle}
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
                                {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                              </span>
                            </div>
                            <div className="text-xs font-extrabold text-slate-900 dark:text-[#F3F4F6] flex items-center gap-1">
                              <span className="text-[10px] text-slate-500 font-normal">Day Total:</span>
                              <span>₹{group.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Day Expenses Rows */}
                      {group.items.map((expense) => (
                        <ExpenseCard
                          key={expense.id}
                          expense={expense}
                          layoutMode="table"
                        />
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          /* Day-wise Segregated Timeline / Cards View */
          <div className="space-y-8">
            {groupedExpenses.map((group) => (
              <div key={group.dateTitle} className="space-y-3">
                {/* Day Header Banner */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#222934]/80">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-[#F3F4F6] tracking-tight">
                      {group.dateTitle}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 dark:bg-[#222934] dark:text-[#9CA3AF]">
                      {group.items.length} {group.items.length === 1 ? 'transaction' : 'transactions'}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-700 dark:text-[#D1D5DB] flex items-center gap-1 bg-slate-100 dark:bg-[#151A21] px-2.5 py-1 rounded-xl border border-slate-200 dark:border-[#222934]">
                    <span className="text-[10px] text-slate-400 font-normal">Day Total:</span>
                    <span className="text-[#3B82F6]">
                      ₹{group.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Day Expense Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((expense) => (
                    <ExpenseCard
                      key={expense.id}
                      expense={expense}
                      layoutMode="grid"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shared Add Expense Modal Dialog */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </PageContainer>
  );
};
