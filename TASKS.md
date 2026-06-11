# Project Tasks & Roadmap

## Soon
- [ ] **Fitur Reset Password Manual oleh Admin**
    - **Deskripsi:** Memungkinkan admin untuk mereset password personel melalui Modal Edit.
    - **Langkah Kerja:**
        - Tambahkan kolom `password` (opsional) di `UserEditModal.tsx`.
        - Update logic `update` di `UserController.php` untuk memproses password baru jika diisi.
        - Catat aktivitas reset password di `SystemLog`.

- [ ] **Fitur Bulk Import Data DART (Unit Inventaris)**
    - **Deskripsi:** Menambahkan kemampuan untuk mengunggah data unit secara massal menggunakan file Excel (.xlsx) atau CSV.
    - **Teknologi:** Laravel Excel (`maatwebsite/excel`).
    - **Langkah Kerja:**
        - Install `maatwebsite/excel`.
        - Buat `app/Imports/UnitsImport.php` dengan validasi `nomor_seri` unik dan tipe data valid.
        - Tambahkan endpoint POST `/units/import` di `UnitController`.
        - Buat komponen `ImportUnitsModal.tsx` di frontend.
        - Sediakan template CSV/Excel untuk diunduh pengguna.
        - Catat aktivitas impor di `SystemLog`.

## Done
- [x] Sinkronisasi repository dari branch `main`.
- [x] Menjalankan server development (Laravel & Vite).
