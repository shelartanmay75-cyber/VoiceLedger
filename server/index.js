import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Utility to read DB
const readDB = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { profile: {}, expenses: [], goals: [], subscriptions: [], trips: [], friends: [], settlements: [] };
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { profile: {}, expenses: [], goals: [], subscriptions: [], trips: [], friends: [], settlements: [] };
  }
};

// Utility to write DB
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
};

// -------------------------------------------------------------
// HEALTH CHECK
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// -------------------------------------------------------------
// GET ALL APP DATA
// -------------------------------------------------------------
app.get('/api/data', (req, res) => {
  const db = readDB();
  res.json(db);
});

// -------------------------------------------------------------
// EXPENSES API
// -------------------------------------------------------------
app.get('/api/expenses', (req, res) => {
  const db = readDB();
  res.json(db.expenses || []);
});

app.post('/api/expenses', (req, res) => {
  const db = readDB();
  const newExpense = {
    id: `exp-${Date.now()}`,
    title: req.body.title || 'Untitled Expense',
    amount: Number(req.body.amount) || 0,
    category: req.body.category || 'Miscellaneous',
    paymentMethod: req.body.paymentMethod || 'UPI',
    date: req.body.date || 'Today',
    isoDate: req.body.isoDate || new Date().toISOString(),
    notes: req.body.notes || '',
    iconName: req.body.iconName || 'ShoppingBag',
    categoryColor: req.body.categoryColor || 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30',
  };

  db.expenses = [newExpense, ...(db.expenses || [])];
  writeDB(db);
  res.status(201).json(newExpense);
});

app.delete('/api/expenses/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  db.expenses = (db.expenses || []).filter((e) => e.id !== id);
  writeDB(db);
  res.json({ success: true, id });
});

// -------------------------------------------------------------
// SAVINGS GOALS API
// -------------------------------------------------------------
app.get('/api/goals', (req, res) => {
  const db = readDB();
  res.json(db.goals || []);
});

app.post('/api/goals', (req, res) => {
  const db = readDB();
  const newGoal = {
    id: `goal-${Date.now()}`,
    title: req.body.title || 'New Goal',
    targetAmount: Number(req.body.targetAmount) || 10000,
    currentAmount: Number(req.body.currentAmount) || 0,
    targetDate: req.body.targetDate || 'Dec 2026',
    category: req.body.category || 'General',
    iconName: req.body.iconName || 'Target',
    color: req.body.color || 'from-[#3B82F6] to-[#1D4ED8]',
  };
  db.goals = [newGoal, ...(db.goals || [])];
  writeDB(db);
  res.status(201).json(newGoal);
});

app.patch('/api/goals/:id/deposit', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const depositAmount = Number(req.body.amount) || 0;
  
  db.goals = (db.goals || []).map((g) => {
    if (g.id === id) {
      return { ...g, currentAmount: g.currentAmount + depositAmount };
    }
    return g;
  });

  writeDB(db);
  const updatedGoal = db.goals.find((g) => g.id === id);
  res.json(updatedGoal || { error: 'Goal not found' });
});

app.delete('/api/goals/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  db.goals = (db.goals || []).filter((g) => g.id !== id);
  writeDB(db);
  res.json({ success: true, id });
});

// -------------------------------------------------------------
// SUBSCRIPTIONS API
// -------------------------------------------------------------
app.get('/api/subscriptions', (req, res) => {
  const db = readDB();
  res.json(db.subscriptions || []);
});

app.post('/api/subscriptions', (req, res) => {
  const db = readDB();
  const newSub = {
    id: `sub-${Date.now()}`,
    name: req.body.name || 'New Service',
    category: req.body.category || 'Entertainment',
    billingFrequency: req.body.billingFrequency || 'Monthly',
    cost: Number(req.body.cost) || 0,
    nextRenewalDate: req.body.nextRenewalDate || 'Next Month',
    status: req.body.status || 'active',
    logoColor: req.body.logoColor || 'bg-[#3B82F6]',
    iconName: req.body.iconName || 'Tv',
  };
  db.subscriptions = [newSub, ...(db.subscriptions || [])];
  writeDB(db);
  res.status(201).json(newSub);
});

app.patch('/api/subscriptions/:id/toggle', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  db.subscriptions = (db.subscriptions || []).map((s) => {
    if (s.id === id) {
      return { ...s, status: s.status === 'active' ? 'cancelling' : 'active' };
    }
    return s;
  });
  writeDB(db);
  const updated = db.subscriptions.find((s) => s.id === id);
  res.json(updated);
});

