import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
  id?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
  className = '',
  id,
}) => {
  const baseStyles = 'inline-flex items-center gap-1 font-bold rounded-full select-none font-sans';

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 dark:bg-[#222934] dark:text-[#9CA3AF] border border-slate-200 dark:border-[#2C3544]',
    primary: 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30',
    success: 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30',
    warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30',
    danger: 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30',
    info: 'bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/30',
    outline: 'bg-transparent text-slate-700 dark:text-[#F3F4F6] border border-slate-300 dark:border-[#222934]',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.2',
    md: 'text-xs px-2.5 py-0.5',
  };

  return (
    <span id={id} className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
