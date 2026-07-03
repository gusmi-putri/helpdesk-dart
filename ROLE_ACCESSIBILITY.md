# Panduan Aksesibilitas & Manajemen Role (SISFO DART)

Dokumen ini merinci pembagian hak akses (Authorization) berdasarkan Middleware dan Controller yang diimplementasikan pada backend aplikasi SISFO DART. Sistem ini memiliki 4 peran (role) pengguna utama: **Admin**, **Staf**, **Teknisi**, dan **Pelapor**.

---

## 1. Admin (Administrator Pusat)
Admin memiliki hak akses tertinggi (`role:Admin`) dan berfungsi sebagai pengontrol seluruh otorisasi dan persetujuan data final.

### Kapabilitas Berdasarkan Sistem (Routes & Middleware):
*   **Akses Dashboard Utama (`/admin`):** Memiliki antarmuka analitik terlengkap, Peta Monitoring Operasional, dan log aktivitas sistem.
*   **Manajemen Akun Personel (`UserController`):**
    *   Melihat daftar seluruh pengguna.
    *   **Persetujuan Registrasi:** Mengakses *endpoint* `/users/{id}/approve` secara eksklusif untuk menyetujui akun baru yang mendaftar.
    *   Mengaktifkan/menonaktifkan status akun pengguna.
*   **Manajemen Inventaris & Mutasi (`UnitController`):**
    *   **Impor Data:** Hanya Admin yang memiliki akses *endpoint* `/units/import` (mengunggah CSV/Excel data unit masal).
    *   **Persetujuan Mutasi:** Secara eksklusif dapat menyetujui (`/mutations/{mutation}/approve`) atau menolak (`/mutations/{mutation}/reject`) pengajuan mutasi/penghapusan unit dari Staf.
    *   **Pemulihan Unit:** Mengakses *endpoint* `/units/{unit}/restore` untuk memulihkan aset yang telah dihapus secara sistem.
*   **Manajemen Kasus/Laporan:**
    *   Memverifikasi laporan baru dari pelapor (`reports.verify`).
    *   Mengekspor data operasional dan rekapitulasi ke dalam PDF/Excel (`admin.recap.export`).
*   **Manajemen Satuan Kerja (Lokasi):**
    *   Melihat, menambah, dan memperbarui data Satuan (termasuk koordinat Peta Monitoring) secara instan.
    *   **Persetujuan Satuan:** Memvalidasi dan menyetujui (`approve`) pengajuan penambahan atau perubahan data Satuan dari form registrasi atau pengajuan Staf.

---

## 2. Staf (Pengelola Data Inventaris)
Staf (`role:Staf`) berfokus pada manajemen data aset harian, namun tindakan yang bersifat destruktif atau mutasi masal membutuhkan persetujuan Admin.

### Kapabilitas Berdasarkan Sistem (Routes & Middleware):
*   **Akses Dashboard Staf (`/staf`):** Mengakses dashboard manajemen inventaris dan pelacakan riwayat perangkat.
*   **Manajemen Inventaris Terbatas:**
    *   Bisa mengakses *resource routes* untuk menambah dan memperbarui data unit.
    *   **Sistem Pengajuan Mutasi:** Berbeda dengan Admin, staf **tidak dapat langsung menghapus unit**. Staf harus mengakses *endpoint* pengajuan seperti `/units/{unit}/request-delete`, `/units/request-delete-batch`, dan `/units/request-add-batch`. Pengajuan ini masuk ke sistem *Approval* Admin.
*   **Distribusi Laporan (Helpdesk):**
    *   Staf bertugas mendistribusikan laporan yang masuk kepada Teknisi yang tersedia melalui *endpoint* `/reports/{id}/handle`.
*   **Manajemen Akun Terbatas:**
    *   Bisa melihat daftar pengguna dan melakukan *toggle status* (`users.toggle-status`), namun **tidak memiliki akses** untuk menyetujui pengguna baru (`users.approve` dibatasi hanya untuk Admin).
*   **Manajemen Satuan Terbatas:**
    *   Dapat mengedit data Satuan Kerja, namun modifikasi ini berstatus **Pengajuan** (`pending_action: edit`) dan tidak langsung terubah di sistem. Perubahan ini membutuhkan persetujuan Admin melalui *Approval Center*.
*   **Ekspor Data:** Dapat mengekspor rekapitulasi data inventaris (`staf.recap.export`).

---

## 3. Teknisi (Tim Eksekusi Perbaikan)
Teknisi (`role:Teknisi`) memiliki hak akses yang sangat spesifik dan difokuskan pada penyelesaian masalah perangkat keras. Tidak memiliki akses ke manajemen pengguna atau inventaris master.

### Kapabilitas Berdasarkan Sistem (Routes & Middleware):
*   **Akses Dashboard Teknisi (`/teknisi`):** Antarmuka yang didedikasikan untuk Task Management (Manajemen Tugas).
*   **Siklus Penanganan Kasus (`ReportController`):**
    1.  **Penerimaan Tugas:** Menerima kasus yang ditugaskan oleh Staf/Admin (`reports.accept-task`).
    2.  **Proses Perbaikan:** Memperbarui status bahwa perbaikan sedang dikerjakan (`reports.start-progress`).
    3.  **Penyelesaian:** Menandai laporan telah ditangani dan memberikan rincian tindakan perbaikan melalui *endpoint* penyelesaian akhir (`reports.complete`).

---

## 4. Pelapor (Satuan Pengguna)
Pelapor (`role:Pelapor`) adalah representasi satuan operasional di lapangan yang menggunakan aset DART. Hak aksesnya dibatasi secara ketat (Least Privilege).

### Kapabilitas Berdasarkan Sistem (Routes & Middleware):
*   **Akses Dashboard Pelapor (`/pelapor`):** Menampilkan daftar unit yang dimiliki oleh satuan tersebut, serta riwayat laporan yang mereka ajukan.
*   **Pengajuan Kasus (`ReportController`):**
    *   Mengakses *endpoint* `/reports` untuk melakukan `store` (pembuatan tiket baru).
    *   Berhak menggunakan integrasi fitur *AI Diagnostic* (`/api/diagnose`) untuk mendeteksi kendala secara sistem cerdas sebelum laporan final diajukan.
*   **Isolasi Data:** Pelapor tidak dapat memodifikasi unit, tidak dapat melihat unit milik satuan lain, dan tidak dapat mengubah status dari tiket yang telah mereka ajukan (status dikontrol oleh Staf dan Teknisi).
