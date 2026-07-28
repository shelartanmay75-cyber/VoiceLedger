import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Sparkles, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface MonthlyBudgetSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MonthlyBudgetSetupModal: React.FC<MonthlyBudgetSetupModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useData();
  const [budgetInput, setBudgetInput] = useState<string>(profile.monthlyBudget?.toString() || '40000');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const quickOptions = [25000, 40000, 60000, 100000];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericValue = parseFloat(budgetInput);
    if (isNaN(numericValue) || numericValue <= 0) return;

    setIsSaving(true);
    await updateProfile({
      monthlyBudget: numericValue,
      hasConfiguredBudget: true,
    });
    setIsSaving(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 relative"
        >
          {/* Top Decorative Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center space-y-2 relative z-10">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] p-3 flex items-center justify-center shadow-lg text-white">
              <Wallet className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome to VoiceLedger</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-[#F3F4F6]">
              Set Your Monthly Budget
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#9CA3AF] max-w-xs mx-auto">
              Tell us your target monthly spending limit so we can calculate your daily safe allowance and budget alerts.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-[#D1D5DB]">
                Monthly Spending Limit (₹)
              </label>
              <Input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="40000"
                leftIcon={<span className="text-sm font-bold text-slate-400">₹</span>}
                required
                min="1000"
                className="text-lg font-bold"
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400">Quick Presets:</span>
              <div className="grid grid-cols-4 gap-2">
                {quickOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setBudgetInput(opt.toString())}
                    className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      budgetInput === opt.toString()
                        ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                        : 'bg-slate-100 dark:bg-[#0B0F14] text-slate-700 dark:text-[#D1D5DB] border-slate-200 dark:border-[#222934] hover:border-[#3B82F6]/50'
                    }`}
                  >
                    ₹{(opt / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-lg shadow-[#3B82F6]/25"
              disabled={isSaving}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isSaving ? 'Saving...' : 'Save Budget & Get Started'}
            </Button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
