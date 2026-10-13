-- ==============================================================================
-- TEMPLATE IMPORT AKUN OPERATOR KODAM SELURUH INDONESIA
-- Sesuai format file: template data akun operator kodam itu buat nrpnya....ods
-- Database Target   : helpdesk-dart (cPanel phpMyAdmin)
-- Role Akun        : Pelapor
-- Aturan NRP/NIP   : Hanya angka, minimal 8 digit, unik (Format standar: 10 digit 2601000001 - 2601000015)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- INSERT / UPDATE AKUN OPERATOR KODAM KE TABEL `users`
-- Catatan Satuan: Mengambil ID dari satuan yang sudah ada di database Anda
-- ------------------------------------------------------------------------------
INSERT INTO `users` (
    `username`, 
    `email`, 
    `password`, 
    `nama_lengkap`, 
    `nrp_nip`, 
    `asal_satuan`, 
    `satuan_id`, 
    `no_wa`, 
    `is_approved`, 
    `is_active`, 
    `created_at`, 
    `updated_at`
)
VALUES
-- 1. Kodam I/Bukit Barisan (Password: Sisfodart01BB)
(
    'op_kodam1bb',
    'operator.kodam1@dart.bengpuskomlek.id',
    '$2y$10$AQdbhSPuHMynkdrzCG4ETOhtQH5mHDn25HGBWrTp8zqY1C1V/fb2q',
    'Operator Kodam I/BB',
    '2601000001',
    'KODAM I/BUKIT BARISAN',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%KODAM I/%' OR nama_satuan LIKE '%BUKIT BARISAN%' LIMIT 1),
    '6280000000001',
    1,
    1,
    NOW(),
    NOW()
),

-- 2. Kodam II/Sriwijaya (Password: Sisfodart02SWJ)
(
    'op_kodam2swj',
    'operator.kodam2@dart.bengpuskomlek.id',
    '$2y$10$KnecMFeTRIOyyE9vzacecuX/YcjUxE9MGiRb0c6S1fWTkrCwCR0Rm',
    'Operator Kodam II/SWJ',
    '2601000002',
    'KODAM II/SRIWIJAYA',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%KODAM II/%' OR nama_satuan LIKE '%SRIWIJAYA%' LIMIT 1),
    '6280000000002',
    1,
    1,
    NOW(),
    NOW()
),

-- 3. Kodam III/Siliwangi (Password: Sisfodart03SLW)
(
    'op_kodam3slw',
    'operator.kodam3@dart.bengpuskomlek.id',
    '$2y$10$HfF1oAyuTAINxqeklV9ENejqoZvmhbRzKa2WW4FsKzJi7Re6RhkOe',
    'Operator Kodam III/SLW',
    '2601000003',
    'KODAM III/SILIWANGI',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%KODAM III/%' OR nama_satuan LIKE '%SILIWANGI%' LIMIT 1),
    '6280000000003',
    1,
    1,
    NOW(),
    NOW()
),

-- 4. Kodam IV/Diponegoro (Password: Sisfodart04DIP)
(
    'op_kodam4dip',
    'operator.kodam4@dart.bengpuskomlek.id',
    '$2y$10$MicuSQKIwa3oY3GkSlMr.ethnzGA2DZpybTj.plE8YfErJchXeW5W',
    'Operator Kodam IV/DIP',
    '2601000004',
    'KODAM IV/DIPONEGORO',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%KODAM IV/%' OR nama_satuan LIKE '%DIPONEGORO%' LIMIT 1),
    '6280000000004',
    1,
    1,
    NOW(),
    NOW()
),

-- 5. Kodam V/Brawijaya (Password: Sisfodart05BRW)
(
    'op_kodam5brw',
    'operator.kodam5@dart.bengpuskomlek.id',
    '$2y$10$SV9ax9CjqwBI9b.PVbPeEux6vonYfj7X8UCh1pjR2mXOgBCI5SD1i',
    'Operator Kodam V/BRW',
    '2601000005',
    'KODAM V/BRAWIJAYA',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%KODAM V/%' OR nama_satuan LIKE '%BRAWIJAYA%' LIMIT 1),
    '6280000000005',
    1,
    1,
    NOW(),
    NOW()
),

