// Data awal Dompet Keluarga: anggaran dan transaksi bulan November 2026.
// Semua angka dalam Rupiah. Jumlah per kategori dihitung dari transaksi di
// bawah oleh store.js, jadi angka di semua halaman selalu konsisten.
export const MONTH_LABEL = 'November 2026';
export const PREVIOUS_MONTH_LABEL = 'Oktober 2026';
export const INCOME = 8500000;

export const CATEGORIES = [
  { id: 'belanja', name: 'Belanja Harian', budget: 2500000, color: '#15803d', note: 'Pasar, supermarket, dan kebutuhan dapur' },
  { id: 'listrik', name: 'Listrik dan Air', budget: 600000, color: '#0369a1', note: 'Token listrik dan tagihan air' },
  { id: 'transport', name: 'Transport', budget: 800000, color: '#b45309', note: 'Bensin, ojek online, dan parkir' },
  { id: 'pendidikan', name: 'Pendidikan Anak', budget: 1200000, color: '#6d28d9', note: 'SPP, buku, dan les' },
  { id: 'kesehatan', name: 'Kesehatan', budget: 500000, color: '#be185d', note: 'Obat dan periksa dokter' },
  { id: 'hiburan', name: 'Hiburan', budget: 400000, color: '#0f766e', note: 'Nonton, streaming, dan makan di luar' },
  { id: 'tabungan', name: 'Tabungan', budget: 1500000, color: '#166534', note: 'Disisihkan di awal bulan' },
  { id: 'cicilan', name: 'Cicilan', budget: 1000000, color: '#334155', note: 'Cicilan motor tiap tanggal 10' },
];

// Belanja bulan lalu, dipakai halaman Laporan untuk perbandingan.
export const PREVIOUS_MONTH_SPENT = {
  belanja: 2580000,
  listrik: 545000,
  transport: 610000,
  pendidikan: 980000,
  kesehatan: 195000,
  hiburan: 520000,
  tabungan: 1500000,
  cicilan: 1000000,
};

export const INITIAL_TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', description: 'SPP sekolah anak', category: 'pendidikan', amount: 650000 },
  { id: 't02', date: '2026-11-01', description: 'Setoran tabungan awal bulan', category: 'tabungan', amount: 1500000 },
  { id: 't03', date: '2026-11-02', description: 'Pasar pagi Minggu', category: 'belanja', amount: 185000 },
  { id: 't04', date: '2026-11-03', description: 'Bensin motor', category: 'transport', amount: 50000 },
  { id: 't05', date: '2026-11-04', description: 'Belanja bulanan supermarket', category: 'belanja', amount: 642000 },
  { id: 't06', date: '2026-11-05', description: 'Token listrik 200 ribu', category: 'listrik', amount: 200000 },
  { id: 't07', date: '2026-11-06', description: 'Sayur dan buah pasar', category: 'belanja', amount: 96000 },
  { id: 't08', date: '2026-11-06', description: 'Obat flu anak', category: 'kesehatan', amount: 68000 },
  { id: 't09', date: '2026-11-07', description: 'Ongkos ojek online', category: 'transport', amount: 38000 },
  { id: 't10', date: '2026-11-08', description: 'Buku dan alat tulis', category: 'pendidikan', amount: 145000 },
  { id: 't11', date: '2026-11-08', description: 'Nonton bioskop keluarga', category: 'hiburan', amount: 185000 },
  { id: 't12', date: '2026-11-09', description: 'Beras 10 kg dan minyak goreng', category: 'belanja', amount: 178000 },
  { id: 't13', date: '2026-11-10', description: 'Cicilan motor', category: 'cicilan', amount: 1000000 },
  { id: 't14', date: '2026-11-10', description: 'Bensin motor', category: 'transport', amount: 50000 },
  { id: 't15', date: '2026-11-11', description: 'Jajan anak sekolah', category: 'belanja', amount: 45000 },
  { id: 't16', date: '2026-11-12', description: 'Tagihan air PDAM', category: 'listrik', amount: 142000 },
  { id: 't17', date: '2026-11-13', description: 'Pasar dan lauk pauk', category: 'belanja', amount: 214000 },
  { id: 't18', date: '2026-11-14', description: 'Parkir dan tol', category: 'transport', amount: 65000 },
  { id: 't19', date: '2026-11-14', description: 'Langganan streaming', category: 'hiburan', amount: 59000 },
  { id: 't20', date: '2026-11-15', description: 'Servis motor ringan', category: 'transport', amount: 185000 },
  { id: 't21', date: '2026-11-16', description: 'Belanja mingguan supermarket', category: 'belanja', amount: 388000 },
  { id: 't22', date: '2026-11-16', description: 'Periksa gigi', category: 'kesehatan', amount: 210000 },
  { id: 't23', date: '2026-11-17', description: 'Bensin motor', category: 'transport', amount: 50000 },
  { id: 't24', date: '2026-11-18', description: 'Les matematika anak', category: 'pendidikan', amount: 250000 },
  { id: 't25', date: '2026-11-19', description: 'Gas LPG 3 kg', category: 'belanja', amount: 27000 },
  { id: 't26', date: '2026-11-20', description: 'Token listrik 170 ribu', category: 'listrik', amount: 170000 },
  { id: 't27', date: '2026-11-21', description: 'Sayur, buah, dan telur', category: 'belanja', amount: 132000 },
  { id: 't28', date: '2026-11-21', description: 'Ongkos ojek online', category: 'transport', amount: 42000 },
  { id: 't29', date: '2026-11-22', description: 'Makan di luar akhir pekan', category: 'hiburan', amount: 212000 },
  { id: 't30', date: '2026-11-23', description: 'Belanja mingguan supermarket', category: 'belanja', amount: 356000 },
  { id: 't31', date: '2026-11-24', description: 'Bensin motor', category: 'transport', amount: 50000 },
  { id: 't32', date: '2026-11-25', description: 'Daging dan ayam', category: 'belanja', amount: 148000 },
];

