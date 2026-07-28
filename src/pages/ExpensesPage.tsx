import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  RefreshCw,
  Clock,
  Calendar as CalendarIcon,
  X,
  Check,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ExpenseCard } from '../components/expenses/ExpenseCard';
import { AddExpenseModal } from '../components/expenses/AddExpenseModal';
import { ExpenseSkeleton } from '../components/expenses/ExpenseSkeleton';
import { EmptyState } from '../components/expenses/EmptyState';
import { useData } from '../context/DataContext';
import type { Expense, SortOption } from '../types/expense';

const TOP_20_CATEGORIES = [
  'Transportation',
  'Food & Beverages',
  'Shopping',
  'Utilities',
  'Housing & Rent',
  'Healthcare',
  'Education',
  'Entertainment',
  'Travel',
  'Work & Business',
  'Fitness & Sports',
  'Bills & Subscriptions',
  'Gifts & Donations',
  'Pets',
  'Family & Kids',
  'Personal Care',
  'Investments & Savings',
  'Taxes & Fees',
  'Income / Refund',
  'Miscellaneous',
];

export const ExpensesPage: React.FC = () => {
  const { expenses, deleteExpense, addExpense } = useData();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Edit Form state
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editMethod, setEditMethod] = useState('');
  const [editDate, setEditDate] = useState('');

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [customDateIso, setCustomDateIso] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'timeline'>('timeline');

  // Loading state simulation
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSimulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const openEditModal = (exp: Expense) => {
    setEditingExpense(exp);
    setEditTitle(exp.title);
    setEditAmount(exp.amount.toString());
    setEditCategory(exp.category);
    setEditMethod(exp.paymentMethod);
    setEditDate(exp.isoDate || new Date().toISOString().split('T')[0]);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense || !editTitle || !editAmount) return;

    // Remove old expense and add updated expense
    await deleteExpense(editingExpense.id);
    await addExpense({
      title: editTitle,
      amount: parseFloat(editAmount),
      category: editCategory,
      paymentMethod: editMethod as Expense['paymentMethod'],
      date: editDate === new Date().toISOString().split('T')[0] ? 'Today' : editDate,
      isoDate: editDate,
      notes: editingExpense.notes || '',
      iconName: editingExpense.iconName || 'Tag',
      categoryColor: editingExpense.categoryColor || 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30',
    });

    setEditingExpense(null);
  };

  // Filtered expenses list
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((expense) => {
        // Search query filter
        const matchesSearch =
          expense.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (expense.notes && expense.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        // Category filter
        const matchesCategory =
          selectedCategory === 'all' || expense.category === selectedCategory;

        // Custom Date calendar filter
        if (customDateIso) {
          if (expense.isoDate !== customDateIso) return false;
        }

        // Quick Date period filter
        let matchesDate = true;
        if (!customDateIso && dateFilter !== 'all') {
          const expenseDate = new Date(expense.isoDate || expense.date);
          const now = new Date();
          if (dateFilter === 'today') {
            matchesDate = expense.date.toLowerCase() === 'today' || expenseDate.toDateString() === now.toDateString();
          } else if (dateFilter === 'week') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            matchesDate = expenseDate >= sevenDaysAgo;
          } else if (dateFilter === 'month') {
            matchesDate =
              expenseDate.getMonth() === now.getMonth() &&
              expenseDate.getFullYear() === now.getFullYear();
          }
        }

        return matchesSearch && matchesCategory && matchesDate;
      })
      .sort((a, b) => {
        if (sortOption === 'newest') {
          return new Date(b.isoDate || b.date).getTime() - new Date(a.isoDate || a.date).getTime();
        }
        if (sortOption === 'oldest') {
          return new Date(a.isoDate || a.date).getTime() - new Date(b.isoDate || b.date).getTime();
        }
        if (sortOption === 'highest') {
          return b.amount - a.amount;
        }
        if (sortOption === 'lowest') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [expenses, searchQuery, selectedCategory, dateFilter, customDateIso, sortOption]);

  // Group expenses day-wise for segregated display
  const groupedExpenses = useMemo(() => {
    const groups: { [date: string]: { dateTitle: string; items: Expense[]; subtotal: number } } = {};

    filteredExpenses.forEach((expense) => {
      const dateTitle = expense.date || expense.isoDate || 'Earlier';

      if (!groups[dateTitle]) {
        groups[dateTitle] = {
          dateTitle,
          items: [],
          subtotal: 0,
        };
      }

      groups[dateTitle].items.push(expense);
      groups[dateTitle].subtotal += expense.amount;
    });

    return Object.values(groups);
  }, [filteredExpenses]);

  // Total filtered amount
  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [filteredExpenses]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setDateFilter('all');
    setCustomDateIso('');
    setSortOption('newest');
  };

  return (
    <PageContainer
      title="Expense History & Ledger"
      subtitle="View, search, filter, edit, or delete all your voice and manually recorded expenses."
      badge={`${filteredExpenses.length} Records`}
      actionSlot={
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          id="expenses-add-new-btn"
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
              <button
                onClick={handleSimulateLoading}
                className="p-2.5 text-slate-500 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#222934] rounded-xl border border-slate-200 dark:border-[#222934] transition-colors"
                title="Refresh Loading Skeleton Demo"
                id="expenses-refresh-demo-btn"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#3B82F6]' : ''}`} />
              </button>

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

          {/* Secondary Filters Grid */}
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

            {/* Date Period & Interactive Calendar Picker */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-[#9CA3AF]">
                  Date Period
                </label>
                {customDateIso && (
                  <button
                    onClick={() => setCustomDateIso('')}
                    className="text-[10px] text-[#3B82F6] hover:underline font-semibold"
                  >
                    Clear Calendar
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 flex items-center">
                  <CalendarIcon className="w-3.5 h-3.5 absolute left-3 text-slate-400 dark:text-[#6B7280] pointer-events-none" />
                  <select
                    value={customDateIso ? 'custom' : dateFilter}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      if (val !== 'custom') {
                        setCustomDateIso('');
                        setDateFilter(val);
                      }
                    }}
                    className="w-full bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-[#F3F4F6] text-xs rounded-xl border border-slate-200 dark:border-[#222934] pl-8 pr-4 py-2 outline-none focus:border-[#3B82F6]/50 focus:ring-2 focus:ring-[#3B82F6]/30 transition-all cursor-pointer"
                    id="expenses-date-filter-select"
                  >
                    <option value="all" className="bg-white dark:bg-[#151A21]">All Time</option>
                    <option value="today" className="bg-white dark:bg-[#151A21]">Today</option>
                    <option value="week" className="bg-white dark:bg-[#151A21]">This Week</option>
                    <option value="month" className="bg-white dark:bg-[#151A21]">This Month</option>
                    {customDateIso && <option value="custom" className="bg-white dark:bg-[#151A21]">Custom Date ({customDateIso})</option>}
                  </select>
                </div>

                <div
                  className="relative flex items-center cursor-pointer shrink-0"
                  title="Pick specific date from Calendar"
                  onClick={(e) => {
                    const input = e.currentTarget.querySelector('input');
                    if (input) {
                      try { if ('showPicker' in input) (input as any).showPicker(); } catch (_) {}
                    }
                  }}
                >
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#222934] text-[#3B82F6] hover:bg-slate-100 dark:hover:bg-[#151A21] transition-colors">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={customDateIso}
                    onChange={(e) => {
                      setCustomDateIso(e.target.value);
                    }}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                </div>
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

        {/* Total Filtered Summary Card */}
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

        {/* Expenses Content */}
        {isLoading ? (
          <ExpenseSkeleton count={6} layoutMode={viewMode === 'table' ? 'table' : 'grid'} />
        ) : filteredExpenses.length === 0 ? (
          <EmptyState
            type={searchQuery || selectedCategory !== 'all' ? 'no-results' : 'no-expenses'}
            onResetFilters={handleResetFilters}
            onAddExpense={() => setIsModalOpen(true)}
          />
        ) : viewMode === 'table' ? (
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

                      {group.items.map((expense) => (
                        <ExpenseCard
                          key={expense.id}
                          expense={expense}
                          layoutMode="table"
                          onDelete={(id) => deleteExpense(id)}
                          onEdit={(exp) => openEditModal(exp)}
                        />
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="space-y-8">
            {groupedExpenses.map((group) => (
              <div key={group.dateTitle} className="space-y-3">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((expense) => (
                    <ExpenseCard
                      key={expense.id}
                      expense={expense}
                      layoutMode="grid"
                      onDelete={(id) => deleteExpense(id)}
                      onEdit={(exp) => openEditModal(exp)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Edit Expense Modal */}
      <AnimatePresence>
        {editingExpense && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] rounded-3xl p-6 space-y-6 relative"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#222934] pb-4">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-[#F3F4F6]">Edit Expense Record</h3>
                <button onClick={() => setEditingExpense(null)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-[#D1D5DB]">Expense / Merchant Title</label>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-[#D1D5DB]">Amount (₹)</label>
                  <Input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-[#D1D5DB]">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-slate-100 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#222934] text-sm font-semibold text-slate-900 dark:text-[#F3F4F6]"
                  >
                    {TOP_20_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-[#D1D5DB]">Payment Method</label>
                  <select
                    value={editMethod}
                    onChange={(e) => setEditMethod(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-slate-100 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#222934] text-sm font-semibold text-slate-900 dark:text-[#F3F4F6]"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-[#D1D5DB]">Date</label>
                  <Input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button type="button" variant="secondary" size="md" className="flex-1" onClick={() => setEditingExpense(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="md" className="flex-1" leftIcon={<Check className="w-4 h-4" />}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};
