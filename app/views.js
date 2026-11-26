// views.js: HTML tiap halaman Dompet Keluarga. Semua angka diambil dari
// store.js, jadi ringkasan, grafik, dan tabel tidak pernah berbeda.
import { CATEGORIES, MONTH_LABEL, PREVIOUS_MONTH_LABEL, PREVIOUS_MONTH_SPENT, SAVING_TIPS } from './data.js';
import {
  budgetStatus, categoryById, formatDate, formatRupiah, formatShort,
  remainingMoney, state, totalBudget, totalSpent,
} from './store.js';

export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function progressBar(status) {
  const width = Math.min(status.percent, 100);
  const cls = status.level === 'over' ? 'bar-over' : status.level === 'warn' ? 'bar-warn' : 'bar-ok';
  return `<div class="progress" role="img" aria-label="${status.percent} persen anggaran terpakai">
    <div class="progress-fill ${cls}" style="width:${width}%"></div>
  </div>`;
}

function statusBadge(status) {
  if (status.level === 'over') return '<span class="badge badge-over">Lewat anggaran</span>';
  if (status.level === 'warn') return '<span class="badge badge-warn">Hampir habis</span>';
  return '<span class="badge badge-ok">Aman</span>';
}

function categoryOptions(selectedId) {
  return CATEGORIES.map((c) => `<option value="${c.id}"${c.id === selectedId ? ' selected' : ''}>${c.name}</option>`).join('');
}

function transactionRows(transactions) {
  if (transactions.length === 0) {
    return '<tr><td colspan="5" class="empty">Belum ada transaksi yang cocok. Tambah transaksi baru lewat formulir di atas.</td></tr>';
  }
  return transactions.map((t) => {
    const category = categoryById(t.category);
    return `<tr>
      <td>${formatDate(t.date)}</td>
      <td>${escapeHtml(t.description)}</td>
      <td><span class="dot" style="background:${category ? category.color : '#64748b'}"></span>${category ? category.name : 'Lainnya'}</td>
      <td class="amount">${formatRupiah(t.amount)}</td>
      <td class="row-actions"><button type="button" data-edit="${t.id}">Ubah</button><button type="button" data-delete="${t.id}">Hapus</button></td>
    </tr>`;
  }).join('');
}

