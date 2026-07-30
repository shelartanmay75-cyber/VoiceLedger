import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Plus, MapPin, Calendar, Receipt, Wallet, Compass, X, IndianRupee, Trash2 } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useData } from '../context/DataContext';

export const TripsPage: React.FC = () => {
  const { trips, addTrip, depositToTrip, deleteTrip, addTripExpense } = useData();
  const [isAddTripModalOpen, setIsAddTripModalOpen] = useState(false);
  const [activeTripForExpense, setActiveTripForExpense] = useState<string | null>(null);

  // Deposit funds state
  const [depositTripId, setDepositTripId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  // New Trip state
  const [tripTitle, setTripTitle] = useState('');
  const [tripLocation, setTripLocation] = useState('');
  const [tripBudget, setTripBudget] = useState('');
  const [startDate, setStartDate] = useState('15 Nov 2026');
  const [startDateIso, setStartDateIso] = useState('2026-11-15');
  const [endDate, setEndDate] = useState('20 Nov 2026');
  const [endDateIso, setEndDateIso] = useState('2026-11-20');

  // New Trip Expense state
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Food');
  const [paidBy, setPaidBy] = useState('You');

  const totalTravelSpent = trips.reduce((acc, t) => acc + (t.totalSpent || 0), 0);
  const totalTravelSaved = trips.reduce((acc, t) => acc + (t.savedAmount || 0), 0);

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripTitle || !tripBudget) return;

    try {
      await addTrip({
        title: tripTitle,
        location: tripLocation || 'Vacation',
        startDate,
        endDate,
        totalBudget: parseFloat(tripBudget),
        savedAmount: 0,
        status: 'active',
        travelersCount: 4,
        coverGradient: 'from-[#06B6D4] to-[#3B82F6]',
      });
    } catch (err) {
      console.warn('Error creating trip:', err);
    } finally {
      setTripTitle('');
      setTripBudget('');
      setTripLocation('');
      setIsAddTripModalOpen(false);
    }
  };

  const handleDepositToTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositTripId || !depositAmount) return;

    await depositToTrip(depositTripId, parseFloat(depositAmount));
    setDepositTripId(null);
    setDepositAmount('');
  };

  const handleDeleteTrip = async (tripId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the trip "${title}"?`)) {
      await deleteTrip(tripId);
    }
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
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Total Travel Funds Saved</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6] mt-0.5">
                  ₹{totalTravelSaved.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </Card>

          <Card hoverable className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Total Travel Spend</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6] mt-0.5">
                  ₹{totalTravelSpent.toLocaleString('en-IN')}
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
            const savedPct = Math.min(100, Math.round(((trip.savedAmount || 0) / (trip.totalBudget || 1)) * 100));
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

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setDepositTripId(trip.id)}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                    >
                      + Add Funds / Deposit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setActiveTripForExpense(trip.id)}
                    >
                      + Add Trip Expense
                    </Button>
                    <button
                      onClick={() => handleDeleteTrip(trip.id, trip.title)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-red-500/80 text-white transition-colors border border-white/20 shrink-0"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-right shrink-0">
                      <span className="text-xs opacity-80 block">Trip Budget Target</span>
                      <span className="text-xl font-extrabold">
                        ₹{(trip.totalBudget || 0).toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs opacity-90 block font-semibold text-emerald-200">
                        Saved: ₹{(trip.savedAmount || 0).toLocaleString('en-IN')} ({savedPct}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Savings & Budget Progress Bar Banner */}
                <div className="px-6 py-3 bg-slate-100/70 dark:bg-[#0B0F14]/70 border-b border-slate-200 dark:border-[#222934] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600 dark:text-[#9CA3AF]">Allocated Vacation Funds Saved</span>
                      <span className="text-[#3B82F6] font-bold">₹{(trip.savedAmount || 0).toLocaleString('en-IN')} of ₹{(trip.totalBudget || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 dark:bg-[#151A21] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#22C55E] to-[#3B82F6] rounded-full"
                        style={{ width: `${savedPct}%` }}
                      />
                    </div>
                  </div>
                  <div className="shrink-0 text-xs font-semibold text-slate-500 dark:text-[#9CA3AF]">
                    Spent: <span className="font-extrabold text-slate-900 dark:text-[#F3F4F6]">₹{(trip.totalSpent || 0).toLocaleString('en-IN')}</span> ({spentPct}%)
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-[#9CA3AF]">Start Date</label>
                    <div className="relative flex items-center cursor-pointer" onClick={(e) => {
                      const input = e.currentTarget.querySelector('input');
                      if (input) {
                        try { if ('showPicker' in input) (input as any).showPicker(); } catch (_) {}
                      }
                    }}>
                      <Calendar className="w-3.5 h-3.5 absolute left-2.5 text-[#3B82F6] pointer-events-none" />
                      <input
                        type="date"
                        value={startDateIso}
                        onChange={(e) => {
                          const val = e.target.value;
                          setStartDateIso(val);
                          if (val) {
                            const d = new Date(val);
                            const formatted = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                            setStartDate(formatted);
                          }
                        }}
                        className="w-full bg-slate-50 dark:bg-[#151A21] text-slate-900 dark:text-[#F3F4F6] text-xs font-semibold rounded-xl border border-slate-200 dark:border-[#222934] pl-8 pr-2 py-2 outline-none focus:border-[#3B82F6]/50 focus:ring-2 focus:ring-[#3B82F6]/30 transition-all cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-[#9CA3AF]">End Date</label>
                    <div className="relative flex items-center cursor-pointer" onClick={(e) => {
                      const input = e.currentTarget.querySelector('input');
                      if (input) {
                        try { if ('showPicker' in input) (input as any).showPicker(); } catch (_) {}
                      }
                    }}>
                      <Calendar className="w-3.5 h-3.5 absolute left-2.5 text-[#3B82F6] pointer-events-none" />
                      <input
                        type="date"
                        value={endDateIso}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEndDateIso(val);
                          if (val) {
                            const d = new Date(val);
                            const formatted = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                            setEndDate(formatted);
                          }
                        }}
                        className="w-full bg-slate-50 dark:bg-[#151A21] text-slate-900 dark:text-[#F3F4F6] text-xs font-semibold rounded-xl border border-slate-200 dark:border-[#222934] pl-8 pr-2 py-2 outline-none focus:border-[#3B82F6]/50 focus:ring-2 focus:ring-[#3B82F6]/30 transition-all cursor-pointer"
                      />
                    </div>
                  </div>
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

      {/* DEPOSIT FUNDS MODAL */}
      <AnimatePresence>
        {depositTripId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDepositTripId(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#222934]">
                <h3 className="text-lg font-bold text-slate-900 dark:text-[#F3F4F6]">Deposit Trip Funds</h3>
                <button onClick={() => setDepositTripId(null)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">
                Deposited funds will be allocated to this trip/vacation target and automatically deducted from your monthly budget.
              </p>
              <form onSubmit={handleDepositToTrip} className="space-y-4">
                <Input label="Deposit Amount (₹)" type="number" placeholder="5000" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} leftIcon={<IndianRupee className="w-4 h-4" />} required />
                <div className="pt-3 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setDepositTripId(null)}>Cancel</Button>
                  <Button type="submit" variant="primary">Confirm Deposit & Deduct Budget</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

