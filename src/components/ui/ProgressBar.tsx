import React from 'react';
import { motion } from 'framer-motion';

export interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  sublabel?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
  id?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  sublabel,
  color = 'primary',
  size = 'md',
  showPercentage = true,
  className = '',
  id,
}) => {
  const percentage = Math.min(100, Math.max(0, value));

  const colorStyles = {
    primary: 'bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA]',
    success: 'bg-gradient-to-r from-[#16A34A] to-[#22C55E]',
    warning: 'bg-gradient-to-r from-[#D97706] to-[#F59E0B]',
    danger: 'bg-gradient-to-r from-[#DC2626] to-[#EF4444]',
  };

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div id={id} className={`space-y-1.5 w-full font-sans ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-semibold text-slate-700 dark:text-[#D1D5DB]">{label}</span>}
          {showPercentage && <span className="font-bold text-slate-900 dark:text-[#F3F4F6]">{percentage}%</span>}
        </div>
      )}

      <div className={`w-full ${sizeStyles[size]} bg-slate-100 dark:bg-[#0B0F14] rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-[#222934]`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${colorStyles[color]} rounded-full shadow-sm`}
        />
      </div>

      {sublabel && (
        <div className="flex justify-end text-[10px] text-slate-400 dark:text-[#6B7280]">
          <span>{sublabel}</span>
        </div>
      )}
    </div>
  );
};
