import React from 'react';
import { motion } from 'framer-motion';
import {
  Coffee,
  Fuel,
  ShoppingCart,
  Tv,
  HeartPulse,
  Car,
  ShoppingBag,
  Film,
  Zap,
  GraduationCap,
  Dog,
  Briefcase,
  Edit2,
  Trash2,
  CreditCard,
  Smartphone,
  Banknote,
  Building,
  Tag,
} from 'lucide-react';
import type { Expense } from '../../types/expense';
import { formatExpenseDisplayDate } from '../../utils/dateUtils';

export interface ExpenseCardProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
  layoutMode?: 'grid' | 'table';
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onEdit,
  onDelete,
  layoutMode = 'grid',
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className="w-4 h-4 text-[#F97316]" />;
      case 'Fuel':
        return <Fuel className="w-4 h-4 text-[#3B82F6]" />;
      case 'ShoppingCart':
        return <ShoppingCart className="w-4 h-4 text-[#22C55E]" />;
      case 'Tv':
        return <Tv className="w-4 h-4 text-[#8B5CF6]" />;
      case 'HeartPulse':
        return <HeartPulse className="w-4 h-4 text-[#EF4444]" />;
      case 'Car':
        return <Car className="w-4 h-4 text-[#06B6D4]" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-4 h-4 text-[#EC4899]" />;
      case 'Film':
        return <Film className="w-4 h-4 text-[#F59E0B]" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-[#6366F1]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4 text-[#10B981]" />;
      case 'Dog':
        return <Dog className="w-4 h-4 text-[#A855F7]" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4 text-[#64748B]" />;
      default:
        return <Tag className="w-4 h-4 text-[#3B82F6]" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'UPI':
        return <Smartphone className="w-3 h-3 text-[#3B82F6]" />;
      case 'Credit Card':
      case 'Debit Card':
        return <CreditCard className="w-3 h-3 text-[#8B5CF6]" />;
      case 'Cash':
        return <Banknote className="w-3 h-3 text-[#22C55E]" />;
      case 'Net Banking':
        return <Building className="w-3 h-3 text-[#F59E0B]" />;
      default:
        return <CreditCard className="w-3 h-3 text-slate-400" />;
    }
  };

  if (layoutMode === 'table') {
    return (
      <tr className="border-b border-slate-100 dark:border-[#222934]/60 hover:bg-slate-50 dark:hover:bg-[#151A21]/80 transition-colors text-xs font-medium text-slate-800 dark:text-[#D1D5DB]">
        {/* Merchant & Icon */}
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#222934] shrink-0">
              {getCategoryIcon(expense.iconName)}
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-slate-900 dark:text-[#F3F4F6]">
                {expense.title}
              </span>
              {expense.notes && (
                <span className="text-[10px] text-slate-400 dark:text-[#6B7280] truncate max-w-xs mt-0.5">
                  {expense.notes}
                </span>
              )}
            </div>
          </div>
        </td>

        {/* Category Badge */}
        <td className="py-3.5 px-4">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${expense.categoryColor}`}
          >
            {expense.category}
          </span>
        </td>

        {/* Payment Method */}
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-[#9CA3AF]">
            {getPaymentMethodIcon(expense.paymentMethod)}
            <span className="text-[11px] font-semibold">{expense.paymentMethod}</span>
          </div>
        </td>

        {/* Date */}
        <td className="py-3.5 px-4 text-slate-500 dark:text-[#9CA3AF]">
          {formatExpenseDisplayDate(expense.isoDate, expense.date)}
        </td>

        {/* Amount */}
        <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 dark:text-[#F3F4F6] text-sm">
          -₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </td>

        {/* Action Buttons */}
        <td className="py-3.5 px-4 text-right">
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => onEdit?.(expense)}
              className="p-1.5 text-slate-400 hover:text-[#3B82F6] hover:bg-slate-200 dark:hover:bg-[#222934] rounded-lg transition-colors"
              title="Edit Expense (UI Only)"
              id={`edit-expense-btn-${expense.id}`}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete?.(expense.id)}
              className="p-1.5 text-slate-400 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors"
              title="Delete Expense (UI Only)"
              id={`delete-expense-btn-${expense.id}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] rounded-2xl p-4 shadow-sm hover:border-[#3B82F6]/40 transition-all duration-200 space-y-3 flex flex-col justify-between"
    >
      {/* Top Header: Icon, Category Badge & Actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#222934] shrink-0">
            {getCategoryIcon(expense.iconName)}
          </div>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${expense.categoryColor}`}
          >
            {expense.category}
          </span>
        </div>

        {/* Edit & Delete Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit?.(expense)}
            className="p-1.5 text-slate-400 hover:text-[#3B82F6] hover:bg-slate-100 dark:hover:bg-[#222934] rounded-lg transition-colors"
            title="Edit Expense (UI Only)"
            id={`card-edit-expense-btn-${expense.id}`}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete?.(expense.id)}
            className="p-1.5 text-slate-400 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors"
            title="Delete Expense (UI Only)"
            id={`card-delete-expense-btn-${expense.id}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Middle: Title & Notes */}
      <div className="space-y-1 text-left">
        <h4 className="text-sm font-bold text-slate-900 dark:text-[#F3F4F6] line-clamp-1">
          {expense.title}
        </h4>
        {expense.notes && (
          <p className="text-xs text-slate-500 dark:text-[#9CA3AF] line-clamp-2">
            {expense.notes}
          </p>
        )}
      </div>

      {/* Bottom Footer: Date, Payment Method & Amount */}
      <div className="pt-3 border-t border-slate-100 dark:border-[#222934]/60 flex items-center justify-between">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1 text-slate-500 dark:text-[#9CA3AF] text-[11px]">
            {getPaymentMethodIcon(expense.paymentMethod)}
            <span>{expense.paymentMethod}</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-[#6B7280]">
            {formatExpenseDisplayDate(expense.isoDate, expense.date)}
          </span>
        </div>

        <div className="text-right">
          <span className="text-base font-extrabold text-slate-900 dark:text-[#F3F4F6]">
            -₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
