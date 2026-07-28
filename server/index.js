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

// CORS setup allowing Vercel frontend domains and local dev
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin === '*' ? true : corsOrigin, credentials: true }));
app.use(express.json());

// Utility to read DB
const readDB = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = { users: {}, profile: {}, expenses: [], goals: [], subscriptions: [], trips: [], friends: [], settlements: [] };
      try {
        fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      } catch (_) {}
      return initial;
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    if (!parsed.users) parsed.users = {};
    return parsed;
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { users: {}, profile: {}, expenses: [], goals: [], subscriptions: [], trips: [], friends: [], settlements: [] };
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

/**
 * Gets or initializes user-isolated data store for multi-user isolation
 */
const getUserStore = (db, userId) => {
  if (!userId || userId === 'demo_user' || userId === 'guest_user_demo') {
    // Shared demo data
    return {
      expenses: db.expenses || [],
      goals: db.goals || [],
      subscriptions: db.subscriptions || [],
      trips: db.trips || [],
      friends: db.friends || [],
      settlements: db.settlements || [],
      profile: db.profile || {},
    };
  }

  // Real Google User ID
  if (!db.users) db.users = {};
  if (!db.users[userId]) {
    // Initialize clean slate for new authenticated user
    db.users[userId] = {
      expenses: [],
      goals: [],
      subscriptions: [],
      trips: [],
      friends: [],
      settlements: [],
      profile: { uid: userId, monthlyBudget: 40000, currency: '₹' },
    };
  }
  return db.users[userId];
};

/**
 * Saves updated user store back into the global DB
 */
const saveUserStore = (db, userId, updatedStore) => {
  if (!userId || userId === 'demo_user' || userId === 'guest_user_demo') {
    db.expenses = updatedStore.expenses;
    db.goals = updatedStore.goals;
    db.subscriptions = updatedStore.subscriptions;
    db.trips = updatedStore.trips;
    db.friends = updatedStore.friends;
    db.settlements = updatedStore.settlements;
    db.profile = updatedStore.profile;
  } else {
    if (!db.users) db.users = {};
    db.users[userId] = updatedStore;
  }
  writeDB(db);
};

// Helper middleware to get userId
const getUserId = (req) => {
  return req.headers['x-user-id'] || req.query.userId || 'demo_user';
};

// -------------------------------------------------------------
// HEALTH CHECK
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'VoiceLedger Express Backend', timestamp: new Date().toISOString() });
});

// -------------------------------------------------------------
// GET ALL APP DATA FOR ACTIVE USER
// -------------------------------------------------------------
app.get('/api/data', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const userData = getUserStore(db, userId);
  res.json(userData);
});

// -------------------------------------------------------------
// EXPENSES API (Per User)
// -------------------------------------------------------------
app.get('/api/expenses', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const store = getUserStore(db, userId);
  res.json(store.expenses || []);
});

app.post('/api/expenses', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const store = getUserStore(db, userId);

  const newExpense = {
    id: `exp-${Date.now()}`,
    title: req.body.title || 'Untitled Expense',
    amount: Number(req.body.amount) || 0,
    category: req.body.category || 'Miscellaneous',
    paymentMethod: req.body.paymentMethod || 'UPI',
    date: req.body.date || 'Today',
    isoDate: req.body.isoDate || new Date().toISOString().split('T')[0],
    notes: req.body.notes || '',
    iconName: req.body.iconName || 'ShoppingBag',
    categoryColor: req.body.categoryColor || 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30',
  };

  store.expenses = [newExpense, ...(store.expenses || [])];
  saveUserStore(db, userId, store);
  res.status(201).json(newExpense);
});

app.delete('/api/expenses/:id', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const store = getUserStore(db, userId);
  const { id } = req.params;

  store.expenses = (store.expenses || []).filter((e) => e.id !== id);
  saveUserStore(db, userId, store);
  res.json({ success: true, id });
});

// -------------------------------------------------------------
// SAVINGS GOALS API (Per User)
// -------------------------------------------------------------
app.get('/api/goals', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const store = getUserStore(db, userId);
  res.json(store.goals || []);
});

app.post('/api/goals', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const store = getUserStore(db, userId);

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

  store.goals = [newGoal, ...(store.goals || [])];
  saveUserStore(db, userId, store);
  res.status(201).json(newGoal);
});

app.patch('/api/goals/:id/deposit', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const store = getUserStore(db, userId);
  const { id } = req.params;
  const depositAmount = Number(req.body.amount) || 0;

  store.goals = (store.goals || []).map((g) => {
    if (g.id === id) {
      return { ...g, currentAmount: g.currentAmount + depositAmount };
    }
    return g;
  });

  saveUserStore(db, userId, store);
  const updatedGoal = store.goals.find((g) => g.id === id);
  res.json(updatedGoal || { error: 'Goal not found' });
});

app.delete('/api/goals/:id', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const store = getUserStore(db, userId);
  const { id } = req.params;

  store.goals = (store.goals || []).filter((g) => g.id !== id);
  saveUserStore(db, userId, store);
  res.json({ success: true, id });
});