export function dashboard() {
  const spent = totalSpent();
  const remaining = remainingMoney();
  const budget = totalBudget();
  const usedPercent = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const over = CATEGORIES.filter((c) => budgetStatus(c.id).level === 'over');
  const overDetail = over.map((c) => {
    const status = budgetStatus(c.id);
    return `${c.name} sudah ${status.percent}% dari anggaran ${formatRupiah(status.budget)}, lewat ${formatRupiah(-status.remaining)}.`;
  }).join(' ');
  const nearFull = CATEGORIES.filter((c) => budgetStatus(c.id).level === 'warn')
    .map((c) => `${c.name} sudah ${budgetStatus(c.id).percent}%`)
    .join(', ');
  const recent = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);
  const topGoals = [...state.goals].sort((a, b) => (b.saved / b.target) - (a.saved / a.target)).slice(0, 3);

  const categoryCards = CATEGORIES.map((c) => {
    const status = budgetStatus(c.id);
    return `<article class="cat-card">
      <div class="cat-head"><span class="dot" style="background:${c.color}"></span><h3>${c.name}</h3>${statusBadge(status)}</div>
      <p class="cat-numbers"><strong>${formatRupiah(status.spent)}</strong> dari ${formatRupiah(status.budget)}</p>
      ${progressBar(status)}
      <p class="cat-meta">${status.percent}% terpakai &middot; sisa ${formatRupiah(Math.max(status.remaining, 0))}${status.level === 'over' ? ` &middot; lewat ${formatRupiah(-status.remaining)}` : ''}</p>
    </article>`;
  }).join('');

  const goalItems = topGoals.map((g) => {
    const percent = Math.round((g.saved / g.target) * 100);
    return `<li><div class="goal-line"><strong>${escapeHtml(g.name)}</strong><span>${formatShort(g.saved)} / ${formatShort(g.target)} (${percent}%)</span></div>
      <div class="progress"><div class="progress-fill bar-ok" style="width:${percent}%"></div></div></li>`;
  }).join('');

  return `
  <section class="hero">
    <div>
      <p class="eyebrow">Anggaran keluarga &middot; ${MONTH_LABEL}</p>
      <h1>Uang keluarga terkendali, bulan ini dan bulan depan.</h1>
      <p class="lede">Dompet Keluarga mencatat setiap Rupiah yang masuk dan keluar, membandingkannya dengan anggaran tiap kategori, dan menunjukkan sisa uang sebelum bulan berakhir.</p>
    </div>
    <div class="hero-alert">
      <strong>${over.length > 0 ? `Perhatian: ${over.length} kategori lewat anggaran` : 'Semua kategori masih dalam anggaran'}</strong>
      <p>${over.length > 0 ? `${overDetail} Tahan belanja di kategori itu sampai akhir bulan, atau pindahkan dana dari kategori yang masih longgar.` : `Belanja berjalan sesuai rencana.${nearFull ? ` ${nearFull}.` : ''}`}</p>
      <p><a class="button" href="#/anggaran">Periksa anggaran</a></p>
    </div>
  </section>

  <section class="summary" aria-label="Ringkasan bulan ini">
    <article class="stat"><span>Pemasukan</span><strong>${formatRupiah(state.income)}</strong><small>Gaji dan pemasukan lain</small></article>
    <article class="stat"><span>Total belanja</span><strong>${formatRupiah(spent)}</strong><small>${usedPercent}% dari anggaran ${formatShort(budget)}</small></article>
    <article class="stat stat-good"><span>Sisa uang</span><strong>${formatRupiah(remaining)}</strong><small>Tersedia sampai 30 November</small></article>
    <article class="stat"><span>Ditabung bulan ini</span><strong>${formatRupiah(budgetStatus('tabungan').spent)}</strong><small>${escapeHtml(state.goals[0].name)} sudah ${Math.round((state.goals[0].saved / state.goals[0].target) * 100)}% tercapai</small></article>
  </section>

  <section class="grid-2">
    <article class="card">
      <h2>Anggaran lawan yang terpakai</h2>
      <p class="card-sub">Batang warna menunjukkan yang sudah dibelanjakan, batang abu-abu menunjukkan anggaran.</p>
      <canvas id="chart-bars" width="600" height="320" aria-label="Grafik batang anggaran lawan pengeluaran"></canvas>
    </article>
    <article class="card">
      <h2>Ke mana uang pergi</h2>
      <p class="card-sub">Porsi tiap kategori dari total belanja ${formatRupiah(spent)} bulan ini.</p>
      <canvas id="chart-donut" width="520" height="260" aria-label="Grafik donat porsi belanja"></canvas>
    </article>
  </section>

  <section>
    <div class="section-head"><h2>Anggaran tiap kategori</h2><a href="#/anggaran">Atur anggaran &rarr;</a></div>
    <div class="cat-grid">${categoryCards}</div>
  </section>

  <section class="grid-2">
    <article class="card">
      <div class="section-head"><h2>Transaksi terbaru</h2><a href="#/transaksi">Semua transaksi &rarr;</a></div>
      <div class="table-wrap">
      <table class="table"><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th>Jumlah</th></tr></thead>
      <tbody>${recent.map((t) => {
        const category = categoryById(t.category);
        return `<tr><td>${formatDate(t.date)}</td><td>${escapeHtml(t.description)}</td><td>${category ? category.name : 'Lainnya'}</td><td class="amount">${formatRupiah(t.amount)}</td></tr>`;
      }).join('')}</tbody></table>
      </div>
    </article>
    <article class="card">
      <div class="section-head"><h2>Tujuan tabungan</h2><a href="#/tujuan">Semua tujuan &rarr;</a></div>
      <ul class="goal-list">${goalItems}</ul>
      <p class="card-sub">Total terkumpul dari 4 tujuan: ${formatRupiah(state.goals.reduce((s, g) => s + g.saved, 0))} dari target ${formatRupiah(state.goals.reduce((s, g) => s + g.target, 0))}.</p>
    </article>
  </section>`;
}

