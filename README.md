<p align="center">
  <img src="public/icons.svg" width="100" alt="SISFO DART Logo" style="filter: drop-shadow(0 0 10px rgba(230,194,31,0.5));">
</p>

# SISFO DART Command Center
> **Dynamic Autonomous Retaliatory Target (DART) - BENGPUS PUSKOMLEKAD**

SISFO DART (Sistem Informasi DART) adalah aplikasi Helpdesk Terpadu, Manajemen Mutasi Unit, dan Command Center Teritorial yang dirancang khusus untuk mengelola, melacak, dan merespons laporan kerusakan unit sasaran tembak DART serta dukungan perbaikan teknis di seluruh jajaran Komando Daerah Militer (KODAM) dan Satuan TNI di Indonesia.

---

## 🌟 Fitur Utama

- **Role-Based Access Control (RBAC):** Sistem otorisasi menggunakan Spatie Laravel Permission dengan 5 tingkat pengguna (*Admin*, *Supervisor*, *Staf*, *Teknisi*, dan *Pelapor*).
- **Peta Interaktif Monitoring Sebaran Unit (GIS):** Integrasi Leaflet & OpenStreetMap (OSM) tanpa API key untuk memantau titik koordinat Satuan/KODAM, unit siap ops, dan unit dalam perbaikan di seluruh Indonesia.
- **Pencarian Alamat & Auto-Fill Koordinat Satuan:** Dukungan `leaflet-geosearch` (Nominatim OSM) yang otomatis mengisi latitude, longitude, dan alamat lengkap satuan secara gratis tanpa ketergantungan Google Maps API.
- **Manajemen Tiket & Perbaikan Responsif:** Pelaporan kendala terstruktur dengan dukungan perbaikan (Swadaya & Non-Swadaya), estimasi biaya anggaran, bukti foto/dokumen, serta tanda terima digital.
- **Delegasi Tugas (Tasking) Teknisi:** Staf/Admin dapat menugaskan tiket laporan langsung ke Teknisi dengan spesialisasi yang sesuai (Mekanik, Elektronik, Jaringan Komunikasi).
- **Pusat Mutasi Personel & Inventaris:** Pengajuan dan persetujuan mutasi unit antar satuan, mutasi penempatan pengguna, serta riwayat log mutasi lengkap.
- **Cakupan Teritorial 27 KODAM se-Indonesia:** Template akun operator resmi siap pakai untuk seluruh 27 KODAM (KODAM Klasik & KODAM Pemekaran Baru).
- **Laporan & Rekapitulasi Otomatis:** Ekspor rekapitulasi operasional berkala dan berita acara serah terima perbaikan.
- **Log Keamanan (Audit Trail):** Pencatatan riwayat setiap aksi pengguna untuk keamanan data operasional (*Operational Security*).
- **Desain Modern Cighra Tactical (Dark & Light Mode):** Antarmuka responsif dengan palet *Cighra Apta Nirbhaya*, tipografi taktis, dan transisi mulus untuk kebutuhan Command Center.

---

## 🛠️ Teknologi & Stack

Aplikasi ini dibangun menggunakan arsitektur modern:

