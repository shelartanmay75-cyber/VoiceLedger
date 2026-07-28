import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  IndianRupee,
  Store,
  Calendar,
  CreditCard,
  FileText,
  Tag,
  RotateCcw,
  Plus,
  Loader2,
  Mic,
} from 'lucide-react';
import type { ExtractedExpense } from '../../types/voice';
import { EditableField } from './EditableField';
import { CategoryDropdown } from './CategoryDropdown';
import { Button } from '../ui/Button';

export interface ExpenseReviewCardProps {
  expense: ExtractedExpense;
  onUpdateExpense: (updated: ExtractedExpense) => void;
  onSaveExpense: (expense: ExtractedExpense) => void;
  onReset: () => void;
  onReRecord?: () => void;
  isSaving?: boolean;
}

/**
 * Converts relative or freeform date strings (e.g., "Today", "Yesterday", "25 July", "25th July 2026") into ISO YYYY-MM-DD format for HTML5 calendar picker
 */
function toISODateString(dateStr: string): string {
  const lower = (dateStr || '').toLowerCase().trim();
  const today = new Date();
  const currentYear = today.getFullYear();

  if (lower === 'today' || !lower) {
    return today.toISOString().split('T')[0];
  }
  if (lower === 'yesterday') {
    const yest = new Date(today.getTime() - 86400000);
    return yest.toISOString().split('T')[0];
  }

  // Strip ordinal suffixes e.g. 25th -> 25
  const cleanStr = dateStr.replace(/(\d+)(st|nd|rd|th)/i, '$1');
  let parsed = new Date(cleanStr);

  // If year is omitted (e.g., "25 July"), append current year
  if (isNaN(parsed.getTime())) {
    parsed = new Date(`${cleanStr} ${currentYear}`);
  }

  if (!isNaN(parsed.getTime())) {
    const yyyy = parsed.getFullYear();
    const mm = String(parsed.getMonth() + 1).padStart(2, '0');
    const dd = String(parsed.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  return today.toISOString().split('T')[0];
}

export const ExpenseReviewCard: React.FC<ExpenseReviewCardProps> = ({
  expense,
  onUpdateExpense,
  onSaveExpense,
  onReset,
  onReRecord,
  isSaving = false,
}) => {
  const handleChange = (field: keyof ExtractedExpense, value: string | number) => {
    onUpdateExpense({
      ...expense,
      [field]: field === 'amount' ? Number(value) || 0 : value,
    });
  };

  const isoDateValue = toISODateString(expense.date);

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
              Review, edit fields, and save to your expense ledger.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onReRecord && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReRecord}
              leftIcon={<Mic className="w-3.5 h-3.5 text-[#3B82F6]" />}
              id="expense-review-rerecord-btn-header"
            >
              Re-speak / Re-record
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            id="expense-review-record-another-btn"
          >
            Reset Card
          </Button>
        </div>
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Expense Title */}
        <EditableField
          label="Expense Name"
          value={expense.title}
          onChange={(val) => handleChange('title', val)}
          icon={<Tag className="w-4 h-4" />}
          placeholder="e.g. Burger, Starbucks Coffee"
          id="review-field-title"
        />

        {/* Amount */}
        <EditableField
          label="Amount (₹)"
          type="number"
          value={expense.amount}
          onChange={(val) => handleChange('amount', val)}
          icon={<IndianRupee className="w-4 h-4" />}
          placeholder="e.g. 250"
          id="review-field-amount"
        />

        {/* Merchant */}
        <EditableField
          label="Merchant / Store"
          value={expense.merchant}
          onChange={(val) => handleChange('merchant', val)}
          icon={<Store className="w-4 h-4" />}
          placeholder="e.g. McDonald's, Starbucks, Nike"
          id="review-field-merchant"
        />

        {/* Category Dropdown */}
        <CategoryDropdown
          value={expense.category}
          onChange={(newCat) => handleChange('category', newCat)}
          id="review-field-category"
        />

        {/* Interactive Calendar Date Picker */}
        <div className="space-y-1.5">
          <label htmlFor="review-field-date" className="block text-xs font-semibold text-slate-700 dark:text-[#9CA3AF]">
            Date (Calendar Picker)
          </label>
          <div className="relative group cursor-pointer" onClick={() => {
            const inputEl = document.getElementById('review-field-date') as HTMLInputElement;
            if (inputEl) {
              try { if ('showPicker' in inputEl) (inputEl as any).showPicker(); } catch (_) {}
            }
          }}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3B82F6] pointer-events-none">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              id="review-field-date"
              type="date"
              value={isoDateValue}
              onChange={(e) => {
                const selectedVal = e.target.value;
                if (selectedVal) {
                  const d = new Date(selectedVal);
                  const formatted = d.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });
                  handleChange('date', formatted);
                }
              }}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#0B0F14] text-xs sm:text-sm font-semibold text-slate-900 dark:text-[#F3F4F6] border border-slate-200 dark:border-[#222934] rounded-xl focus:ring-2 focus:ring-[#3B82F6]/30 focus:border-[#3B82F6] outline-none transition-all cursor-pointer"
            />
          </div>
          <span className="text-[10px] text-slate-400 dark:text-[#6B7280]">
            Selected: <span className="font-semibold text-slate-700 dark:text-[#D1D5DB]">{expense.date || 'Today'}</span>
          </span>
        </div>

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

      {/* Action Footer Buttons */}
      <div className="pt-4 border-t border-slate-200 dark:border-[#222934] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onReRecord && (
            <Button
              variant="outline"
              size="md"
              onClick={onReRecord}
              leftIcon={<Mic className="w-4 h-4 text-[#3B82F6]" />}
              className="w-full sm:w-auto"
              id="expense-review-rerecord-btn-footer"
            >
              Re-speak / Re-record
            </Button>
          )}
          <Button
            variant="secondary"
            size="md"
            onClick={onReset}
            leftIcon={<RotateCcw className="w-4 h-4" />}
            className="w-full sm:w-auto"
            id="expense-review-record-another-btn-footer"
          >
            Reset
          </Button>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => onSaveExpense(expense)}
          disabled={isSaving || !expense.title || expense.amount <= 0}
          leftIcon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          className="w-full sm:w-auto shadow-lg shadow-[#3B82F6]/25 font-bold"
          id="expense-review-add-expense-btn"
        >
          {isSaving ? 'Saving Expense...' : 'Add Expense to Ledger'}
        </Button>
      </div>
    </motion.div>
  );
};
