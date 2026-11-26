// main.js: router hash dan pengikat semua kontrol halaman.
// Rute: #/ dasbor, #/transaksi, #/anggaran, #/tujuan, #/laporan.
// Setiap render menandai window.__shotReady supaya alat screenshot tahu
// halaman sudah selesai digambar.
import { drawBudgetBars, drawSpendingDonut } from './charts.js';
import { state } from './store.js';
import {
  addGoal, addTransaction, deleteTransaction, depositToGoal,
  resetState, saveState, setBudget, setIncome, updateTransaction,
} from './store.js';
import { budgetsPage, dashboard, goalsPage, notFoundPage, reportPage, transactionsPage } from './views.js';

const app = document.getElementById('app');
const navLinks = [...document.querySelectorAll('nav a')];

let transactionFilter = { category: 'semua', text: '' };
let editingTransactionId = '';

function setActiveNav(route) {
  for (const link of navLinks) {
    const target = link.getAttribute('href') ?? '';
    link.classList.toggle('active', target === `#/${route}`);
  }
}

function currentRoute() {
  const hash = location.hash || '#/';
  if (hash === '#/' || hash === '#') return 'dashboard';
  const match = hash.match(/^#\/([a-z]+)/);
  return match ? match[1] : 'unknown';
}

function bindDashboard() {
  const bars = document.getElementById('chart-bars');
  const donut = document.getElementById('chart-donut');
  if (bars) drawBudgetBars(bars);
  if (donut) drawSpendingDonut(donut);
}

function bindTransactions() {
  const form = document.getElementById('transaction-form');
  const note = document.getElementById('form-note');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const entry = {
        date: String(data.get('date') || ''),
        description: String(data.get('description') || ''),
        category: String(data.get('category') || 'belanja'),
        amount: Number(data.get('amount') || 0),
      };
      if (!entry.date || !entry.description.trim() || !(entry.amount > 0)) {
        if (note) note.textContent = 'Lengkapi tanggal, keterangan, dan jumlah yang benar.';
        return;
      }
      if (editingTransactionId) {
        updateTransaction(editingTransactionId, entry);
        if (note) note.textContent = 'Transaksi berhasil diubah.';
      } else {
        addTransaction(entry);
        if (note) note.textContent = 'Transaksi berhasil ditambah.';
      }
      editingTransactionId = '';
      render();
    });
  }
  const cancel = document.querySelector('[data-cancel-edit]');
  if (cancel) cancel.addEventListener('click', () => { editingTransactionId = ''; render(); });

  const categorySelect = document.getElementById('filter-category');
  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      transactionFilter.category = categorySelect.value;
      render();
    });
  }
  const textInput = document.getElementById('filter-text');
  if (textInput) {
    textInput.addEventListener('input', () => {
      transactionFilter.text = textInput.value;
      render();
    });
  }
  for (const button of document.querySelectorAll('[data-delete]')) {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-delete') ?? '';
      if (deleteTransaction(id)) render();
    });
  }
  for (const button of document.querySelectorAll('[data-edit]')) {
    button.addEventListener('click', () => {
      editingTransactionId = button.getAttribute('data-edit') ?? '';
      render();
      const description = document.querySelector('#transaction-form input[name="description"]');
      if (description) description.focus();
    });
  }
}

function bindBudgets() {
  const saveButton = document.getElementById('save-budgets');
  const note = document.getElementById('budget-note');
  if (saveButton) {
    saveButton.addEventListener('click', () => {
      for (const input of document.querySelectorAll('[data-budget]')) {
        setBudget(input.getAttribute('data-budget') ?? '', Number(input.value));
      }
      if (note) note.textContent = 'Semua anggaran berhasil disimpan.';
      render();
    });
  }
  const resetButton = document.getElementById('reset-data');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      resetState();
      transactionFilter = { category: 'semua', text: '' };
      editingTransactionId = '';
      if (note) note.textContent = 'Data awal bulan November 2026 dikembalikan.';
      render();
    });
  }
  const incomeForm = document.getElementById('income-form');
  if (incomeForm) {
    incomeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(incomeForm);
      setIncome(Number(data.get('income') || 0));
      render();
    });
  }
}

function bindGoals() {
  for (const form of document.querySelectorAll('.deposit-form')) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      depositToGoal(form.getAttribute('data-goal') ?? '', Number(data.get('amount') || 0));
      render();
    });
  }
  const goalForm = document.getElementById('goal-form');
  if (goalForm) {
    goalForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(goalForm);
      const name = String(data.get('name') || '').trim();
      const target = Number(data.get('target') || 0);
      if (!name || !(target > 0)) return;
      addGoal({
        name,
        target,
        saved: Number(data.get('saved') || 0),
        note: String(data.get('note') || ''),
      });
      render();
    });
  }
}

function render() {
  window.__shotReady = false;
  const route = currentRoute();
  setActiveNav(route);
  if (route === 'dashboard') {
    document.title = 'Dompet Keluarga: Anggaran Rumah Tangga November 2026';
    app.innerHTML = dashboard();
    bindDashboard();
  } else if (route === 'transaksi') {
    document.title = 'Transaksi | Dompet Keluarga';
    app.innerHTML = transactionsPage(transactionFilter.category, transactionFilter.text, editingTransactionId);
    bindTransactions();
  } else if (route === 'anggaran') {
    document.title = 'Anggaran | Dompet Keluarga';
    app.innerHTML = budgetsPage();
    bindBudgets();
  } else if (route === 'tujuan') {
    document.title = 'Tujuan Tabungan | Dompet Keluarga';
    app.innerHTML = goalsPage();
    bindGoals();
  } else if (route === 'laporan') {
    document.title = 'Laporan Bulanan | Dompet Keluarga';
    app.innerHTML = reportPage();
  } else {
    document.title = 'Tidak ditemukan | Dompet Keluarga';
    app.innerHTML = notFoundPage();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
window.addEventListener('resize', () => {
  if (currentRoute() === 'dashboard') bindDashboard();
});
render();
