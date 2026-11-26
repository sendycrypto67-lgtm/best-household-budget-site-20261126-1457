# Dompet Keluarga

[![make.fun bounty](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/sendycrypto67-lgtm/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/sendycrypto67-lgtm/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

Situs anggaran rumah tangga Indonesia yang benar-benar bekerja, dibuat untuk bounty make.fun [Make the best household budget site](https://make.fun/bounty/best-household-budget-site-20261126-1457). Berjalan penuh tanpa internet, tanpa framework, dan tanpa build step: file statis di `app/` yang dibuka di desktop Chrome maupun ponsel.

## Yang bisa dilakukan situs ini

- **Dasbor** (`#/`): ringkasan bulan November 2026, pemasukan Rp8.500.000, total belanja, sisa uang, grafik batang anggaran lawan yang terpakai, grafik donat porsi belanja, progress tiap kategori, transaksi terbaru, dan progress tujuan tabungan.
- **Transaksi** (`#/transaksi`): tambah, ubah, dan hapus transaksi, filter per kategori, cari keterangan. Semua perubahan tersimpan di localStorage dan langsung mengubah angka di semua halaman.
- **Anggaran** (`#/anggaran`): ubah pemasukan bulanan dan anggaran tiap kategori, lengkap dengan progress bar, badge peringatan 85 persen, dan tanda merah untuk kategori yang lewat anggaran.
- **Tujuan** (`#/tujuan`): empat tujuan tabungan (Dana Darurat, Liburan Keluarga, Laptop Anak, Renovasi Dapur) dengan progress dan setoran, plus formulir membuat tujuan baru.
- **Laporan** (`#/laporan`): perbandingan November 2026 dengan Oktober 2026 per kategori, selisih hemat Rp198.000, dan enam tips hemat yang dihitung dari angka keluarga ini sendiri.

Semua angka konsisten antar halaman karena dihitung dari satu state di `app/store.js`.

## Struktur

- `app/index.html` — kerangka halaman dan navigasi
- `app/style.css` — seluruh gaya, termasuk layout ponsel
- `app/data.js` — data awal: anggaran, 32 transaksi, 4 tujuan, tips hemat
- `app/store.js` — state, localStorage, dan semua hitungan total
- `app/charts.js` — grafik batang dan donat di canvas
- `app/views.js` — HTML tiap halaman
- `app/main.js` — router hash dan pengikat kontrol
- `main.ts` — program penyerahan entry (menyalin `app/` dan `screenshots/` ke `/output`, menulis `dossier.json`)
- `serve.ts` — server statis kecil untuk pengembangan lokal
- `screenshots/` — 4 screenshot render asli situs ini

## Menjalankan lokal

```sh
node serve.ts
```

Lalu buka http://localhost:8080 di peramban.

## Lisensi

MIT, lihat `LICENSE`.
