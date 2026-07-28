import React from 'react';
import { Tag, ChevronDown } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../../types/voice';

export interface CategoryDropdownProps {
  value: string;
  onChange: (newCategory: string) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  value,
  onChange,
  disabled = false,
  id = 'voice-category-dropdown',
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-700 dark:text-[#9CA3AF]">
        Category <span className="text-[#3B82F6]">*</span>
      </label>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3B82F6] pointer-events-none">
          <Tag className="w-4 h-4" />
        </div>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-[#0B0F14] text-xs sm:text-sm font-semibold text-slate-900 dark:text-[#F3F4F6] border border-slate-200 dark:border-[#222934] rounded-xl focus:ring-2 focus:ring-[#3B82F6]/30 focus:border-[#3B82F6] outline-none transition-all cursor-pointer appearance-none disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {EXPENSE_CATEGORIES.map((category) => (
            <option
              key={category}
              value={category}
              className="bg-white dark:bg-[#151A21] text-slate-900 dark:text-[#F3F4F6] py-1"
            >
              {category}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#6B7280] pointer-events-none group-hover:text-[#3B82F6] transition-colors">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
