import React from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  id?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  id,
}) => {
  return (
    <div
      id={id}
      className={`flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#0B0F14] rounded-2xl border border-slate-200 dark:border-[#222934] font-sans ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors select-none ${
              isActive
                ? 'text-[#3B82F6]'
                : 'text-slate-500 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                transition={{ type: 'spring', duration: 0.3, damping: 25, stiffness: 300 }}
                className="absolute inset-0 bg-white dark:bg-[#151A21] rounded-xl shadow-sm border border-slate-200/60 dark:border-[#222934]"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-[#3B82F6]/10 text-[#3B82F6]">
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
