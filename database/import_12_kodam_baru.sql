-- ==============================================================================
-- TEMPLATE IMPORT 12 KODAM BARU (PENGEMBANGAN GELAR KEKUATAN TNI AD - TOTAL 27 KODAM)
-- Database Target   : helpdesk-dart (cPanel phpMyAdmin)
-- Role Akun        : Pelapor
-- Aturan NRP/NIP   : 10 Digit numerik berurutan (2601000016 - 2601000027)
-- Status Akun      : Aktif (is_approved = 1, is_active = 1)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 0. PERBAIKAN (jalankan ini SAJA jika script ini SUDAH PERNAH dijalankan
--    sebelumnya di server dan 12 Kodam baru tidak muncul di submenu Satuan,
--    padahal sudah muncul di dropdown form tambah Personel). Aman dijalankan
--    berkali-kali.
-- ------------------------------------------------------------------------------
UPDATE `satuans` SET `is_verified` = 1
WHERE `kode_satuan` IN (
    'KODAM-19','KODAM-22','KODAM-23','KODAM-24','KODAM-25','KODAM-26',
    'KODAM-27','KODAM-28','KODAM-29','KODAM-30','KODAM-31','KODAM-32'
);

-- ------------------------------------------------------------------------------
-- 1. TAMBAHKAN SATUAN KODAM BARU (Lengkap dengan Koordinat Markas Wilayah)
-- ------------------------------------------------------------------------------
-- Catatan: `is_verified` WAJIB diisi 1 di sini. Satuan yang dibuat lewat alur
-- normal aplikasi baru verified setelah di-approve Admin/Staf; karena insert ini
-- melewati alur tersebut, kalau is_verified tidak diisi maka default-nya 0 dan
-- satuan TIDAK akan muncul di submenu Satuan (hanya muncul di dropdown mentah
-- seperti form tambah Personel yang tidak menyaring status verifikasi).
INSERT INTO `satuans` (`nama_satuan`, `kode_satuan`, `latitude`, `longitude`, `is_verified`, `created_at`, `updated_at`)
VALUES
('KODAM XIX/TUANKU TAMBUSAI', 'KODAM-19', 0.507100, 101.447800, 1, NOW(), NOW()),       -- Pekanbaru, Riau
('KODAM XXII/TAMBUN BUNGAI', 'KODAM-22', -2.216100, 113.913900, 1, NOW(), NOW()),      -- Palangka Raya, Kalteng
('KODAM XXIII/PALAKA', 'KODAM-23', -3.998500, 122.512600, 1, NOW(), NOW()),            -- Kendari, Sultra
('KODAM XXIV/BULUNGAN CAKTI', 'KODAM-24', 2.837500, 117.365300, 1, NOW(), NOW()),       -- Tanjung Selor, Kaltara
('KODAM XXV/SULTAN MAHMUD RIAYAT SYAH', 'KODAM-25', 0.916700, 104.466700, 1, NOW(), NOW()), -- Tanjungpinang, Kepri
('KODAM XXVI/MATARAM', 'KODAM-26', -7.795600, 110.369500, 1, NOW(), NOW()),            -- Yogyakarta, D.I. Yogyakarta
('KODAM XXVII/SOBE SONBAI', 'KODAM-27', -10.177200, 123.607000, 1, NOW(), NOW()),      -- Kupang, NTT
('KODAM XXVIII/MOLOKU KIE RAHA', 'KODAM-28', 0.790500, 127.383300, 1, NOW(), NOW()),    -- Ternate, Maluku Utara
('KODAM XXIX/MAMBRUK', 'KODAM-29', -3.364400, 135.497500, 1, NOW(), NOW()),            -- Nabire, Papua Tengah
('KODAM XXX/RINAMBORA', 'KODAM-30', -8.583300, 116.116700, 1, NOW(), NOW()),           -- Mataram, NTB
('KODAM PAPUA BARAT DAYA', 'KODAM-31', -0.876200, 131.255800, 1, NOW(), NOW()),        -- Sorong, Papua Barat Daya
('KODAM PAPUA SELATAN', 'KODAM-32', -8.499100, 140.401100, 1, NOW(), NOW())           -- Merauke, Papua Selatan
ON DUPLICATE KEY UPDATE
    `kode_satuan` = VALUES(`kode_satuan`),
    `latitude` = VALUES(`latitude`),
    `longitude` = VALUES(`longitude`),
    `is_verified` = 1,
    `updated_at` = NOW();

