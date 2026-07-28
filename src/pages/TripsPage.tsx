import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Plus, MapPin, Calendar, Users, Receipt, Wallet, Compass, X, IndianRupee } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useData } from '../context/DataContext';

export const TripsPage: React.FC = () => {
  const { trips, addTrip, addTripExpense } = useData();
  const [isAddTripModalOpen, setIsAddTripModalOpen] = useState(false);
  const [activeTripForExpense, setActiveTripForExpense] = useState<string | null>(null);

  // New Trip state
  const [tripTitle, setTripTitle] = useState('');
  const [tripLocation, setTripLocation] = useState('');
  const [tripBudget, setTripBudget] = useState('');
  const [startDate, setStartDate] = useState('15 Nov 2026');
  const [endDate, setEndDate] = useState('20 Nov 2026');

  // New Trip Expense state
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Food');
  const [paidBy, setPaidBy] = useState('You');

  const totalTravelSpent = trips.reduce((acc, t) => acc + (t.totalSpent || 0), 0);

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripTitle || !tripBudget) return;

    await addTrip({
      title: tripTitle,
      location: tripLocation || 'Vacation',
      startDate,
      endDate,
      totalBudget: parseFloat(tripBudget),
      status: 'active',
      travelersCount: 4,
      coverGradient: 'from-[#06B6D4] to-[#3B82F6]',
    });

    setTripTitle('');
    setTripBudget('');
    setIsAddTripModalOpen(false);
  };

  const handleAddExpenseToTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTripForExpense || !expenseDesc || !expenseAmount) return;

    await addTripExpense(activeTripForExpense, {
      description: expenseDesc,
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
      paidBy,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    });

    setExpenseDesc('');
    setExpenseAmount('');
    setActiveTripForExpense(null);
  };
  return (
    <PageContainer
      title="Trip Expenses & Travel Budgets"
      subtitle="Organize vacation budgets, group itineraries, and track shared travel expenses."
      badge="Travel Ledger"
      actionSlot={
        <Button variant="primary" size="md" onClick={() => setIsAddTripModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
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
                  {trips.length} Destinations
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
                  ₹{totalTravelSpent.toLocaleString('en-IN')}
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
                  Group Sync
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. TRIPS LIST & EXPENSES BREAKDOWN                            */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-6">
          {trips.map((trip) => {
            const spentPct = Math.min(100, Math.round(((trip.totalSpent || 0) / (trip.totalBudget || 1)) * 100));

            return (
              <Card key={trip.id} hoverable className="p-0 overflow-hidden space-y-0">
                {/* Trip Header Banner Graphic */}
                <div
                  className={`p-6 bg-gradient-to-r ${trip.coverGradient || 'from-[#06B6D4] to-[#3B82F6]'} text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
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

                  <div className="flex items-center gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setActiveTripForExpense(trip.id)}
                    >
                      + Add Trip Expense
                    </Button>
                    <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-right shrink-0">
                      <span className="text-xs opacity-80 block">Trip Budget</span>
                      <span className="text-xl font-extrabold">
                        ₹{(trip.totalSpent || 0).toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs opacity-80 block">
                        of ₹{(trip.totalBudget || 0).toLocaleString('en-IN')} ({spentPct}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trip Expenses List */}
                <CardContent className="p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-[#D1D5DB] uppercase tracking-wider flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#3B82F6]" />
                    Trip Itemized Expenses
                  </h4>

                  <div className="space-y-2">
                    {(trip.expensesList || []).map((te) => (
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

      {/* CREATE TRIP MODAL */}
      <AnimatePresence>
        {isAddTripModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddTripModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#222934]">
                <h3 className="text-lg font-bold text-slate-900 dark:text-[#F3F4F6]">Create New Trip</h3>
                <button onClick={() => setIsAddTripModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreateTrip} className="space-y-4">
                <Input label="Trip Title" placeholder="e.g. Goa Vacation, Manali Trek" value={tripTitle} onChange={(e) => setTripTitle(e.target.value)} required />
                <Input label="Destination / Location" placeholder="e.g. Goa, India" value={tripLocation} onChange={(e) => setTripLocation(e.target.value)} />
                <Input label="Total Budget (₹)" type="number" placeholder="35000" value={tripBudget} onChange={(e) => setTripBudget(e.target.value)} leftIcon={<IndianRupee className="w-4 h-4" />} required />
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  <Input label="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="pt-3 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsAddTripModalOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="primary">Create Trip</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD TRIP EXPENSE MODAL */}
      <AnimatePresence>
        {activeTripForExpense && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveTripForExpense(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#222934]">
                <h3 className="text-lg font-bold text-slate-900 dark:text-[#F3F4F6]">Add Trip Expense</h3>
                <button onClick={() => setActiveTripForExpense(null)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddExpenseToTrip} className="space-y-4">
                <Input label="Description" placeholder="e.g. Scooter Rental, Hotel Stay" value={expenseDesc} onChange={(e) => setExpenseDesc(e.target.value)} required />
                <Input label="Amount (₹)" type="number" placeholder="1200" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} leftIcon={<IndianRupee className="w-4 h-4" />} required />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-[#9CA3AF]">Category</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#151A21] text-slate-900 dark:text-[#F3F4F6] text-xs rounded-xl border border-slate-200 dark:border-[#222934] px-3 py-2.5 outline-none cursor-pointer"
                  >
                    <option value="Food">Food & Dining</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Transport">Transport</option>
                    <option value="Equipment">Equipment</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <Input label="Paid By" placeholder="You, Rahul..." value={paidBy} onChange={(e) => setPaidBy(e.target.value)} />
                <div className="pt-3 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setActiveTripForExpense(null)}>Cancel</Button>
                  <Button type="submit" variant="primary">Add Expense</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