-- 6. Kodam VI/Mulawarman (Password: Sisfodart06MLW)
(
    'op_kodam6mlw',
    'operator.kodam6@dart.bengpuskomlek.id',
    '$2y$10$EPQQKCBRrtZ0F3WRSqCXv.YaPYWgvCj.MYHavqKGlVXhSMuWlBExS',
    'Operator Kodam VI/MLW',
    '2601000006',
    'KODAM VI/MULAWARMAN',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%KODAM VI/%' OR nama_satuan LIKE '%MULAWARMAN%' LIMIT 1),
    '6280000000006',
    1,
    1,
    NOW(),
    NOW()
),

-- 7. Kodam IX/Udayana (Password: Sisfodart09UDY)
(
    'op_kodam9udy',
    'operator.kodam9@dart.bengpuskomlek.id',
    '$2y$10$8ZmDhW61Msg/8IDQKkHksuzKuSFzI6Cb/6zjwJ4TGZXX7NN8h.dq2',
    'Operator Kodam IX/UDY',
    '2601000007',
    'KODAM IX/UDAYANA',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%KODAM IX/%' OR nama_satuan LIKE '%UDAYANA%' LIMIT 1),
    '6280000000007',
    1,
    1,
    NOW(),
    NOW()
),

-- 8. Kodam XII/Tanjungpura (Password: Sisfodart12TPR)
(
    'op_kodam12tpr',
    'operator.kodam12@dart.bengpuskomlek.id',
    '$2y$10$n2t5UnTwIlQahQknNmeHi.0kiD5jHAA1p9x3N1cqfhkLn.YHT1qCG',
    'Operator Kodam XII/TPR',
    '2601000008',
    'KODAM XII/TANJUNGPURA',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%KODAM XII/%' OR nama_satuan LIKE '%TANJUNGPURA%' LIMIT 1),
    '6280000000008',
    1,
    1,
    NOW(),
    NOW()
),

-- 9. Kodam XIII/Merdeka (Password: Sisfodart13MDK)
(
    'op_kodam13mdk',
    'operator.kodam13@dart.bengpuskomlek.id',
    '$2y$10$EgjBi665gUtmFWziD1uJ.upjVwUYJdKJOxJWUbVbzjJjs4mPQ0Lam',
    'Operator Kodam XIII/MDK',
    '2601000009',
    'KODAM XIII/MERDEKA',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%KODAM XIII/%' OR nama_satuan LIKE '%MERDEKA%' LIMIT 1),
    '6280000000009',
    1,
    1,
    NOW(),
    NOW()
),

-- 10. Kodam XIV/Hasanuddin (Password: Sisfodart14HSN)
(
    'op_kodam14hsn',
    'operator.kodam14@dart.bengpuskomlek.id',
    '$2y$10$5hBBdtf8ZsFsiBhsTtX29.LCZ1cPVBZsXNWu87.NwlIFJCMEPuKNq',
    'Operator Kodam XIV/HSN',
    '2601000010',
    'KODAM XIV/HASANUDDIN',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%KODAM XIV/%' OR nama_satuan LIKE '%HASANUDDIN%' LIMIT 1),
    '6280000000010',
    1,
    1,
    NOW(),
    NOW()
),

-- 11. Kodam XVI/Pattimura (Password: Sisfodart16PTM)
(
    'op_kodam16ptm',
    'operator.kodam16@dart.bengpuskomlek.id',
    '$2y$10$OLkJsR05hvl...s1h9WiRukFGviUWyA2rZQli6h85516p0fEHpdCm',
    'Operator Kodam XVI/PTM',
    '2601000011',
    'KODAM XVI/PATTIMURA',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%KODAM XVI/%' OR nama_satuan LIKE '%PATTIMURA%' LIMIT 1),
    '6280000000011',
    1,
    1,
    NOW(),
    NOW()
),

