import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  DollarSign,
  Store,
  Calendar,
  CreditCard,
  FileText,
  Tag,
  RotateCcw,
} from 'lucide-react';
import type { ExtractedExpense } from '../../types/voice';
import { EditableField } from './EditableField';
import { CategoryDropdown } from './CategoryDropdown';
import { Button } from '../ui/Button';

export interface ExpenseReviewCardProps {
  expense: ExtractedExpense;
  onUpdateExpense: (updated: ExtractedExpense) => void;
  onReset: () => void;
}

export const ExpenseReviewCard: React.FC<ExpenseReviewCardProps> = ({
  expense,
  onUpdateExpense,
  onReset,
}) => {
  const handleChange = (field: keyof ExtractedExpense, value: string | number) => {
    onUpdateExpense({
      ...expense,
      [field]: field === 'amount' ? Number(value) || 0 : value,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full bg-white dark:bg-[#151A21] rounded-2xl border border-slate-200 dark:border-[#222934] shadow-xl p-6 sm:p-8 space-y-6"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#222934]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22C55E]/20 to-[#10B981]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-[#F3F4F6] flex items-center gap-2">
              Expense Review Card
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Extracted
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#9CA3AF] mt-0.5">
              Review and edit any field before continuing.
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={onReset}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          id="expense-review-record-another-btn"
        >
          Record Another
        </Button>
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Expense Title */}
        <EditableField
          label="Expense Name"
          value={expense.title}
          onChange={(val) => handleChange('title', val)}
          icon={<Tag className="w-4 h-4" />}
          placeholder="e.g. Starbucks Coffee"
          id="review-field-title"
        />

        {/* Amount */}
        <EditableField
          label="Amount (₹)"
          type="number"
          value={expense.amount}
          onChange={(val) => handleChange('amount', val)}
          icon={<DollarSign className="w-4 h-4" />}
          placeholder="e.g. 250"
          id="review-field-amount"
        />

        {/* Merchant */}
        <EditableField
          label="Merchant / Store"
          value={expense.merchant}
          onChange={(val) => handleChange('merchant', val)}
          icon={<Store className="w-4 h-4" />}
          placeholder="e.g. Starbucks, Nike"
          id="review-field-merchant"
        />

        {/* Category Dropdown (Must always be an editable dropdown with all 20 categories) */}
        <CategoryDropdown
          value={expense.category}
          onChange={(newCat) => handleChange('category', newCat)}
          id="review-field-category"
        />

        {/* Date */}
        <EditableField
          label="Date"
          value={expense.date}
          onChange={(val) => handleChange('date', val)}
          icon={<Calendar className="w-4 h-4" />}
          placeholder="e.g. Today, Yesterday"
          id="review-field-date"
        />

        {/* Payment Method */}
        <EditableField
          label="Payment Method"
          value={expense.paymentMethod}
          onChange={(val) => handleChange('paymentMethod', val)}
          icon={<CreditCard className="w-4 h-4" />}
          placeholder="e.g. UPI, Credit Card, Cash"
          id="review-field-payment-method"
        />

        {/* Notes (Full width) */}
        <div className="sm:col-span-2">
          <EditableField
            label="Notes / Description"
            value={expense.notes}
            onChange={(val) => handleChange('notes', val)}
            icon={<FileText className="w-4 h-4" />}
            placeholder="Add optional details..."
            id="review-field-notes"
          />
        </div>
      </div>
    </motion.div>
  );
};