export const INITIAL_GOALS = [
  { id: 'g1', name: 'Dana Darurat', target: 10000000, saved: 6250000, note: 'Target 6 bulan pengeluaran pokok, selesai Juni 2027' },
  { id: 'g2', name: 'Liburan Keluarga', target: 5000000, saved: 2800000, note: 'Liburan ke Yogyakarta, berangkat Desember 2026' },
  { id: 'g3', name: 'Laptop Anak', target: 7500000, saved: 3100000, note: 'Untuk belajar dan tugas sekolah, beli awal 2027' },
  { id: 'g4', name: 'Renovasi Dapur', target: 12000000, saved: 1200000, note: 'Ganti atap bocor dan rak dapur' },
];

export const SAVING_TIPS = [
  { title: 'Belanja pasar pagi, bukan malam', body: 'Harga sayur dan lauk di pasar pagi rata-rata 15 sampai 20 persen lebih murah. Bulan ini Belanja Harian turun Rp169.000 dari Oktober karena belanja mingguan dibuat sekali jalan, bukan bolak-balik tiap hari.' },
  { title: 'Masak bekal tiga kali seminggu', body: 'Satu kali makan di luar akhir pekan menghabiskan Rp212.000, hampir setengah anggaran Hiburan. Bekal masakan rumah tiga kali seminggu bisa memangkas jajan dan makan di luar sekitar Rp150.000 per bulan.' },
  { title: 'Matikan AC satu jam lebih awal', body: 'Token listrik bulan ini Rp370.000 dari anggaran Rp600.000. Mematikan AC satu jam sebelum bangun dan memakai kipas di siang hari bisa menghemat sekitar Rp50.000 per bulan tanpa terasa.' },
  { title: 'Satu langganan streaming saja', body: 'Keluarga ini memakai satu langganan streaming Rp59.000 per bulan. Menambah satu layanan lagi berarti Rp59.000 lagi tiap bulan, setara 15 persen anggaran Hiburan. Tonton sampai habis, baru ganti.' },
  { title: 'Pisahkan tabungan di awal bulan', body: 'Rp1.500.000 dipindah ke rekening tabungan setiap tanggal 1, sebelum belanja apa pun. Cara ini yang membuat Dana Darurat sudah 62 persen tercapai, bukan menyisakan uang di akhir bulan.' },
  { title: 'Servis motor terjadwal, bukan saat rusak', body: 'Servis ringan Rp185.000 bulan ini mencegah kerusakan besar. Servis tiap 3 bulan sekali dan ganti oli tepat waktu jauh lebih murah daripada turun mesin yang bisa jutaan Rupiah.' },
];
