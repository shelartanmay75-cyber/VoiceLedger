import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  LayoutGrid,
  List,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ExpenseCard } from '../components/expenses/ExpenseCard';
import { AddExpenseModal } from '../components/expenses/AddExpenseModal';
import { EmptyState } from '../components/expenses/EmptyState';
import { ExpenseSkeleton } from '../components/expenses/ExpenseSkeleton';
import { mockExpensesList, TOP_20_CATEGORIES } from '../data/mockExpensesData';
import type { ViewMode, SortOption, DateFilterOption } from '../types/expense';

export const ExpensesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and Sort Logic
  const filteredExpenses = useMemo(() => {
    return mockExpensesList
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
                <Calendar className="w-3.5 h-3.5 absolute left-3 text-slate-400 dark:text-[#6B7280] pointer-events-none" />
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
        {/* 3. EXPENSES CONTENT AREA (CARDS / TABLE / SKELETON / EMPTY)   */}
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
          /* Table View */
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
                  {filteredExpenses.map((expense) => (
                    <ExpenseCard
                      key={expense.id}
                      expense={expense}
                      layoutMode="table"
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          /* Timeline / Card Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                layoutMode="grid"
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Expense Modal Dialog */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </PageContainer>
  );
};
