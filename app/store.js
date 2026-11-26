// store.js: satu-satunya tempat state aplikasi dibaca dan diubah.
// Menyimpan transaksi, anggaran, dan tujuan di localStorage supaya perubahan
// pengguna tetap ada saat halaman dimuat ulang. Semua hitungan total tinggal
// di sini, jadi setiap halaman membaca angka yang sama.
import { CATEGORIES, INITIAL_GOALS, INITIAL_TRANSACTIONS, INCOME } from './data.js';

const STORAGE_KEY = 'dompet-keluarga-v1';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function defaultState() {
  return {
    income: INCOME,
    budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])),
    transactions: clone(INITIAL_TRANSACTIONS),
    goals: clone(INITIAL_GOALS),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.transactions) || !Array.isArray(parsed.goals)) return defaultState();
    const state = defaultState();
    state.income = Number(parsed.income) > 0 ? Number(parsed.income) : INCOME;
    for (const category of CATEGORIES) {
      const value = Number(parsed.budgets?.[category.id]);
      if (Number.isFinite(value) && value >= 0) state.budgets[category.id] = value;
    }
    state.transactions = parsed.transactions;
    state.goals = parsed.goals;
    return state;
  } catch {
    return defaultState();
  }
}

export const state = loadState();

export function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Penyimpanan penuh atau dimatikan: aplikasi tetap jalan di memori.
  }
}

export function resetState() {
  const fresh = defaultState();
  state.income = fresh.income;
  state.budgets = fresh.budgets;
  state.transactions = fresh.transactions;
  state.goals = fresh.goals;
  saveState();
}

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) ?? null;
}

export function spentByCategory(id) {
  return state.transactions
    .filter((t) => t.category === id)
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
}

export function totalSpent() {
  return state.transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);
}

export function totalBudget() {
  return CATEGORIES.reduce((sum, c) => sum + Number(state.budgets[c.id] || 0), 0);
}

export function remainingMoney() {
  return state.income - totalSpent();
}

export function budgetStatus(id) {
  const budget = Number(state.budgets[id] || 0);
  const spent = spentByCategory(id);
  const percent = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const level = spent > budget ? 'over' : percent >= 85 ? 'warn' : 'ok';
  return { budget, spent, remaining: budget - spent, percent, level };
}

export function addTransaction(entry) {
  const id = `t${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
  const transaction = {
    id,
    date: entry.date,
    description: entry.description.trim(),
    category: entry.category,
    amount: Math.round(Number(entry.amount)),
  };
  state.transactions.push(transaction);
  state.transactions.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  saveState();
  return transaction;
}

export function updateTransaction(id, entry) {
  const found = state.transactions.find((t) => t.id === id);
  if (!found) return null;
  found.date = entry.date;
  found.description = entry.description.trim();
  found.category = entry.category;
  found.amount = Math.round(Number(entry.amount));
  state.transactions.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  saveState();
  return found;
}

export function deleteTransaction(id) {
  const index = state.transactions.findIndex((t) => t.id === id);
  if (index === -1) return false;
  state.transactions.splice(index, 1);
  saveState();
  return true;
}

export function setBudget(id, amount) {
  state.budgets[id] = Math.max(0, Math.round(Number(amount) || 0));
  saveState();
}

export function setIncome(amount) {
  const value = Math.round(Number(amount) || 0);
  if (value > 0) state.income = value;
  saveState();
}

export function depositToGoal(id, amount) {
  const goal = state.goals.find((g) => g.id === id);
  if (!goal) return null;
  goal.saved = Math.min(goal.target, goal.saved + Math.max(0, Math.round(Number(amount) || 0)));
  saveState();
  return goal;
}

export function addGoal(entry) {
  const id = `g${Date.now().toString(36)}`;
  const goal = {
    id,
    name: entry.name.trim(),
    target: Math.round(Number(entry.target)),
    saved: Math.round(Number(entry.saved) || 0),
    note: entry.note.trim(),
  };
  state.goals.push(goal);
  saveState();
  return goal;
}

export function formatRupiah(amount) {
  const value = Math.round(Number(amount) || 0);
  return `Rp${value.toLocaleString('id-ID')}`;
}

export function formatShort(amount) {
  const value = Number(amount) || 0;
  if (Math.abs(value) >= 1000000) return `Rp${(value / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`;
  if (Math.abs(value) >= 1000) return `Rp${Math.round(value / 1000)} rb`;
  return formatRupiah(value);
}

export function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number);
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${day} ${names[(month || 1) - 1]} ${year}`;
}
