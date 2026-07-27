import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  accentBorder?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  accentBorder = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white dark:bg-[#151A21] border ${
        accentBorder ? 'border-[#3B82F6]/40' : 'border-slate-200 dark:border-[#222934]'
      } rounded-2xl p-5 shadow-sm dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.4)] transition-all duration-300 ${
        hoverable
          ? 'hover:border-slate-300 dark:hover:border-[#2C3544] hover:shadow-md dark:hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-0.5'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <h3
      className={`text-lg font-semibold text-slate-900 dark:text-[#F3F4F6] tracking-tight flex items-center gap-2 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <p className={`text-xs text-slate-500 dark:text-[#9CA3AF] leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`text-sm text-slate-700 dark:text-[#D1D5DB] ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`mt-5 pt-4 border-t border-slate-100 dark:border-[#222934]/60 flex items-center justify-between text-xs text-slate-500 dark:text-[#9CA3AF] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
