import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Cpu } from 'lucide-react';

export const ProcessingLoader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white dark:bg-[#151A21] border border-[#3B82F6]/30 shadow-2xl text-center space-y-4 relative overflow-hidden"
    >
      {/* Background Subtle Pulsing Blur */}
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.8, 1.2, 0.8] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#3B82F6]/15 rounded-full blur-2xl pointer-events-none"
      />

      <div className="relative z-10 flex justify-center items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2563EB] via-[#3B82F6] to-[#60A5FA] p-0.5 shadow-lg flex items-center justify-center"
        >
          <div className="w-full h-full bg-[#0B0F14] rounded-[14px] flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-[#3B82F6]" />
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 space-y-1.5">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-[#F3F4F6] flex items-center justify-center gap-2">
          Analyzing your expense...
        </h3>
        <p className="text-xs text-slate-500 dark:text-[#9CA3AF] flex items-center justify-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-[#3B82F6]" />
          Extracting title, merchant, amount & category via Gemini AI
        </p>
      </div>

      {/* Animated Wave Indicator */}
      <div className="relative z-10 flex justify-center items-center gap-1.5 pt-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            animate={{ height: ['8px', '24px', '8px'] }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
            className="w-1.5 bg-[#3B82F6] rounded-full"
          />
        ))}
      </div>

      <div className="relative z-10 pt-1">
        <span className="text-[10px] font-mono text-[#3B82F6] bg-[#3B82F6]/10 px-2.5 py-0.5 rounded-full border border-[#3B82F6]/20 inline-flex items-center gap-1">
          <Cpu className="w-3 h-3" /> Voice Ledger AI Model • Active
        </span>
      </div>
    </motion.div>
  );
};