app.delete('/api/subscriptions/:id', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  db.subscriptions = (db.subscriptions || []).filter((s) => s.id !== id);
  writeDB(db);
  res.json({ success: true, id });
});

// -------------------------------------------------------------
// TRIPS & TRIP EXPENSES API
// -------------------------------------------------------------
app.get('/api/trips', (req, res) => {
  const db = readDB();
  res.json(db.trips || []);
});

app.post('/api/trips', (req, res) => {
  const db = readDB();
  const newTrip = {
    id: `trip-${Date.now()}`,
    title: req.body.title || 'New Trip',
    location: req.body.location || 'Vacation Spot',
    startDate: req.body.startDate || 'Upcoming',
    endDate: req.body.endDate || 'Upcoming',
    totalBudget: Number(req.body.totalBudget) || 10000,
    totalSpent: 0,
    status: req.body.status || 'active',
    travelersCount: Number(req.body.travelersCount) || 1,
    coverGradient: req.body.coverGradient || 'from-[#06B6D4] to-[#3B82F6]',
    expensesList: [],
  };
  db.trips = [newTrip, ...(db.trips || [])];
  writeDB(db);
  res.status(201).json(newTrip);
});

app.post('/api/trips/:id/expenses', (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const newTripExpense = {
    id: `te-${Date.now()}`,
    description: req.body.description || 'Trip expense',
    amount: Number(req.body.amount) || 0,
    category: req.body.category || 'General',
    paidBy: req.body.paidBy || 'You',
    date: req.body.date || 'Today',
  };

  db.trips = (db.trips || []).map((t) => {
    if (t.id === id) {
      const expensesList = [...(t.expensesList || []), newTripExpense];
      const totalSpent = expensesList.reduce((acc, curr) => acc + curr.amount, 0);
      return { ...t, expensesList, totalSpent };
    }
    return t;
  });

  writeDB(db);
  const updatedTrip = db.trips.find((t) => t.id === id);
  res.json(updatedTrip);
});

// -------------------------------------------------------------
// SHARED EXPENSES & FRIENDS API
// -------------------------------------------------------------
app.get('/api/shared/friends', (req, res) => {
  const db = readDB();
  res.json(db.friends || []);
});

app.post('/api/shared/friends', (req, res) => {
  const db = readDB();
  const newFriend = {
    id: `f-${Date.now()}`,
    name: req.body.name || 'New Friend',
    email: req.body.email || 'friend@example.com',
    balance: 0,
    statusText: 'Settled Up',
  };
  db.friends = [newFriend, ...(db.friends || [])];
  writeDB(db);
  res.status(201).json(newFriend);
});

app.post('/api/shared/settle', (req, res) => {
  const db = readDB();
  const friendName = req.body.friendName;
  const amount = Number(req.body.amount) || 0;
  const type = req.body.type || 'received'; // received | paid

  const newSettlement = {
    id: `s-${Date.now()}`,
    friendName,
    amount,
    type,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
  };

  db.settlements = [newSettlement, ...(db.settlements || [])];

  // Update friend balance
  db.friends = (db.friends || []).map((f) => {
    if (f.name.toLowerCase() === friendName.toLowerCase()) {
      let newBalance = f.balance;
      if (type === 'received') {
        newBalance -= amount; // reduces what they owe you
      } else {
        newBalance += amount; // reduces what you owe them
      }
      let statusText = 'Settled Up';
      if (newBalance > 0) statusText = `Owes you ₹${newBalance.toLocaleString('en-IN')}`;
      if (newBalance < 0) statusText = `You owe ₹${Math.abs(newBalance).toLocaleString('en-IN')}`;
      return { ...f, balance: newBalance, statusText };
    }
    return f;
  });

  writeDB(db);
  res.status(201).json({ settlement: newSettlement, friends: db.friends });
});

// -------------------------------------------------------------
// PROFILE API
// -------------------------------------------------------------
app.get('/api/profile', (req, res) => {
  const db = readDB();
  res.json(db.profile || {});
});

app.put('/api/profile', (req, res) => {
  const db = readDB();
  db.profile = { ...(db.profile || {}), ...req.body };
  writeDB(db);
  res.json(db.profile);
});

// Start server
app.listen(PORT, () => {
  console.log(`VoiceLedger REST Backend API running on port ${PORT}`);
});
