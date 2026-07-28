import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Calendar, Tag, CreditCard, FileText, IndianRupee } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TOP_20_CATEGORIES, PAYMENT_METHODS } from '../../data/mockExpensesData';
import { useData } from '../../context/DataContext';
import type { PaymentMethod } from '../../types/expense';

export interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose }) => {
  const { addExpense } = useData();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(TOP_20_CATEGORIES[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    setIsSubmitting(true);
    try {
      const parsedAmount = parseFloat(amount);
      const isoDate = new Date(date).toISOString();
      const formattedDate = new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

      await addExpense({
        title,
        amount: parsedAmount,
        category,
        paymentMethod,
        date: formattedDate,
        isoDate,
        notes,
        iconName: 'ShoppingBag',
        categoryColor: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30',
      });

      setTitle('');
      setAmount('');
      setNotes('');
      onClose();
    } catch (err) {
      console.error('Error adding expense:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 dark:bg-[#0B0F14]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-lg bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] rounded-3xl p-6 shadow-2xl pointer-events-auto space-y-6 overflow-hidden select-none font-sans"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#222934]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                      Add New Expense
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">
                      Enter expense details manually
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#222934] rounded-xl transition-colors"
                  id="add-expense-modal-close-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title Input */}
                <Input
                  label="Expense Title / Merchant"
                  placeholder="e.g. Starbucks, Petrol, Groceries..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  leftIcon={<Tag className="w-4 h-4" />}
                  required
                />

                {/* Amount & Date Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Amount Input */}
                  <Input
                    label="Amount (₹)"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    leftIcon={<IndianRupee className="w-4 h-4" />}
                    required
                  />

                  {/* Date Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-600 dark:text-[#9CA3AF]">
                      Transaction Date
                    </label>
                    <div className="relative flex items-center">
                      <Calendar className="w-4 h-4 absolute left-3.5 text-slate-400 dark:text-[#6B7280] pointer-events-none" />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#151A21] text-slate-900 dark:text-[#F3F4F6] text-sm rounded-xl border border-slate-200 dark:border-[#222934] pl-10 pr-4 py-2.5 outline-none focus:border-[#3B82F6]/50 focus:ring-2 focus:ring-[#3B82F6]/30 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Category & Payment Method Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-600 dark:text-[#9CA3AF]">
                      Category
                    </label>
                    <div className="relative flex items-center">
                      <Tag className="w-4 h-4 absolute left-3.5 text-slate-400 dark:text-[#6B7280] pointer-events-none" />
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#151A21] text-slate-900 dark:text-[#F3F4F6] text-xs rounded-xl border border-slate-200 dark:border-[#222934] pl-10 pr-4 py-2.5 outline-none focus:border-[#3B82F6]/50 focus:ring-2 focus:ring-[#3B82F6]/30 transition-all cursor-pointer"
                      >
                        {TOP_20_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat} className="bg-white dark:bg-[#151A21]">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Payment Method Dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-600 dark:text-[#9CA3AF]">
                      Payment Method
                    </label>
                    <div className="relative flex items-center">
                      <CreditCard className="w-4 h-4 absolute left-3.5 text-slate-400 dark:text-[#6B7280] pointer-events-none" />
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-full bg-slate-50 dark:bg-[#151A21] text-slate-900 dark:text-[#F3F4F6] text-xs rounded-xl border border-slate-200 dark:border-[#222934] pl-10 pr-4 py-2.5 outline-none focus:border-[#3B82F6]/50 focus:ring-2 focus:ring-[#3B82F6]/30 transition-all cursor-pointer"
                      >
                        {PAYMENT_METHODS.map((pm) => (
                          <option key={pm} value={pm} className="bg-white dark:bg-[#151A21]">
                            {pm}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notes Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-[#9CA3AF]">
                    Additional Notes (Optional)
                  </label>
                  <div className="relative flex items-start">
                    <FileText className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-[#6B7280] pointer-events-none" />
                    <textarea
                      rows={2}
                      placeholder="Add any extra details or tags..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#151A21] text-slate-900 dark:text-[#F3F4F6] placeholder-slate-400 dark:placeholder-[#4B5563] text-sm rounded-xl border border-slate-200 dark:border-[#222934] pl-10 pr-4 py-2.5 outline-none focus:border-[#3B82F6]/50 focus:ring-2 focus:ring-[#3B82F6]/30 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-[#222934] flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={onClose}
                    id="add-expense-modal-cancel-btn"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isSubmitting}
                    id="add-expense-modal-save-btn"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Expense'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
