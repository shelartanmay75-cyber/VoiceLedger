import React from 'react';
import { Calendar } from 'lucide-react';

export interface DatePickerUIProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  className?: string;
  id?: string;
}

export const DatePickerUI: React.FC<DatePickerUIProps> = ({
  value,
  onChange,
  label = 'Date',
  className = '',
  id,
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full font-sans ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 dark:text-[#D1D5DB] select-none">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <Calendar className="w-4 h-4 absolute left-3.5 text-slate-400 dark:text-[#6B7280] pointer-events-none" />
        <input
          id={id}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 dark:bg-[#151A21] text-slate-900 dark:text-[#F3F4F6] text-xs font-medium rounded-xl border border-slate-200 dark:border-[#222934] pl-10 pr-4 py-2.5 outline-none focus:border-[#3B82F6]/50 focus:ring-2 focus:ring-[#3B82F6]/30 transition-all cursor-pointer"
        />
      </div>
    </div>
  );
};
