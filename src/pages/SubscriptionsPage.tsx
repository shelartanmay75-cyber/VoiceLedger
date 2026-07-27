import React from 'react';
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
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { mockSubscriptions } from '../data/mockFeatureData';

export const SubscriptionsPage: React.FC = () => {
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

  const totalMonthlyCost = mockSubscriptions
    .filter((s) => s.billingFrequency === 'Monthly')
    .reduce((acc, s) => acc + s.cost, 0);

  const totalYearlyCost = mockSubscriptions
    .filter((s) => s.billingFrequency === 'Yearly')
    .reduce((acc, s) => acc + s.cost, 0);

  return (
    <PageContainer
      title="Recurring Subscriptions & Reminders"
      subtitle="Track active digital subscriptions, renewal dates, and recurring monthly commitments."
      badge="Subscription Tracker"
      actionSlot={
        <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
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
                  {mockSubscriptions.length} Active Services
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
              {mockSubscriptions.map((sub) => (
                <Card key={sub.id} hoverable className="p-4 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl ${sub.logoColor} p-2 flex items-center justify-center shadow-md shrink-0`}>
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

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 uppercase">
                      {sub.status}
                    </span>
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
                {mockSubscriptions.map((sub) => (
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
    </PageContainer>
  );
};
