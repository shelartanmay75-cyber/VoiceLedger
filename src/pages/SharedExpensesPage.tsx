import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowUpRight, ArrowDownLeft, CheckCircle2, UserCheck, ShieldCheck, X, IndianRupee, Wallet, ArrowRightLeft } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useData } from '../context/DataContext';
import type { SharedFriend } from '../types/featurePages';

export const SharedExpensesPage: React.FC = () => {
  const { friends, settlements, addFriend, recordSettlement } = useData();

  // Add friend state
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [debtType, setDebtType] = useState<'you_owe' | 'you_are_owed'>('you_owe');
  const [initialAmount, setInitialAmount] = useState('');

  // Settlement action state (Pay or Receive)
  const [settleAction, setSettleAction] = useState<{ friend: SharedFriend; type: 'paid' | 'received' } | null>(null);
  const [settleAmount, setSettleAmount] = useState('');

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName || !initialAmount) return;

    const parsedAmt = parseFloat(initialAmount);
    if (isNaN(parsedAmt) || parsedAmt <= 0) return;

    const balance = debtType === 'you_are_owed' ? parsedAmt : -parsedAmt;
    const statusText = debtType === 'you_are_owed'
      ? `Owes you ₹${parsedAmt.toLocaleString('en-IN')}`
      : `You owe ₹${parsedAmt.toLocaleString('en-IN')}`;

    await addFriend({
      name: friendName,
      balance,
      statusText,
    });

    setFriendName('');
    setDebtType('you_owe');
    setInitialAmount('');
    setIsAddFriendModalOpen(false);
  };

  const handleConfirmSettle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settleAction || !settleAmount) return;

    const amt = parseFloat(settleAmount);
    if (isNaN(amt) || amt <= 0) return;

    await recordSettlement(settleAction.friend.name, amt, settleAction.type);
    setSettleAction(null);
    setSettleAmount('');
  };

  const totalToReceive = friends
    .filter((f) => f.balance > 0)
    .reduce((acc, f) => acc + f.balance, 0);

  const totalToPay = Math.abs(
    friends
      .filter((f) => f.balance < 0)
      .reduce((acc, f) => acc + f.balance, 0)
  );

  const netBalance = totalToReceive - totalToPay;

  return (
    <PageContainer
      title="Shared Expenses & Split Ledger"
      subtitle="Track split bills with friends, outstanding balances, and settlement histories."
      badge="Splitwise Sync"
      actionSlot={
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddFriendModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          id="add-friend-split-btn"
        >
          Add Friend / Split
        </Button>
      }
    >
      <div className="space-y-6">
        {/* ------------------------------------------------------------- */}
        {/* 1. OUTSTANDING AMOUNT SUMMARY CARDS                           */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card accentBorder hoverable className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30">
                <ArrowDownLeft className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">You are Owed</span>
                <p className="text-2xl font-extrabold text-[#22C55E] mt-0.5">
                  +₹{totalToReceive.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </Card>

          <Card hoverable className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">You Owe</span>
                <p className="text-2xl font-extrabold text-[#EF4444] mt-0.5">
                  -₹{totalToPay.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </Card>

          <Card hoverable className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Net Balance</span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6] mt-0.5">
                  ₹{netBalance.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 2. FRIEND CARDS & SETTLEMENT HISTORY GRID                     */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Friend Balances Cards Grid (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-[#F3F4F6] tracking-tight">
              Friends & Group Balances
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {friends.map((friend) => {
                const owesYou = friend.balance > 0;
                const youOwe = friend.balance < 0;
                const isSettled = friend.balance === 0;

                return (
                  <Card key={friend.id} hoverable className="p-4 flex flex-col justify-between space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1E3A8A] text-white font-bold text-xs flex items-center justify-center shadow-md shrink-0">
                        {friend.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col text-left overflow-hidden">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-[#F3F4F6] truncate">
                          {friend.name}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F14]/60 border border-slate-200/80 dark:border-[#222934]/60 flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">Status</span>
                      <span
                        className={`text-xs font-extrabold ${
                          owesYou
                            ? 'text-[#22C55E]'
                            : youOwe
                            ? 'text-[#EF4444]'
                            : 'text-slate-400'
                        }`}
                      >
                        {friend.statusText}
                      </span>
                    </div>

                    {youOwe && (
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={() => {
                          setSettleAction({ friend, type: 'paid' });
                          setSettleAmount(Math.abs(friend.balance).toString());
                        }}
                        className="bg-[#EF4444] hover:bg-[#DC2626] text-white border-none shadow-md shadow-[#EF4444]/20"
                      >
                        + Pay Money (₹{Math.abs(friend.balance).toLocaleString('en-IN')})
                      </Button>
                    )}

                    {owesYou && (
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={() => {
                          setSettleAction({ friend, type: 'received' });
                          setSettleAmount(friend.balance.toString());
                        }}
                        className="bg-[#22C55E] hover:bg-[#16A34A] text-white border-none shadow-md shadow-[#22C55E]/20"
                      >
                        + Receive Money (₹{friend.balance.toLocaleString('en-IN')})
                      </Button>
                    )}

                    {isSettled && (
                      <Button variant="ghost" size="sm" fullWidth disabled className="opacity-60">
                        Settled Up
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Settlement History Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-[#F3F4F6] tracking-tight">
              Recent Settlement Log
            </h2>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                  Settlement History
                </CardTitle>
                <CardDescription>Cleared group payments</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {settlements.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No settlements recorded yet.</p>
                ) : (
                  settlements.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F14]/60 border border-slate-200/80 dark:border-[#222934]/60 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border ${
                          s.type === 'received'
                            ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30'
                            : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30'
                        }`}>
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6]">
                            {s.friendName}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {s.type === 'received' ? 'Received Payment' : 'Sent Payment'} • {s.date}
                          </span>
                        </div>
                      </div>

                      <span className={`text-xs font-extrabold ${s.type === 'received' ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                        {s.type === 'received' ? '+' : '-'}₹{s.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ADD FRIEND / SPLIT MODAL */}
      <AnimatePresence>
        {isAddFriendModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddFriendModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-md bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#222934]">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30">
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-[#F3F4F6]">Add Friend / Split Bill</h3>
                </div>
                <button onClick={() => setIsAddFriendModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAddFriend} className="space-y-4">
                <Input
                  label="Friend Full Name"
                  placeholder="e.g. Rahul Sharma"
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  required
                />

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-[#9CA3AF]">
                    Status / Split Type
                  </label>
                  <select
                    value={debtType}
                    onChange={(e) => setDebtType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-[#F3F4F6] text-xs font-semibold rounded-xl border border-slate-200 dark:border-[#222934] px-4 py-2.5 outline-none focus:border-[#3B82F6]/50 focus:ring-2 focus:ring-[#3B82F6]/30 transition-all cursor-pointer"
                  >
                    <option value="you_owe" className="bg-white dark:bg-[#151A21]">You owe (You need to pay him)</option>
                    <option value="you_are_owed" className="bg-white dark:bg-[#151A21]">You are owed (He needs to pay you)</option>
                  </select>
                </div>

                <Input
                  label="Amount (₹)"
                  type="number"
                  placeholder="1500"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                  leftIcon={<IndianRupee className="w-4 h-4" />}
                  required
                />

                <div className="pt-3 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsAddFriendModalOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="primary">Add Friend / Split</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SETTLE PAYMENT MODAL (PAY OR RECEIVE) */}
      <AnimatePresence>
        {settleAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSettleAction(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative z-10 w-full max-w-sm bg-white dark:bg-[#151A21] border border-slate-200 dark:border-[#222934] rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#222934]">
                <h3 className="text-lg font-bold text-slate-900 dark:text-[#F3F4F6]">
                  {settleAction.type === 'paid' ? `Pay Money to ${settleAction.friend.name}` : `Receive Money from ${settleAction.friend.name}`}
                </h3>
                <button onClick={() => setSettleAction(null)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B0F14] border border-slate-200 dark:border-[#222934] text-xs text-slate-600 dark:text-[#9CA3AF] flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <span>
                  {settleAction.type === 'paid'
                    ? 'This payment will be deducted from your monthly budget and recorded as an expense.'
                    : 'This received money will be added to your monthly budget balance.'}
                </span>
              </div>

              <form onSubmit={handleConfirmSettle} className="space-y-4">
                <Input
                  label="Settlement Amount (₹)"
                  type="number"
                  placeholder="500"
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  leftIcon={<IndianRupee className="w-4 h-4" />}
                  required
                />
                <div className="pt-3 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setSettleAction(null)}>Cancel</Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className={settleAction.type === 'paid' ? 'bg-[#EF4444] hover:bg-[#DC2626] border-none text-white' : 'bg-[#22C55E] hover:bg-[#16A34A] border-none text-white'}
                  >
                    {settleAction.type === 'paid' ? 'Confirm Payment' : 'Confirm Receipt'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};
