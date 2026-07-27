import React from 'react';
import { Search, X, Command } from 'lucide-react';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  id,
}) => {
  return (
    <div className={`relative flex items-center w-full group ${className}`}>
      <Search className="w-4 h-4 absolute left-3.5 text-slate-400 dark:text-[#6B7280] group-focus-within:text-[#3B82F6] transition-colors pointer-events-none" />
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 dark:bg-[#151A21] text-slate-900 dark:text-[#F3F4F6] placeholder-slate-400 dark:placeholder-[#4B5563] text-sm rounded-xl border border-slate-200 dark:border-[#222934] pl-10 pr-10 py-2.5 outline-none focus:border-[#3B82F6]/50 focus:ring-2 focus:ring-[#3B82F6]/30 transition-all font-sans"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : (
        <div className="absolute right-3 flex items-center gap-0.5 text-[10px] text-slate-400 dark:text-[#6B7280] bg-slate-200/60 dark:bg-[#0B0F14] px-1.5 py-0.5 rounded border border-slate-200 dark:border-[#222934] pointer-events-none">
          <Command className="w-2.5 h-2.5" />
          <span>K</span>
        </div>
      )}
    </div>
  );
};
