import React from 'react';
import { Plane, Plus, MapPin, Calendar, Users, Receipt, Wallet, Compass } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { mockTrips } from '../data/mockFeatureData';

export const TripsPage: React.FC = () => {
  return (
    <PageContainer
      title="Trip Expenses & Travel Budgets"
      subtitle="Organize vacation budgets, group itineraries, and track shared travel expenses."
      badge="Travel Ledger"
      actionSlot={
        <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
          Create New Trip
        </Button>
      }
    >
      <div className="space-y-6">
        {/* ------------------------------------------------------------- */}
        {/* 1. TRIP SUMMARY METRICS BANNER                                */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card accentBorder hoverable className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Active Trips</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6] mt-0.5">
                  1 Active / 1 Upcoming
                </p>
              </div>
            </div>
          </Card>

          <Card hoverable className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Total Travel Spend</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6] mt-0.5">
                  ₹29,900
                </p>
              </div>
            </div>
          </Card>

          <Card hoverable className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Active Travelers</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6] mt-0.5">
                  7 Friends
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. TRIPS LIST & EXPENSES BREAKDOWN                            */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-6">
          {mockTrips.map((trip) => {
            const spentPct = Math.round((trip.totalSpent / trip.totalBudget) * 100);

            return (
              <Card key={trip.id} hoverable className="p-0 overflow-hidden space-y-0">
                {/* Trip Header Banner Graphic */}
                <div
                  className={`p-6 bg-gradient-to-r ${trip.coverGradient} text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white/20 backdrop-blur-md text-white border border-white/30">
                        {trip.status}
                      </span>
                      <span className="text-xs font-medium opacity-90 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {trip.location}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                      {trip.title}
                    </h3>
                    <p className="text-xs opacity-90 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" /> {trip.startDate} - {trip.endDate} • {trip.travelersCount} Travelers
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-right shrink-0">
                    <span className="text-xs opacity-80 block">Trip Budget</span>
                    <span className="text-xl font-extrabold">
                      ₹{trip.totalSpent.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs opacity-80 block">
                      of ₹{trip.totalBudget.toLocaleString('en-IN')} ({spentPct}%)
                    </span>
                  </div>
                </div>

                {/* Trip Expenses List */}
                <CardContent className="p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-[#D1D5DB] uppercase tracking-wider flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#3B82F6]" />
                    Trip Itemized Expenses
                  </h4>

                  <div className="space-y-2">
                    {trip.expensesList.map((te) => (
                      <div
                        key={te.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F14]/60 border border-slate-200/80 dark:border-[#222934]/60 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934]">
                            <Plane className="w-4 h-4 text-[#3B82F6]" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6]">
                              {te.description}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              Paid by {te.paidBy} • {te.date}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                          ₹{te.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
};