export function transactionsPage(filterCategory, filterText, editingId) {
  const editing = editingId ? state.transactions.find((t) => t.id === editingId) : null;
  let list = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1));
  if (filterCategory && filterCategory !== 'semua') list = list.filter((t) => t.category === filterCategory);
  if (filterText) {
    const needle = filterText.toLowerCase();
    list = list.filter((t) => t.description.toLowerCase().includes(needle));
  }
  const shownTotal = list.reduce((s, t) => s + Number(t.amount || 0), 0);

  return `
  <h1>Transaksi</h1>
  <p class="lede">Semua pemasukan dan pengeluaran keluarga bulan ${MONTH_LABEL}. Tambah, ubah, atau hapus transaksi, dan total di bawah langsung berubah.</p>

  <section class="card form-card">
    <h2>${editing ? 'Ubah transaksi' : 'Tambah transaksi baru'}</h2>
    <form id="transaction-form" data-editing="${editing ? editing.id : ''}">
      <div class="form-grid">
        <label>Tanggal<input type="date" name="date" required value="${editing ? editing.date : '2026-11-26'}"></label>
        <label>Keterangan<input type="text" name="description" required maxlength="80" placeholder="Contoh: Belanja mingguan supermarket" value="${editing ? escapeHtml(editing.description) : ''}"></label>
        <label>Kategori<select name="category">${categoryOptions(editing ? editing.category : 'belanja')}</select></label>
        <label>Jumlah (Rp)<input type="number" name="amount" required min="1000" step="1000" placeholder="150000" value="${editing ? editing.amount : ''}"></label>
      </div>
      <div class="form-actions">
        <button class="button" type="submit">${editing ? 'Simpan perubahan' : 'Tambah transaksi'}</button>
        ${editing ? '<button type="button" class="button button-ghost" data-cancel-edit>Batalkan ubah</button>' : ''}
        <span id="form-note" class="form-note" aria-live="polite"></span>
      </div>
    </form>
  </section>

  <section class="card">
    <div class="filter-row">
      <label>Filter kategori
        <select id="filter-category">
          <option value="semua">Semua kategori</option>
          ${CATEGORIES.map((c) => `<option value="${c.id}"${filterCategory === c.id ? ' selected' : ''}>${c.name}</option>`).join('')}
        </select>
      </label>
      <label>Cari keterangan
        <input type="search" id="filter-text" placeholder="Contoh: bensin, pasar, SPP" value="${escapeHtml(filterText)}">
      </label>
      <p class="filter-total">Menampilkan <strong>${list.length}</strong> transaksi, total <strong>${formatRupiah(shownTotal)}</strong></p>
    </div>
    <div class="table-wrap">
    <table class="table"><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th>Jumlah</th><th>Aksi</th></tr></thead>
    <tbody>${transactionRows(list)}</tbody></table>
    </div>
    <p class="card-sub">Transaksi tersimpan otomatis di peramban ini, jadi angka di Dasbor, Anggaran, dan Laporan ikut berubah.</p>
  </section>`;
}

