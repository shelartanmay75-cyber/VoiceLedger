import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  isVisible: boolean;
  onClose: () => void;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  id?: string;
}

export const Toast: React.FC<ToastProps> = ({
  isVisible,
  onClose,
  message,
  type = 'success',
  title,
  id,
}) => {
  const config = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />,
      border: 'border-[#22C55E]/30',
      bg: 'bg-white dark:bg-[#151A21]',
    },
    error: {
      icon: <XCircle className="w-5 h-5 text-[#EF4444]" />,
      border: 'border-[#EF4444]/30',
      bg: 'bg-white dark:bg-[#151A21]',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />,
      border: 'border-[#F59E0B]/30',
      bg: 'bg-white dark:bg-[#151A21]',
    },
    info: {
      icon: <Info className="w-5 h-5 text-[#3B82F6]" />,
      border: 'border-[#3B82F6]/30',
      bg: 'bg-white dark:bg-[#151A21]',
    },
  };

  const current = config[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id={id}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`fixed bottom-6 right-6 z-50 max-w-sm ${current.bg} border ${current.border} rounded-2xl p-4 shadow-2xl flex items-start gap-3 select-none font-sans`}
        >
          <div className="shrink-0 mt-0.5">{current.icon}</div>
          <div className="flex-1 space-y-0.5">
            {title && (
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                {title}
              </h4>
            )}
            <p className="text-xs text-slate-600 dark:text-[#9CA3AF] leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
