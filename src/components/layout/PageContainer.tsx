import React from 'react';
import { motion } from 'framer-motion';

export interface PageContainerProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actionSlot?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  badge,
  actionSlot,
  children,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`space-y-6 ${className}`}
    >
      {/* Page Header Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#222934]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F4F6] tracking-tight font-sans">
              {title}
            </h1>
            {badge && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actionSlot && <div className="flex items-center gap-3 shrink-0">{actionSlot}</div>}
      </div>

      {/* Page Body Content */}
      <div>{children}</div>
    </motion.div>
  );
};
