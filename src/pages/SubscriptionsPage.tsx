import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarClock,
  Plus,
  Tv,
  Music,
  Sparkles,
  ShoppingBag,
  Cloud,
  Clock,
  Calendar,
  CheckCircle2,
  X,
  IndianRupee,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useData } from '../context/DataContext';

export const SubscriptionsPage: React.FC = () => {
  const { subscriptions, addSubscription, toggleSubscriptionStatus } = useData();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Subscription Form state
  const [subName, setSubName] = useState('');
  const [subCategory, setSubCategory] = useState('Entertainment');
  const [subCost, setSubCost] = useState('');
  const [subFrequency, setSubFrequency] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [nextRenewalDate, setNextRenewalDate] = useState('15 Aug 2026');
  const [nextRenewalDateIso, setNextRenewalDateIso] = useState('2026-08-15');

  const handleCreateSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName || !subCost) return;

    await addSubscription({
      name: subName,
      category: subCategory,
      billingFrequency: subFrequency,
      cost: parseFloat(subCost),
      nextRenewalDate,
      status: 'active',
      logoColor: 'bg-[#3B82F6]',
      iconName: 'Tv',
    });

    setSubName('');
    setSubCost('');
    setIsAddModalOpen(false);
  };

  const getSubIcon = (iconName: string) => {
    switch (iconName) {
      case 'Tv':
        return <Tv className="w-5 h-5 text-white" />;
      case 'Music':
        return <Music className="w-5 h-5 text-white" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-white" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-white" />;
      case 'Cloud':
        return <Cloud className="w-5 h-5 text-white" />;
      default:
        return <CalendarClock className="w-5 h-5 text-white" />;
    }
  };

  const totalMonthlyCost = subscriptions
    .filter((s) => s.billingFrequency === 'Monthly')
    .reduce((acc, s) => acc + s.cost, 0);

  const totalYearlyCost = subscriptions
    .filter((s) => s.billingFrequency === 'Yearly')
    .reduce((acc, s) => acc + s.cost, 0);

  return (
    <PageContainer
      title="Recurring Subscriptions & Reminders"
      subtitle="Track active digital subscriptions, renewal dates, and recurring monthly commitments."
      badge="Subscription Tracker"
      actionSlot={
        <Button variant="primary" size="md" onClick={() => setIsAddModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Add Subscription
        </Button>
      }
    >
      <div className="space-y-6">
        {/* ------------------------------------------------------------- */}
        {/* 1. MONTHLY COST SUMMARY CARDS                                 */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card accentBorder hoverable className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
                <CalendarClock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Active Subscriptions</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6] mt-0.5">
                  {subscriptions.length} Active Services
                </p>
              </div>
            </div>
          </Card>

          <Card hoverable className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Monthly Recurring Cost</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6] mt-0.5">
                  ₹{totalMonthlyCost.toLocaleString('en-IN')} / mo
                </p>
              </div>
            </div>
          </Card>

          <Card hoverable className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Yearly Subscriptions</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6] mt-0.5">
                  ₹{totalYearlyCost.toLocaleString('en-IN')} / yr
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. SUBSCRIPTION CARDS GRID & RENEWAL TIMELINE                 */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Subscription Cards Grid (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-[#F3F4F6] tracking-tight">
              Active Digital Subscriptions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subscriptions.map((sub) => (
                <Card key={sub.id} hoverable className="p-4 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl ${sub.logoColor || 'bg-[#3B82F6]'} p-2 flex items-center justify-center shadow-md shrink-0`}>
                        {getSubIcon(sub.iconName)}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6]">
                          {sub.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {sub.category}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSubscriptionStatus(sub.id, sub.status)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase cursor-pointer ${
                        sub.status === 'active'
                          ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30'
                          : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30'
                      }`}
                    >
                      {sub.status}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F14]/60 border border-slate-200/80 dark:border-[#222934]/60 flex items-center justify-between">
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] text-slate-400">Next Renewal</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-[#F3F4F6]">
                        {sub.nextRenewalDate}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                        ₹{sub.cost.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        /{sub.billingFrequency === 'Monthly' ? 'mo' : 'yr'}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Upcoming Renewal Timeline (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-[#F3F4F6] tracking-tight">
              Upcoming Renewal Calendar
            </h2>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-[#3B82F6]" />
                  Next 30 Days Renewals
                </CardTitle>
                <CardDescription>Automated renewal payment alerts</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F14]/60 border border-slate-200/80 dark:border-[#222934]/60 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934]">
                        <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6]">
                          {sub.name}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          Renews on {sub.nextRenewalDate}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                      ₹{sub.cost}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ADD SUBSCRIPTION MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#222934]">
                <h3 className="text-lg font-bold text-slate-900 dark:text-[#F3F4F6]">Add Subscription</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreateSub} className="space-y-4">
                <Input label="Service Name" placeholder="e.g. Netflix, Spotify" value={subName} onChange={(e) => setSubName(e.target.value)} required />
                <Input label="Category" placeholder="Entertainment, Cloud, Music" value={subCategory} onChange={(e) => setSubCategory(e.target.value)} />
                <Input label="Cost (₹)" type="number" placeholder="649" value={subCost} onChange={(e) => setSubCost(e.target.value)} leftIcon={<IndianRupee className="w-4 h-4" />} required />
                <div className="flex items-center gap-4">
                  <label className="text-xs text-slate-500 font-medium">Frequency:</label>
                  <button type="button" onClick={() => setSubFrequency('Monthly')} className={`px-3 py-1 text-xs rounded-xl border ${subFrequency === 'Monthly' ? 'bg-[#3B82F6] text-white border-[#3B82F6]' : 'text-slate-400 border-slate-200'}`}>Monthly</button>
                  <button type="button" onClick={() => setSubFrequency('Yearly')} className={`px-3 py-1 text-xs rounded-xl border ${subFrequency === 'Yearly' ? 'bg-[#3B82F6] text-white border-[#3B82F6]' : 'text-slate-400 border-slate-200'}`}>Yearly</button>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-[#9CA3AF]">Next Renewal Date (Calendar Picker)</label>
                  <div className="relative flex items-center cursor-pointer" onClick={(e) => {
                    const input = e.currentTarget.querySelector('input');
                    if (input) {
                      try { if ('showPicker' in input) (input as any).showPicker(); } catch (_) {}
                    }
                  }}>
                    <Calendar className="w-4 h-4 absolute left-3.5 text-[#3B82F6] pointer-events-none" />
                    <input
                      type="date"
                      value={nextRenewalDateIso}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNextRenewalDateIso(val);
                        if (val) {
                          const d = new Date(val);
                          const formatted = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                          setNextRenewalDate(formatted);
                        }
                      }}
                      className="w-full bg-slate-50 dark:bg-[#151A21] text-slate-900 dark:text-[#F3F4F6] text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 dark:border-[#222934] pl-10 pr-4 py-2.5 outline-none focus:border-[#3B82F6]/50 focus:ring-2 focus:ring-[#3B82F6]/30 transition-all cursor-pointer"
                    />
                  </div>
                </div>
                <div className="pt-3 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="primary">Save Subscription</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};