-- ------------------------------------------------------------------------------
-- 2. INSERT 12 AKUN OPERATOR KODAM BARU KE TABEL `users`
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
-- 16. Kodam XIX/Tuanku Tambusai (Password: Sisfodart19TT)
(
    'op_kodam19tt',
    'operator.kodam19@dart.bengpuskomlek.id',
    '$2y$10$1n4tEgtctYa5EatsMxxbQusvXURB/LnigJ9Gch040s9840EvgWuMu',
    'Operator Kodam XIX/TT',
    '2601000016',
    'KODAM XIX/TUANKU TAMBUSAI',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%TUANKU TAMBUSAI%' LIMIT 1),
    '6280000000016',
    1,
    1,
    NOW(),
    NOW()
),

-- 17. Kodam XXII/Tambun Bungai (Password: Sisfodart22TB)
(
    'op_kodam22tb',
    'operator.kodam22@dart.bengpuskomlek.id',
    '$2y$10$d/6tuP3wW9TAa3nFzPQKZeccmhSC7TyzEQeWPBGlWKMgJw8wOwHii',
    'Operator Kodam XXII/TB',
    '2601000017',
    'KODAM XXII/TAMBUN BUNGAI',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%TAMBUN BUNGAI%' LIMIT 1),
    '6280000000017',
    1,
    1,
    NOW(),
    NOW()
),

-- 18. Kodam XXIII/Palaka (Password: Sisfodart23PL)
(
    'op_kodam23pl',
    'operator.kodam23@dart.bengpuskomlek.id',
    '$2y$10$EWXzlEH6wUCGcZz2MWi04egb/AxQXXDxQvh0U1eqfwpppZgF45TUy',
    'Operator Kodam XXIII/PL',
    '2601000018',
    'KODAM XXIII/PALAKA',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%PALAKA%' LIMIT 1),
    '6280000000018',
    1,
    1,
    NOW(),
    NOW()
),

-- 19. Kodam XXIV/Bulungan Cakti (Password: Sisfodart24BC)
(
    'op_kodam24bc',
    'operator.kodam24@dart.bengpuskomlek.id',
    '$2y$10$1fjkdEIWnq/mNC1Y8TsK1eRY29CA7mB4R37EgKwZ4E6bT4dAGJUnK',
    'Operator Kodam XXIV/BC',
    '2601000019',
    'KODAM XXIV/BULUNGAN CAKTI',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%BULUNGAN CAKTI%' LIMIT 1),
    '6280000000019',
    1,
    1,
    NOW(),
    NOW()
),

-- 20. Kodam XXV/Sultan Mahmud Riayat Syah (Password: Sisfodart25SMRS)
(
    'op_kodam25smrs',
    'operator.kodam25@dart.bengpuskomlek.id',
    '$2y$10$pYSPdeEPRlP3jd8G7Ul2iuEUjEPoB.zKCdHTIRLqIDnJRX4DbkYwm',
    'Operator Kodam XXV/SMRS',
    '2601000020',
    'KODAM XXV/SULTAN MAHMUD RIAYAT SYAH',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%MAHMUD RIAYAT%' LIMIT 1),
    '6280000000020',
    1,
    1,
    NOW(),
    NOW()
),

-- 21. Kodam XXVI/Mataram (Password: Sisfodart26MTR)
(
    'op_kodam26mtr',
    'operator.kodam26@dart.bengpuskomlek.id',
    '$2y$10$dipaLya9MeON706eIFCXy.5C/S00t.AyX5h7q9fdhNbP9XKEoBdCO',
    'Operator Kodam XXVI/MTR',
    '2601000021',
    'KODAM XXVI/MATARAM',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%MATARAM%' LIMIT 1),
    '6280000000021',
    1,
    1,
    NOW(),
    NOW()
),