-- 12. Kodam XVII/Cenderawasih (Password: Sisfodart17CEN)
(
    'op_kodam17cen',
    'operator.kodam17@dart.bengpuskomlek.id',
    '$2y$10$QMASAZaovwh245rAWHR43OyDfyS7dJDWG62YEGYcUPlkF8pemHQNO',
    'Operator Kodam XVII/CEN',
    '2601000012',
    'KODAM XVII/CENDERAWASIH',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%KODAM XVII/%' OR nama_satuan LIKE '%CENDERAWASIH%' LIMIT 1),
    '6280000000012',
    1,
    1,
    NOW(),
    NOW()
),

-- 13. Kodam XVIII/Kasuari (Password: Sisfodart18KSR)
(
    'op_kodam18ksr',
    'operator.kodam18@dart.bengpuskomlek.id',
    '$2y$10$9P89EM0AfM22/Ku60BW90OBdLQb90tPx6ZOHIKvoWZMNgT.lqzRYq',
    'Operator Kodam XVIII/KSR',
    '2601000013',
    'KODAM XVIII/KASUARI',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%KODAM XVIII/%' OR nama_satuan LIKE '%KASUARI%' LIMIT 1),
    '6280000000013',
    1,
    1,
    NOW(),
    NOW()
),

-- 14. Kodam Jayakarta (Password: SisfodartJAYA)
(
    'op_kodamjaya',
    'operator.jaya@dart.bengpuskomlek.id',
    '$2y$10$1dBXEm7JbAYRPdSGj18Di.QKMIXyxv5AlgbgBc6h4TuGfyQ8q.3TC',
    'Operator Kodam Jaya',
    '2601000014',
    'KODAM JAYA',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%KODAM JAYA%' OR nama_satuan LIKE '%JAYAKARTA%' LIMIT 1),
    '6280000000014',
    1,
    1,
    NOW(),
    NOW()
),

-- 15. Kodam Iskandar Muda (Password: SisfodartIM26)
(
    'op_kodamim',
    'operator.im@dart.bengpuskomlek.id',
    '$2y$10$noKrDaSg9ESDzAkDs7hFNub9OITRXhV2lnh0/.X0ozzMV7aMob4Py',
    'Operator Kodam IM',
    '2601000015',
    'KODAM ISKANDAR MUDA',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%ISKANDAR MUDA%' LIMIT 1),
    '6280000000015',
    1,
    1,
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE 
    `email` = VALUES(`email`),
    `password` = VALUES(`password`),
    `nama_lengkap` = VALUES(`nama_lengkap`),
    `nrp_nip` = VALUES(`nrp_nip`),
    `asal_satuan` = VALUES(`asal_satuan`),
    `satuan_id` = VALUES(`satuan_id`),
    `no_wa` = VALUES(`no_wa`),
    `is_approved` = 1,
    `is_active` = 1,
    `updated_at` = NOW();

-- ------------------------------------------------------------------------------
-- TETAPKAN ROLE 'Pelapor' SECARA OTOMATIS (Spatie Permission)
-- ------------------------------------------------------------------------------
INSERT IGNORE INTO `model_has_roles` (`role_id`, `model_type`, `model_id`)
SELECT 
    (SELECT id FROM `roles` WHERE `name` = 'Pelapor' LIMIT 1) as role_id,
    'App\\Models\\User' as model_type,
    id as model_id
FROM `users`
WHERE username IN (
    'op_kodam1bb',
    'op_kodam2swj',
    'op_kodam3slw',
    'op_kodam4dip',
    'op_kodam5brw',
    'op_kodam6mlw',
    'op_kodam9udy',
    'op_kodam12tpr',
    'op_kodam13mdk',
    'op_kodam14hsn',
    'op_kodam16ptm',
    'op_kodam17cen',
    'op_kodam18ksr',
    'op_kodamjaya',
    'op_kodamim'
);
