import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      leftIcon,
      rightIcon,
      error,
      helperText,
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-slate-600 dark:text-[#9CA3AF] flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 dark:text-[#6B7280] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`w-full bg-slate-50 dark:bg-[#151A21] text-slate-900 dark:text-[#F3F4F6] placeholder-slate-400 dark:placeholder-[#4B5563] text-sm rounded-xl border ${
              error
                ? 'border-[#EF4444] focus:ring-[#EF4444]/40'
                : 'border-slate-200 dark:border-[#222934] focus:border-[#3B82F6]/50 focus:ring-[#3B82F6]/30'
            } ${leftIcon ? 'pl-10' : 'pl-4'} ${
              rightIcon ? 'pr-10' : 'pr-4'
            } py-2.5 outline-none focus:ring-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 text-slate-400 dark:text-[#6B7280] flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <span className="text-xs text-[#EF4444] font-medium mt-0.5">{error}</span>}

        {helperText && !error && (
          <span className="text-xs text-slate-500 dark:text-[#6B7280] mt-0.5">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