// -------------------------------------------------------------
// SUBSCRIPTIONS API (Per User)
// -------------------------------------------------------------
app.get('/api/subscriptions', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const store = getUserStore(db, userId);
  res.json(store.subscriptions || []);
});

app.post('/api/subscriptions', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const store = getUserStore(db, userId);

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

  store.subscriptions = [newSub, ...(store.subscriptions || [])];
  saveUserStore(db, userId, store);
  res.status(201).json(newSub);
});

app.patch('/api/subscriptions/:id/toggle', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const store = getUserStore(db, userId);
  const { id } = req.params;

  store.subscriptions = (store.subscriptions || []).map((s) => {
    if (s.id === id) {
      return { ...s, status: s.status === 'active' ? 'cancelling' : 'active' };
    }
    return s;
  });

  saveUserStore(db, userId, store);
  const updated = store.subscriptions.find((s) => s.id === id);
  res.json(updated);
});

app.delete('/api/subscriptions/:id', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const store = getUserStore(db, userId);
  const { id } = req.params;

  store.subscriptions = (store.subscriptions || []).filter((s) => s.id !== id);
  saveUserStore(db, userId, store);
  res.json({ success: true, id });
});

// -------------------------------------------------------------
// TRIPS API (Per User)
// -------------------------------------------------------------
app.get('/api/trips', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const store = getUserStore(db, userId);
  res.json(store.trips || []);
});

app.post('/api/trips', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const store = getUserStore(db, userId);

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

  store.trips = [newTrip, ...(store.trips || [])];
  saveUserStore(db, userId, store);
  res.status(201).json(newTrip);
});

app.post('/api/trips/:id/expenses', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const store = getUserStore(db, userId);
  const { id } = req.params;

  const newTripExpense = {
    id: `te-${Date.now()}`,
    description: req.body.description || 'Trip expense',
    amount: Number(req.body.amount) || 0,
    category: req.body.category || 'General',
    paidBy: req.body.paidBy || 'You',
    date: req.body.date || 'Today',
  };

  store.trips = (store.trips || []).map((t) => {
    if (t.id === id) {
      const expensesList = [...(t.expensesList || []), newTripExpense];
      const totalSpent = expensesList.reduce((acc, curr) => acc + curr.amount, 0);
      return { ...t, expensesList, totalSpent };
    }
    return t;
  });

  saveUserStore(db, userId, store);
  const updatedTrip = store.trips.find((t) => t.id === id);
  res.json(updatedTrip);
});

// -------------------------------------------------------------
// SHARED EXPENSES & FRIENDS API (Per User)
// -------------------------------------------------------------
app.get('/api/shared/friends', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const store = getUserStore(db, userId);
  res.json(store.friends || []);
});

app.post('/api/shared/friends', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const store = getUserStore(db, userId);

  const newFriend = {
    id: `f-${Date.now()}`,
    name: req.body.name || 'New Friend',
    email: req.body.email || 'friend@example.com',
    balance: 0,
    statusText: 'Settled Up',
  };

  store.friends = [newFriend, ...(store.friends || [])];
  saveUserStore(db, userId, store);
  res.status(201).json(newFriend);
});

app.post('/api/shared/settle', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const store = getUserStore(db, userId);

  const friendName = req.body.friendName;
  const amount = Number(req.body.amount) || 0;
  const type = req.body.type || 'received';

  const newSettlement = {
    id: `s-${Date.now()}`,
    friendName,
    amount,
    type,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
  };

  store.settlements = [newSettlement, ...(store.settlements || [])];

  store.friends = (store.friends || []).map((f) => {
    if (f.name.toLowerCase() === friendName.toLowerCase()) {
      let newBalance = f.balance;
      if (type === 'received') {
        newBalance -= amount;
      } else {
        newBalance += amount;
      }
      let statusText = 'Settled Up';
      if (newBalance > 0) statusText = `Owes you ₹${newBalance.toLocaleString('en-IN')}`;
      if (newBalance < 0) statusText = `You owe ₹${Math.abs(newBalance).toLocaleString('en-IN')}`;
      return { ...f, balance: newBalance, statusText };
    }
    return f;
  });

  saveUserStore(db, userId, store);
  res.status(201).json({ settlement: newSettlement, friends: store.friends });
});

// -------------------------------------------------------------
// PROFILE API (Per User)
// -------------------------------------------------------------
app.get('/api/profile', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const store = getUserStore(db, userId);
  res.json(store.profile || {});
});

app.put('/api/profile', (req, res) => {
  const userId = getUserId(req);
  const db = readDB();
  const store = getUserStore(db, userId);

  store.profile = { ...(store.profile || {}), ...req.body };
  saveUserStore(db, userId, store);
  res.json(store.profile);
});

// Start server
app.listen(PORT, () => {
  console.log(`VoiceLedger REST Backend API running on port ${PORT}`);
});
