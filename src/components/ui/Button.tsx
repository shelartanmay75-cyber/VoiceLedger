import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-[#3B82F6] text-white hover:bg-[#2563EB] shadow-[0_4px_14px_0_rgba(59,130,246,0.35)] hover:shadow-[0_6px_20px_0_rgba(59,130,246,0.45)] border border-[#3B82F6]/20',
      secondary:
        'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200/80 dark:bg-[#151A21] dark:text-[#F3F4F6] dark:hover:bg-[#1C222C] dark:border-[#222934] dark:hover:border-[#2C3544]',
      outline:
        'bg-transparent text-slate-800 border border-slate-200 hover:bg-slate-100 hover:border-[#3B82F6]/40 hover:text-[#3B82F6] dark:text-[#F3F4F6] dark:border-[#222934] dark:hover:bg-[#151A21] dark:hover:border-[#3B82F6]/40 dark:hover:text-[#3B82F6]',
      ghost:
        'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-[#9CA3AF] dark:hover:text-[#F3F4F6] dark:hover:bg-[#151A21]/60',
      danger:
        'bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-[0_4px_14px_0_rgba(239,68,68,0.35)] border border-[#EF4444]/20',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2.5',
      icon: 'p-2.5 aspect-square',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        disabled={disabled}
        {...props}
      >
        {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        {children && <span>{children}</span>}
        {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
