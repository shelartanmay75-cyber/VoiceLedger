import React from 'react';
import { Tag } from 'lucide-react';

export interface ExpenseTagProps {
  label: string;
  colorClass?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const ExpenseTag: React.FC<ExpenseTagProps> = ({
  label,
  colorClass = 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30',
  icon,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${colorClass} ${className}`}
    >
      {icon || <Tag className="w-3 h-3" />}
      <span>{label}</span>
    </span>
  );
};