export function budgetsPage() {
  const rows = CATEGORIES.map((c) => {
    const status = budgetStatus(c.id);
    return `<article class="budget-row">
      <div class="budget-info"><span class="dot" style="background:${c.color}"></span>
        <div><h3>${c.name}</h3><p>${c.note}</p></div>
      </div>
      <div class="budget-numbers">
        <p><strong>${formatRupiah(status.spent)}</strong> terpakai dari ${formatRupiah(status.budget)}</p>
        ${progressBar(status)}
        <p class="cat-meta">${status.percent}% terpakai ${statusBadge(status)}</p>
      </div>
      <label class="budget-edit">Anggaran baru (Rp)
        <input type="number" min="0" step="10000" value="${status.budget}" data-budget="${c.id}">
      </label>
    </article>`;
  }).join('');

  return `
  <h1>Anggaran</h1>
  <p class="lede">Atur batas belanja tiap kategori untuk bulan ${MONTH_LABEL}. Total anggaran ${formatRupiah(totalBudget())} dari pemasukan ${formatRupiah(state.income)}; sisanya ${formatRupiah(state.income - totalBudget())} tidak dianggarkan.</p>
  <section class="card">
    <h2>Ubah pemasukan bulanan</h2>
    <form id="income-form" class="inline-form">
      <label>Pemasukan bulan ini (Rp)<input type="number" name="income" min="100000" step="50000" value="${state.income}"></label>
      <button class="button" type="submit">Simpan pemasukan</button>
      <span class="form-note" aria-live="polite"></span>
    </form>
  </section>
  <section class="budget-list">${rows}</section>
  <div class="form-actions">
    <button class="button" type="button" id="save-budgets">Simpan semua anggaran</button>
    <button type="button" class="button button-ghost" id="reset-data">Kembalikan data awal</button>
    <span id="budget-note" class="form-note" aria-live="polite"></span>
  </div>
  <section class="card tip-card">
    <h2>Aturan yang dipakai keluarga ini</h2>
    <ul>
      <li>Tabungan dipisah di awal bulan, bukan dari sisa belanja.</li>
      <li>Satu kategori boleh lewat anggaran, asal total bulan ini tetap di bawah pemasukan.</li>
      <li>Kategori yang mencapai 85% mendapat peringatan, dan yang lewat anggaran ditandai merah.</li>
    </ul>
  </section>`;
}

export function goalsPage() {
  const cards = state.goals.map((g) => {
    const percent = Math.round((g.saved / g.target) * 100);
    const left = g.target - g.saved;
    return `<article class="goal-card">
      <h3>${escapeHtml(g.name)}</h3>
      <p class="goal-numbers"><strong>${formatRupiah(g.saved)}</strong> dari ${formatRupiah(g.target)}</p>
      <div class="progress"><div class="progress-fill bar-ok" style="width:${Math.min(percent, 100)}%"></div></div>
      <p class="cat-meta">${percent}% tercapai &middot; kurang ${formatRupiah(Math.max(left, 0))}</p>
      <p class="card-sub">${escapeHtml(g.note)}</p>
      <form class="inline-form deposit-form" data-goal="${g.id}">
        <label>Setor (Rp)<input type="number" name="amount" min="10000" step="10000" placeholder="100000" required></label>
        <button class="button" type="submit">Setor</button>
      </form>
    </article>`;
  }).join('');

  return `
  <h1>Tujuan Tabungan</h1>
  <p class="lede">Empat tujuan keluarga, dari dana darurat sampai renovasi dapur. Setoran langsung menambah progress dan tersimpan otomatis.</p>
  <section class="goal-grid">${cards}</section>
  <section class="card form-card">
    <h2>Buat tujuan baru</h2>
    <form id="goal-form">
      <div class="form-grid">
        <label>Nama tujuan<input type="text" name="name" required maxlength="60" placeholder="Contoh: Umroh keluarga"></label>
        <label>Target (Rp)<input type="number" name="target" required min="100000" step="50000" placeholder="5000000"></label>
        <label>Sudah terkumpul (Rp)<input type="number" name="saved" min="0" step="50000" value="0"></label>
        <label>Catatan<input type="text" name="note" maxlength="120" placeholder="Contoh: Berangkat tahun depan"></label>
      </div>
      <div class="form-actions"><button class="button" type="submit">Tambah tujuan</button><span class="form-note" aria-live="polite"></span></div>
    </form>
  </section>`;
}