-- 22. Kodam XXVII/Sobe Sonbai (Password: Sisfodart27SSB)
(
    'op_kodam27ssb',
    'operator.kodam27@dart.bengpuskomlek.id',
    '$2y$10$OmuW6fyHp75OAMD7PvFPHOjYpwwx5tev4zNUEkdGBBEmM67QuXP82',
    'Operator Kodam XXVII/SSB',
    '2601000022',
    'KODAM XXVII/SOBE SONBAI',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%SOBE SONBAI%' LIMIT 1),
    '6280000000022',
    1,
    1,
    NOW(),
    NOW()
),

-- 23. Kodam XXVIII/Moloku Kie Raha (Password: Sisfodart28MKR)
(
    'op_kodam28mkr',
    'operator.kodam28@dart.bengpuskomlek.id',
    '$2y$10$PV.fiZ0djf8NEn/LU6t5QO6y0CTM47H.QdOAgHtMQKSc.E/O.AJPu',
    'Operator Kodam XXVIII/MKR',
    '2601000023',
    'KODAM XXVIII/MOLOKU KIE RAHA',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%MOLOKU KIE RAHA%' LIMIT 1),
    '6280000000023',
    1,
    1,
    NOW(),
    NOW()
),

-- 24. Kodam XXIX/Mambruk (Password: Sisfodart29MBR)
(
    'op_kodam29mbr',
    'operator.kodam29@dart.bengpuskomlek.id',
    '$2y$10$RxKzMYhKv8FrqVaydmlJaejkKhJ0ZylSuFU9q20vp96z674vsfAfC',
    'Operator Kodam XXIX/MBR',
    '2601000024',
    'KODAM XXIX/MAMBRUK',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%MAMBRUK%' LIMIT 1),
    '6280000000024',
    1,
    1,
    NOW(),
    NOW()
),

-- 25. Kodam XXX/Rinambora (Password: Sisfodart30RNB)
(
    'op_kodam30rnb',
    'operator.kodam30@dart.bengpuskomlek.id',
    '$2y$10$BnrcRnxfwxrhNOd/0xzksu1jnypzSGUSTiZNL12NBDxziTxi.aUgu',
    'Operator Kodam XXX/RNB',
    '2601000025',
    'KODAM XXX/RINAMBORA',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%RINAMBORA%' LIMIT 1),
    '6280000000025',
    1,
    1,
    NOW(),
    NOW()
),

-- 26. Kodam Papua Barat Daya (Password: Sisfodart31PBD)
(
    'op_kodam31pbd',
    'operator.kodam31@dart.bengpuskomlek.id',
    '$2y$10$t4cEWHBzt4wLoZiJa4xp4uCyHomYFB5is/6PkHECU5KjLhU43NmwC',
    'Operator Kodam PBD',
    '2601000026',
    'KODAM PAPUA BARAT DAYA',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%PAPUA BARAT DAYA%' LIMIT 1),
    '6280000000026',
    1,
    1,
    NOW(),
    NOW()
),

-- 27. Kodam Papua Selatan (Password: Sisfodart32PST)
(
    'op_kodam32pst',
    'operator.kodam32@dart.bengpuskomlek.id',
    '$2y$10$pLoVUL3AgTms2DSubU5k1OL1uAOLeeR268.uqChF72xi5zo5ZDYy.',
    'Operator Kodam PST',
    '2601000027',
    'KODAM PAPUA SELATAN',
    (SELECT id FROM satuans WHERE nama_satuan LIKE '%PAPUA SELATAN%' LIMIT 1),
    '6280000000027',
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
-- 3. TETAPKAN ROLE 'Pelapor' SECARA OTOMATIS (Spatie Permission)
-- ------------------------------------------------------------------------------
INSERT IGNORE INTO `model_has_roles` (`role_id`, `model_type`, `model_id`)
SELECT 
    (SELECT id FROM `roles` WHERE `name` = 'Pelapor' LIMIT 1) as role_id,
    'App\\Models\\User' as model_type,
    id as model_id
FROM `users`
WHERE username IN (
    'op_kodam19tt', 'op_kodam22tb', 'op_kodam23pl', 'op_kodam24bc',
    'op_kodam25smrs', 'op_kodam26mtr', 'op_kodam27ssb', 'op_kodam28mkr',
    'op_kodam29mbr', 'op_kodam30rnb', 'op_kodam31pbd', 'op_kodam32pst'
);
