import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  id?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  id,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none font-sans';

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white shadow-md hover:shadow-lg shadow-[#3B82F6]/25 border border-transparent focus:ring-[#3B82F6]',
    secondary:
      'bg-slate-100 dark:bg-[#151A21] hover:bg-slate-200 dark:hover:bg-[#1C222C] text-slate-800 dark:text-[#F3F4F6] border border-slate-200 dark:border-[#222934] focus:ring-[#3B82F6]',
    outline:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-[#151A21] text-slate-700 dark:text-[#F3F4F6] border border-slate-300 dark:border-[#222934] focus:ring-[#3B82F6]',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-[#151A21] text-slate-600 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white border border-transparent focus:ring-[#3B82F6]',
    danger:
      'bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-md shadow-[#EF4444]/25 border border-transparent focus:ring-[#EF4444]',
    success:
      'bg-[#22C55E] hover:bg-[#16A34A] text-white shadow-md shadow-[#22C55E]/25 border border-transparent focus:ring-[#22C55E]',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      id={id}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children && <span>{children}</span>}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </motion.button>
  );
};