export function reportPage() {
  const spent = totalSpent();
  const prevTotal = Object.values(PREVIOUS_MONTH_SPENT).reduce((s, v) => s + v, 0);
  const diff = spent - prevTotal;
  const rows = CATEGORIES.map((c) => {
    const now = budgetStatus(c.id).spent;
    const prev = PREVIOUS_MONTH_SPENT[c.id] || 0;
    const change = now - prev;
    const arrow = change > 0 ? 'naik' : change < 0 ? 'turun' : 'sama';
    return `<tr><td>${c.name}</td><td class="amount">${formatRupiah(prev)}</td><td class="amount">${formatRupiah(now)}</td>
      <td class="amount ${change > 0 ? 'up' : change < 0 ? 'down' : ''}">${change === 0 ? 'Rp0' : `${change > 0 ? '+' : '−'}${formatRupiah(Math.abs(change)).slice(2)}`} (${arrow})</td></tr>`;
  }).join('');

  const tips = SAVING_TIPS.map((t) => `<article class="tip"><h3>${escapeHtml(t.title)}</h3><p>${escapeHtml(t.body)}</p></article>`).join('');

  return `
  <h1>Laporan Bulanan</h1>
  <p class="lede">Ringkasan ${MONTH_LABEL} dibanding ${PREVIOUS_MONTH_LABEL}, lengkap dengan tips hemat yang dihitung dari angka keluarga ini sendiri.</p>

  <section class="summary" aria-label="Ringkasan laporan">
    <article class="stat"><span>Belanja ${PREVIOUS_MONTH_LABEL}</span><strong>${formatRupiah(prevTotal)}</strong><small>Dari pemasukan Rp8.500.000</small></article>
    <article class="stat"><span>Belanja ${MONTH_LABEL}</span><strong>${formatRupiah(spent)}</strong><small>${Math.round((spent / state.income) * 100)}% dari pemasukan</small></article>
    <article class="stat ${diff <= 0 ? 'stat-good' : 'stat-bad'}"><span>Selisih</span><strong>${diff <= 0 ? 'Hemat' : 'Lebih boros'} ${formatRupiah(Math.abs(diff))}</strong><small>${diff <= 0 ? 'Dibanding bulan lalu, uang yang tidak terpakai masuk ke Dana Darurat' : 'Dibanding bulan lalu'}</small></article>
    <article class="stat"><span>Sisa uang bulan ini</span><strong>${formatRupiah(remainingMoney())}</strong><small>Tabungan sudah termasuk di dalamnya</small></article>
  </section>

  <section class="card">
    <h2>Perbandingan per kategori</h2>
    <div class="table-wrap">
    <table class="table"><thead><tr><th>Kategori</th><th>${PREVIOUS_MONTH_LABEL}</th><th>${MONTH_LABEL}</th><th>Selisih</th></tr></thead>
    <tbody>${rows}</tbody></table>
    </div>
    <p class="card-sub">Kenaikan terbesar ada di Kesehatan (+Rp83.000, periksa gigi) dan Pendidikan (+Rp65.000, les matematika). Penurunan terbesar ada di Belanja Harian (hemat Rp169.000) dan Transport (hemat Rp80.000).</p>
  </section>

  <section>
    <div class="section-head"><h2>Enam tips hemat dari angka bulan ini</h2></div>
    <div class="tips-grid">${tips}</div>
  </section>`;
}

export function notFoundPage() {
  return `<h1>Halaman tidak ditemukan</h1>
  <p class="lede">Alamat yang dibuka tidak ada di Dompet Keluarga. Kembali ke <a href="#/">Dasbor</a> untuk melihat ringkasan anggaran bulan ini.</p>`;
}
