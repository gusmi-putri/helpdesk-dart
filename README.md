<p align="center">
  <img src="public/icons.svg" width="100" alt="SISFO DART Logo" style="filter: drop-shadow(0 0 10px rgba(170,59,255,0.5));">
</p>

# SISFO DART Command Center
> **Dynamic Autonomous Retaliatory Target (DART) - BENGPUS PUSKOMLEKAD**

SISFO DART (Sistem Informasi DART) adalah aplikasi Helpdesk Terpadu dan Command Center yang dirancang khusus untuk mengelola, melacak, dan merespons laporan kerusakan unit serta dukungan perbaikan. Dibangun dengan fokus pada kecepatan respons, transparansi alur kerja, dan keamanan data tingkat tinggi.

---

## 🌟 Fitur Utama

- **Role-Based Access Control (RBAC):** Sistem otorisasi ketat dengan 4 tingkat pengguna (Admin, Staf, Teknisi, Pelapor).
- **Manajemen Tiket Responsif:** Pelaporan kendala terstruktur dengan opsi dukungan perbaikan (Swadaya & Non-Swadaya).
- **Delegasi Tugas (Tasking):** Staf/Admin dapat menugaskan tiket laporan langsung ke Teknisi yang kompeten.
- **Real-Time Updates:** Dukungan WebSocket (Laravel Reverb) untuk pembaruan status laporan secara instan.
- **Laporan & Rekapitulasi Otomatis:** Pembuatan dokumen (PDF) untuk serah terima perbaikan dan rekap bulanan operasional.
- **Log Keamanan (Audit Trail):** Pencatatan setiap aktivitas user ke dalam riwayat sistem untuk keamanan operasional (Operational Security).
- **Desain Modern & Gelap (Dark Mode):** Antarmuka pengguna (UI) yang garang dan futuristik, dioptimalkan untuk lingkungan *Command Center*.

---

## 🛠️ Teknologi & Stack

Aplikasi ini menggunakan stack modern yang menjamin performa tinggi:

- **Backend:** [Laravel 11](https://laravel.com/) (PHP)
- **Frontend:** [React](https://reactjs.org/) dengan [TypeScript](https://www.typescriptlang.org/)
- **Routing & State:** [Inertia.js](https://inertiajs.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** MySQL / MariaDB
- **WebSockets:** Laravel Reverb (untuk fitur Real-time)

---

## ⚙️ Panduan Instalasi (Development)

Ikuti langkah-langkah berikut untuk menjalankan SISFO DART di lingkungan lokal Anda.

### Prasyarat
- PHP >= 8.2
- Composer
- Node.js & npm
- MySQL / MariaDB

### Langkah Instalasi

1. **Clone Repository (Jika belum)**
   ```bash
   git clone <url-repo-anda> helpdesk-dart
   cd helpdesk-dart
   ```

2. **Install Dependensi Backend (PHP)**
   ```bash
   composer install
   ```

3. **Install Dependensi Frontend (Node)**
   ```bash
   npm install
   ```

4. **Konfigurasi Environment**
   Salin file konfigurasi bawaan dan sesuaikan nilainya.
   ```bash
   cp .env.example .env
   ```
   **Penting!** Sesuaikan kredensial Database Anda di `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=helpdesk_dart
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Generate Application Key**
   ```bash
   php artisan key:generate
   ```

6. **Migrasi Database & Seeder**
   Jalankan migrasi untuk membangun struktur tabel beserta data bawaan (seperti akun default).
   ```bash
   php artisan migrate:fresh --seed
   ```

7. **Jalankan Aplikasi**
   Anda membutuhkan dua terminal yang berjalan bersamaan:
   
   *Terminal 1 (Backend - Laravel):*
   ```bash
   php artisan serve
   ```
   
   *Terminal 2 (Frontend - Vite):*
   ```bash
   npm run dev
   ```

   *Terminal 3 (Opsional - WebSockets Reverb):*
   ```bash
   php artisan reverb:start
   ```

8. **Akses Aplikasi**
   Buka browser Anda dan kunjungi: `http://localhost:8000`

---

## 🛡️ Hak Akses & Peran (Role)

Aplikasi ini menggunakan middleware khusus untuk memisahkan wewenang:
- **Admin:** Akses penuh ke seluruh sistem (mengelola *Users*, Unit, dan semua laporan).
- **Staf:** Membantu Admin dalam mendelegasikan tugas ke Teknisi dan mencetak rekap laporan.
- **Teknisi:** Menerima tugas (*assigned tasks*), memperbarui progres perbaikan (Persentase), dan menyelesaikan perbaikan.
- **Pelapor:** Mengajukan tiket kendala/kerusakan baru dan memantau status laporannya.

*(Silakan baca dokumen `ROLE_ACCESSIBILITY.md` untuk informasi routing dan middleware yang lebih detail)*.

---

## 🤝 Lisensi & Hak Cipta

&copy; SISFO DART (Dynamic Autonomous Retaliatory Target) COMMAND CENTER.
Sistem ini dirancang secara eksklusif. Distribusi kode sumber ke publik tanpa izin dilarang.
