# Panduan Aksesibilitas & Manajemen Role (SISFO DART)

Dokumen ini merinci pembagian hak akses (Authorization) berdasarkan Middleware dan Controller yang diimplementasikan pada backend aplikasi SISFO DART. Sistem ini memiliki 4 peran (role) pengguna utama: **Admin**, **Staf**, **Teknisi**, dan **Pelapor**.

---

## 1. Admin (Administrator Pusat)
Admin memiliki hak akses tertinggi (`role:Admin`) dan berfungsi sebagai pengontrol seluruh otorisasi dan persetujuan data final.

### Kapabilitas Berdasarkan Sistem (Routes & Middleware):
*   **Akses Dashboard Utama (`/admin`):** Memiliki antarmuka analitik terlengkap, Peta Monitoring Operasional, dan log aktivitas sistem.
*   **Manajemen Akun Personel (`UserController`):**
    *   Melihat dan memodifikasi daftar seluruh pengguna.
    *   **Persetujuan Registrasi:** Mengakses *endpoint* `/users/{id}/approve-registration` dan `reject-registration` secara eksklusif.
    *   **Manajemen Status:** Mengakses *endpoint* `/users/{id}/toggle-status` untuk mengaktifkan/menonaktifkan akun.
*   **Manajemen Inventaris & Mutasi (`UnitController`):**
    *   **Impor & Ekspor Data:** Memiliki akses ke *endpoint* `/units/import` (bersama Staf).
    *   **Aksi Langsung:** Secara eksklusif dapat melakukan penghapusan data massal tanpa melalui persetujuan (`units.destroy-batch`).
    *   **Persetujuan Mutasi:** Secara eksklusif dapat menyetujui (`approve`) atau menolak (`reject`) pengajuan mutasi/penghapusan unit dari Staf.
    *   **Pemulihan Unit:** Mengakses *endpoint* `/units/{unit}/restore` untuk memulihkan aset yang telah dihapus secara sistem (Soft Delete).
*   **Manajemen Kasus/Laporan (`ReportController`):**
    *   Bisa membuat laporan baru (bersama Pelapor dan Staf).
    *   Memverifikasi atau menolak laporan yang telah dikerjakan oleh Teknisi (`reports.verify` dan `reports.reject`).
    *   Mengekspor data operasional dan rekapitulasi ke dalam PDF/Excel (`admin.recap.export`).
*   **Manajemen Satuan Kerja (Lokasi):**
    *   Melihat, menambah, dan memperbarui data Satuan (termasuk koordinat Peta Monitoring).
    *   **Persetujuan Satuan:** Memvalidasi dan menyetujui (`approve` / `reject`) pengajuan perubahan atau penambahan data Satuan.

---

## 2. Staf (Pengelola Data Inventaris)
Staf (`role:Staf`) berfokus pada manajemen data aset harian, namun tindakan yang bersifat destruktif (penghapusan) atau validasi akun membutuhkan persetujuan Admin.

### Kapabilitas Berdasarkan Sistem (Routes & Middleware):
*   **Akses Dashboard Staf (`/staf`):** Mengakses dashboard manajemen inventaris dan pelacakan riwayat perangkat.
*   **Manajemen Inventaris Terbatas:**
    *   Bisa mengakses *resource routes* untuk menambah dan memperbarui data unit secara satuan maupun melakukan Impor massal (`units/import`).
    *   **Sistem Pengajuan Mutasi:** Staf **tidak dapat langsung menghapus unit** secara permanen. Staf menggunakan *endpoint* pengajuan seperti `/units/{unit}/request-delete`, `/units/request-delete-batch`, dan `/units/request-add-batch`. Pengajuan ini diteruskan ke *Approval Center* Admin.
*   **Distribusi & Verifikasi Laporan (Helpdesk):**
    *   Membuat laporan baru (`reports.store`).
    *   Staf bertugas mendistribusikan laporan yang masuk kepada Teknisi melalui *endpoint* `/reports/{id}/handle`.
    *   Berhak memverifikasi laporan masuk (`Pending` ➔ `Diverifikasi` via `reports.verify`) atau menolak laporan yang masuk/aktif (`Ditolak` via `reports.reject`). *Catatan: Verifikasi bukan untuk hasil kerja Teknisi karena setelah Teknisi menyelesaikan laporan, status langsung otomatis menjadi Selesai.*
    *   Dapat mengunduh berkas BAP laporan (`reports.pdf`) langsung melalui tombol **CETAK PDF** di antarmuka detail laporan.
*   **Manajemen Akun Sangat Terbatas:**
    *   Bisa mengakses daftar pengguna (`users` resource view), namun **tidak memiliki akses** untuk menyetujui pengguna baru atau mengubah status aktif/nonaktif.
*   **Manajemen Satuan Terbatas:**
    *   Dapat mengedit data Satuan Kerja, namun modifikasi ini harus disetujui Admin.
*   **Ekspor Data:** Dapat mengekspor rekapitulasi data inventaris (`staf.recap.export`).

---

## 3. Teknisi (Tim Eksekusi Perbaikan)
Teknisi (`role:Teknisi`) memiliki hak akses yang sangat spesifik dan difokuskan pada penyelesaian masalah perangkat keras. Tidak memiliki akses ke manajemen pengguna atau inventaris master.

### Kapabilitas Berdasarkan Sistem (Routes & Middleware):
*   **Akses Dashboard Teknisi (`/teknisi`):** Antarmuka yang didedikasikan untuk Task Management (Manajemen Tugas).
*   **Siklus Penanganan Kasus (`ReportController`):**
    1.  **Penerimaan Tugas:** Menerima kasus yang ditugaskan oleh Staf/Admin (`reports.accept-task`).
    2.  **Proses Perbaikan:** Memperbarui status bahwa perbaikan sedang dikerjakan (`reports.start-progress`).
    3.  **Penyelesaian:** Menandai laporan telah ditangani dan memberikan rincian tindakan perbaikan (`reports.complete`).
*   **Akses Laporan:** Secara API/rute backend diizinkan mengunduh PDF BAP (`reports.pdf`) **khusus untuk laporan yang ditugaskan kepadanya**, namun saat ini **tidak disediakan tombol cetak di antarmuka (UI) dashboard Teknisi**.

---

## 4. Pelapor (Satuan Pengguna)
Pelapor (`role:Pelapor`) adalah representasi satuan operasional di lapangan yang menggunakan aset DART. Hak aksesnya dibatasi secara ketat (Least Privilege).

### Kapabilitas Berdasarkan Sistem (Routes & Middleware):
*   **Akses Dashboard Pelapor (`/pelapor`):** Menampilkan daftar unit yang dimiliki oleh satuan tersebut, serta riwayat laporan yang mereka ajukan.
*   **Pengajuan Kasus (`ReportController`):**
    *   Mengajukan pembuatan tiket/laporan kendala baru (`reports.store`).
    *   Berhak menggunakan integrasi fitur *AI Diagnostic* (`/api/diagnose`) untuk mendeteksi kendala secara sistem cerdas.
*   **Akses Laporan:** Secara API/rute backend diizinkan mengunduh PDF BAP (`reports.pdf`) **khusus untuk laporan miliknya sendiri**, namun saat ini **tidak disediakan tombol cetak di antarmuka (UI) dashboard Pelapor**.
*   **Isolasi Data:** Pelapor tidak dapat memodifikasi data unit secara langsung, tidak dapat melihat unit/laporan milik satuan lain, dan tidak dapat mengubah status dari tiket yang telah mereka ajukan (hanya Staf dan Teknisi).