- **Backend:** [Laravel 11](https://laravel.com/) (PHP >= 8.2)
- **Frontend:** [React 18](https://reactjs.org/) dengan [TypeScript](https://www.typescriptlang.org/)
- **Routing & Full-Stack Bridge:** [Inertia.js](https://inertiajs.com/)
- **Styling & Design System:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Pemetaan (GIS):** Leaflet, React-Leaflet, Leaflet-GeoSearch (OpenStreetMap Tiles - Bebas API Key)
- **Hak Akses & Otorisasi:** [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission)
- **Database:** MySQL / MariaDB

---

## ⚙️ Panduan Instalasi (Development Lokal)

Ikuti langkah-langkah berikut untuk menjalankan SISFO DART di lingkungan lokal Anda:

### Prasyarat
- PHP >= 8.2 (ekstensi: pdo_mysql, mbstring, curl, gd, zip)
- Composer >= 2.x
- Node.js >= 18.x & npm
- MySQL / MariaDB

### Langkah Instalasi

1. **Clone Repository & Masuk ke Direktori**
   ```bash
   git clone <url-repository-anda> helpdesk-dart
   cd helpdesk-dart
   ```

2. **Install Dependensi Backend & Frontend**
   ```bash
   composer install
   npm install
   ```

3. **Konfigurasi Environment**
   Salin `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Sesuaikan konfigurasi database Anda di file `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=helpdesk_dart
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. **Generate Application Key & Storage Link**
   ```bash
   php artisan key:generate
   php artisan storage:link
   ```

5. **Migrasi Database & Data Awal**
   ```bash
   php artisan migrate --seed
   ```

6. **Jalankan Aplikasi**
   Buka 2 terminal secara bersamaan:

   *Terminal 1 (Backend - Laravel):*
   ```bash
   php artisan serve
   ```

   *Terminal 2 (Frontend - Vite):*
   ```bash
   npm run dev
   ```

7. **Akses Aplikasi**
   Buka browser dan akses: `http://localhost:8000`

---

## 🌐 Panduan Deployment ke Production (cPanel / Hosting)

1. **Build Asset Frontend:**
   Di komputer lokal, jalankan build produksi:
   ```bash
   npm run build
   ```
   Upload folder `public/build/` ke folder `public/build/` pada cPanel Anda.

2. **Konfigurasi `.env` Production:**
   Pastikan konfigurasi di cPanel menggunakan:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://domain-anda.mil.id
   ```

3. **Migrasi Database di Production:**
   Import file migrasi/skema database ke database cPanel melalui **phpMyAdmin**.

---

## 📋 Import Akun Operator Seluruh KODAM (cPanel / phpMyAdmin)

Untuk mengaktifkan akun operator KODAM di seluruh Indonesia tanpa menggunakan terminal:

Tersedia file template SQL siap import langsung di menu **phpMyAdmin**:

1. **[import_akun_kodam.sql](file:///d:/PROJECT/helpdesk-dart/database/import_akun_kodam.sql)** (15 KODAM Utama/Klasik)
   - Meliputi Kodam I/BB, II/SWJ, III/SLW, IV/DIP, V/BRW, VI/MLW, IX/UDY, XII/TPR, XIII/MDK, XIV/HSN, XVI/PTM, XVII/CEN, XVIII/KSR, Kodam Jaya, dan Kodam Iskandar Muda.
   - Menggunakan nomor urut NRP/NIP standar 10 digit (`2601000001` - `2601000015`).
   - Role langsung diset ke **Pelapor**.

2. **[import_12_kodam_baru.sql](file:///d:/PROJECT/helpdesk-dart/database/import_12_kodam_baru.sql)** (12 KODAM Pemekaran Baru - Total 27 KODAM)
   - Meliputi Kodam XIX/TT, XXII/TB, XXIII/PL, XXIV/BC, XXV/SMRS, XXVI/MTR, XXVII/SSB, XXVIII/MKR, XXIX/MBR, XXX/RNB, Papua Barat Daya, dan Papua Selatan.
   - Melanjutkan nomor NRP/NIP urut (`2601000016` - `2601000027`).
   - Menyertakan titik koordinat geografis markas wilayah dan flag `is_verified = 1` agar langsung aktif di peta dan menu Satuan.

**Cara Eksekusi:**
- Buka **cPanel** ➡️ **phpMyAdmin** ➡️ Pilih nama database Anda.
- Buka tab **Import** ➡️ Pilih file SQL yang diinginkan ➡️ Klik **Kirim / Go**.

---

## 🛡️ Struktur Peran Pengguna (Role)

| Role | Tanggung Jawab & Wewenang |
|---|---|
| **Admin** | Akses menyeluruh sistem: manajemen pengguna, persetujuan mutasi, manajemen satuan, dan kontrol penuh tiket laporan. |
| **Supervisor** | Monitoring eksekutif: rekapitulasi data, inspeksi inventaris unit, dan membaca laporan di command center. |
| **Staf** | Verifikasi tiket masuk, penugasan teknisi (*Ticket Manager*), manajemen unit inventaris, dan pencetakan rekapitulasi. |
| **Teknisi** | Menerima penugasan perbaikan, memperbarui progres pengerjaan harian, input data pergantian spare part, dan menyelesaikan tiket. |
| **Pelapor (KODAM / Satuan)** | Mengajukan laporan kerusakan unit DART, melampirkan foto/dokumen bukti, dan memantau progres perbaikan unit satuannya. |

---

## 🤝 Lisensi & Hak Cipta

&copy; SISFO DART (Dynamic Autonomous Retaliatory Target) COMMAND CENTER.  
Dikelola oleh **BENGPUS PUSKOMLEKAD**. Sistem ini bersifat terbatas dan dirancang khusus untuk kepentingan kedinasan militer.
