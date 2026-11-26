// Dompet Keluarga: entry make.fun untuk bounty situs anggaran rumah tangga
// (Node 22, standard library only). Situsnya adalah file statis di app/:
// index.html dibuka di desktop Chrome maupun ponsel dan berjalan tanpa
// jaringan, semua kontennya file sendiri. Program ini menyerahkan situs itu:
// menyalin app/ dan screenshots/ dari samping file ini ke /output lalu
// menulis /output/dossier.json, ringkasan yang dibaca juri (screenshot,
// file dan byte first load, dan source), dengan pustaka make.fun yang
// divendor. Biarkan vendor/makefun-frontend.ts apa adanya: scorer menuntut
// dossier.json sama byte demi byte dengan yang ditulis salinan pustakanya.
//
// Jalankan di luar grader dengan MAKEFUN_OUTPUT_DIR sebagai pengganti /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Menyerahkan entry yang sama dua kali harus menulis byte yang sama: tidak
// ada stempel waktu atau angka acak di output, dan salinan direktori selalu
// berurutan sama. Jaga invarian itu saat mengubah file ini.
if (!existsSync(join(here, 'app', 'index.html'))) {
  throw new Error('app/index.html tidak ditemukan: jalankan dari root repositori entry');
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Batas scorer sendiri (reference/gate.json): hanya text_max_bytes yang
// membentuk byte; sisanya menolak entry yang scorer juga tolak (lebih dari
// 4 screenshot atau satu di atas 256 KiB; lebih dari 993 file dan direktori
// di app/ atau 16 MiB file app/: app/ dihitung bersama batas 1000 entri
// /output, screenshot dan dossier.json-nya).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
