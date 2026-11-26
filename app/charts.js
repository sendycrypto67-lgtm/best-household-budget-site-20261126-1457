// charts.js: semua grafik digambar di canvas, tanpa pustaka dan tanpa gambar.
// Bar membandingkan anggaran dengan yang terpakai, donat menunjukkan porsi
// tiap kategori dari total belanja bulan ini.
import { CATEGORIES } from './data.js';
import { budgetStatus, formatShort } from './store.js';

function setupCanvas(canvas, height) {
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || 600;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return { ctx, width, height };
}

function textColor() {
  return '#334155';
}

export function drawBudgetBars(canvas) {
  const rowHeight = 34;
  const labelWidth = 108;
  const valueWidth = 128;
  const height = CATEGORIES.length * rowHeight + 46;
  const { ctx, width } = setupCanvas(canvas, height);
  const maxValue = Math.max(...CATEGORIES.map((c) => Math.max(budgetStatus(c.id).budget, budgetStatus(c.id).spent)), 1);
  const barArea = Math.max(width - labelWidth - valueWidth, 60);

  ctx.font = '12px system-ui, sans-serif';
  CATEGORIES.forEach((category, index) => {
    const status = budgetStatus(category.id);
    const y = 14 + index * rowHeight;
    ctx.fillStyle = textColor();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(category.name, 0, y + 8, labelWidth - 8);
    const budgetWidth = (status.budget / maxValue) * barArea;
    const spentWidth = (status.spent / maxValue) * barArea;
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(labelWidth, y, budgetWidth, 10, 5);
    ctx.fill();
    ctx.fillStyle = status.level === 'over' ? '#b91c1c' : category.color;
    ctx.beginPath();
    ctx.roundRect(labelWidth, y, Math.max(spentWidth, 2), 10, 5);
    ctx.fill();
    ctx.fillStyle = status.level === 'over' ? '#b91c1c' : textColor();
    ctx.fillText(`${formatShort(status.spent)} / ${formatShort(status.budget)}`, labelWidth + budgetWidth + 8, y + 8);
  });

  ctx.fillStyle = '#64748b';
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillText('Batang penuh = anggaran. Batang warna = yang sudah terpakai. Merah = lewat anggaran.', 0, height - 12);
}

export function drawSpendingDonut(canvas) {
  const size = 230;
  const narrow = (canvas.clientWidth || 600) < 440;
  const legendHeight = narrow ? 4 * 24 + 8 : 0;
  const { ctx, width } = setupCanvas(canvas, size + 24 + legendHeight);
  const centerX = narrow ? Math.round(width / 2) : 118;
  const centerY = 118;
  const radius = 88;
  const inner = 56;
  const total = CATEGORIES.reduce((sum, c) => sum + budgetStatus(c.id).spent, 0);
  let angle = -Math.PI / 2;

  ctx.font = '12px system-ui, sans-serif';
  CATEGORIES.forEach((category) => {
    const spent = budgetStatus(category.id).spent;
    if (spent <= 0 || total <= 0) return;
    const slice = (spent / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.fillStyle = category.color;
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, angle, angle + slice);
    ctx.closePath();
    ctx.fill();
    angle += slice;
  });

  ctx.beginPath();
  ctx.fillStyle = '#ffffff';
  ctx.arc(centerX, centerY, inner, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(formatShort(total), centerX, centerY - 8);
  ctx.fillStyle = '#64748b';
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillText('total belanja', centerX, centerY + 12);

  // Legenda: di kanan lingkaran pada layar lebar, dua kolom di bawah pada layar sempit.
  ctx.fillStyle = textColor();
  ctx.textAlign = 'left';
  ctx.font = '12px system-ui, sans-serif';
  if (narrow) {
    CATEGORIES.forEach((category, index) => {
      const spent = budgetStatus(category.id).spent;
      const share = total > 0 ? Math.round((spent / total) * 100) : 0;
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = col === 0 ? 8 : Math.round(width / 2) + 8;
      const y = size + 22 + row * 24;
      ctx.fillStyle = category.color;
      ctx.fillRect(x, y - 5, 10, 10);
      ctx.fillStyle = textColor();
      ctx.fillText(`${category.name} ${share}%`, x + 16, y);
    });
    return;
  }
  let legendY = 26;
  CATEGORIES.forEach((category) => {
    const spent = budgetStatus(category.id).spent;
    const share = total > 0 ? Math.round((spent / total) * 100) : 0;
    ctx.fillStyle = category.color;
    ctx.fillRect(228, legendY - 5, 10, 10);
    ctx.fillStyle = textColor();
    ctx.fillText(`${category.name} ${share}%`, 244, legendY);
    legendY += 26;
  });
}
