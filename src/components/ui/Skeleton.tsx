import React from 'react';

export interface SkeletonProps {
  variant?: 'text' | 'avatar' | 'card' | 'rect';
  width?: string;
  height?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
}) => {
  const baseStyles = 'bg-slate-200 dark:bg-[#222934] animate-pulse';

  if (variant === 'avatar') {
    return (
      <div
        className={`${baseStyles} rounded-full shrink-0 ${width || 'w-10'} ${height || 'h-10'} ${className}`}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={`bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] rounded-2xl p-4 space-y-3 animate-pulse ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-[#222934]" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 bg-slate-200 dark:bg-[#222934] rounded w-1/2" />
            <div className="h-3 bg-slate-200 dark:bg-[#222934] rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ width, height }}
      className={`${baseStyles} ${variant === 'text' ? 'h-4 rounded-md w-full' : 'rounded-xl'} ${className}`}
    />
  );
};
