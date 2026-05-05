<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            // ========== SEKTOR UTARA (10 unit) ==========
            ['nomor_seri' => 'DRT-001', 'nama_dart' => 'Kamera Thermal V3',        'jenis_dart' => 'DART STD',      'asal_satuan' => 'Sektor Utara',    'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-002', 'nama_dart' => 'Sensor Gerak Mk.II',       'jenis_dart' => 'DART STD',      'asal_satuan' => 'Sektor Utara',    'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-003', 'nama_dart' => 'Radar Mini Frekuensi X',   'jenis_dart' => 'DART STK',      'asal_satuan' => 'Sektor Utara',    'status_unit' => 'Rusak'],
            ['nomor_seri' => 'DRT-004', 'nama_dart' => 'Kamera Optik Jarak Jauh',  'jenis_dart' => 'DART STD',      'asal_satuan' => 'Sektor Utara',    'status_unit' => 'Perbaikan'],
            ['nomor_seri' => 'DRT-005', 'nama_dart' => 'Unit Pemantau Cuaca',      'jenis_dart' => 'SKE',           'asal_satuan' => 'Sektor Utara',    'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-006', 'nama_dart' => 'Target Simulator Alpha',   'jenis_dart' => 'MOVING TARGET', 'asal_satuan' => 'Sektor Utara',    'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-007', 'nama_dart' => 'Sensor Akustik Pasif',     'jenis_dart' => 'DART STK',      'asal_satuan' => 'Sektor Utara',    'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-008', 'nama_dart' => 'Kamera Thermal V4',        'jenis_dart' => 'DART STD',      'asal_satuan' => 'Sektor Utara',    'status_unit' => 'Nonaktif'],
            ['nomor_seri' => 'DRT-009', 'nama_dart' => 'Alat Pantau Bawah Air',    'jenis_dart' => 'SKE',           'asal_satuan' => 'Sektor Utara',    'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-010', 'nama_dart' => 'Target Bergerak Beta',     'jenis_dart' => 'MOVING TARGET', 'asal_satuan' => 'Sektor Utara',    'status_unit' => 'Siap Ops'],

            // ========== SEKTOR SELATAN (10 unit) ==========
            ['nomor_seri' => 'DRT-011', 'nama_dart' => 'Kamera Thermal V3',        'jenis_dart' => 'DART STD',      'asal_satuan' => 'Sektor Selatan',  'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-012', 'nama_dart' => 'Sensor Gerak Mk.III',      'jenis_dart' => 'DART STD',      'asal_satuan' => 'Sektor Selatan',  'status_unit' => 'Rusak'],
            ['nomor_seri' => 'DRT-013', 'nama_dart' => 'Unit Komunikasi VHF',      'jenis_dart' => 'SKE',           'asal_satuan' => 'Sektor Selatan',  'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-014', 'nama_dart' => 'Radar Pantai Mk.I',        'jenis_dart' => 'DART STK',      'asal_satuan' => 'Sektor Selatan',  'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-015', 'nama_dart' => 'Target Simulator Gamma',   'jenis_dart' => 'MOVING TARGET', 'asal_satuan' => 'Sektor Selatan',  'status_unit' => 'Perbaikan'],
            ['nomor_seri' => 'DRT-016', 'nama_dart' => 'Kamera Optik Resolusi HD', 'jenis_dart' => 'DART STD',      'asal_satuan' => 'Sektor Selatan',  'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-017', 'nama_dart' => 'Sensor Infrared Pasif',    'jenis_dart' => 'DART STK',      'asal_satuan' => 'Sektor Selatan',  'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-018', 'nama_dart' => 'Unit Pengindera Suhu',     'jenis_dart' => 'SKE',           'asal_satuan' => 'Sektor Selatan',  'status_unit' => 'Nonaktif'],
            ['nomor_seri' => 'DRT-019', 'nama_dart' => 'Kamera Malam V2',          'jenis_dart' => 'DART STD',      'asal_satuan' => 'Sektor Selatan',  'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-020', 'nama_dart' => 'Target Bergerak Delta',    'jenis_dart' => 'MOVING TARGET', 'asal_satuan' => 'Sektor Selatan',  'status_unit' => 'Siap Ops'],

            // ========== SEKTOR TIMUR (8 unit) ==========
            ['nomor_seri' => 'DRT-021', 'nama_dart' => 'Kamera Thermal V3',        'jenis_dart' => 'DART STD',      'asal_satuan' => 'Sektor Timur',    'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-022', 'nama_dart' => 'Radar Mini Frekuensi S',   'jenis_dart' => 'DART STK',      'asal_satuan' => 'Sektor Timur',    'status_unit' => 'Rusak'],
            ['nomor_seri' => 'DRT-023', 'nama_dart' => 'Sensor Gerak Aktif Mk.I',  'jenis_dart' => 'DART STD',      'asal_satuan' => 'Sektor Timur',    'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-024', 'nama_dart' => 'Unit Komunikasi UHF',      'jenis_dart' => 'SKE',           'asal_satuan' => 'Sektor Timur',    'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-025', 'nama_dart' => 'Target Simulator Epsilon',  'jenis_dart' => 'MOVING TARGET', 'asal_satuan' => 'Sektor Timur',    'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-026', 'nama_dart' => 'Kamera Optik Zoom X10',    'jenis_dart' => 'DART STD',      'asal_satuan' => 'Sektor Timur',    'status_unit' => 'Perbaikan'],
            ['nomor_seri' => 'DRT-027', 'nama_dart' => 'Sensor Tekanan Udara',     'jenis_dart' => 'SKE',           'asal_satuan' => 'Sektor Timur',    'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-028', 'nama_dart' => 'Target Bergerak Zeta',     'jenis_dart' => 'MOVING TARGET', 'asal_satuan' => 'Sektor Timur',    'status_unit' => 'Siap Ops'],

            // ========== SEKTOR BARAT (8 unit) ==========
            ['nomor_seri' => 'DRT-029', 'nama_dart' => 'Kamera Thermal V2',        'jenis_dart' => 'DART STD',      'asal_satuan' => 'Sektor Barat',    'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-030', 'nama_dart' => 'Sensor Gerak Mk.IV',       'jenis_dart' => 'DART STK',      'asal_satuan' => 'Sektor Barat',    'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-031', 'nama_dart' => 'Unit Pemantau Laut',       'jenis_dart' => 'SKE',           'asal_satuan' => 'Sektor Barat',    'status_unit' => 'Rusak'],
            ['nomor_seri' => 'DRT-032', 'nama_dart' => 'Radar Penjaga Pantai',     'jenis_dart' => 'DART STK',      'asal_satuan' => 'Sektor Barat',    'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-033', 'nama_dart' => 'Target Simulator Eta',     'jenis_dart' => 'MOVING TARGET', 'asal_satuan' => 'Sektor Barat',    'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-034', 'nama_dart' => 'Kamera Malam V3',          'jenis_dart' => 'DART STD',      'asal_satuan' => 'Sektor Barat',    'status_unit' => 'Nonaktif'],
            ['nomor_seri' => 'DRT-035', 'nama_dart' => 'Sensor Ultrasonik Mk.I',   'jenis_dart' => 'DART STK',      'asal_satuan' => 'Sektor Barat',    'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-036', 'nama_dart' => 'Target Bergerak Theta',    'jenis_dart' => 'MOVING TARGET', 'asal_satuan' => 'Sektor Barat',    'status_unit' => 'Perbaikan'],

            // ========== POS KOMANDO PUSAT (6 unit) ==========
            ['nomor_seri' => 'DRT-037', 'nama_dart' => 'Kamera Thermal V5 (MIL)',  'jenis_dart' => 'DART STD',      'asal_satuan' => 'Pos Komando Pusat', 'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-038', 'nama_dart' => 'Radar Komando Utama',      'jenis_dart' => 'DART STK',      'asal_satuan' => 'Pos Komando Pusat', 'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-039', 'nama_dart' => 'Unit Enkripsi Sinyal',     'jenis_dart' => 'SKE',           'asal_satuan' => 'Pos Komando Pusat', 'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-040', 'nama_dart' => 'Kamera Optik 360 Derajat', 'jenis_dart' => 'DART STD',     'asal_satuan' => 'Pos Komando Pusat', 'status_unit' => 'Rusak'],
            ['nomor_seri' => 'DRT-041', 'nama_dart' => 'Sensor Pengacak Frekuensi','jenis_dart' => 'SKE',           'asal_satuan' => 'Pos Komando Pusat', 'status_unit' => 'Siap Ops'],
            ['nomor_seri' => 'DRT-042', 'nama_dart' => 'Target Latih Pusat Iota',  'jenis_dart' => 'MOVING TARGET', 'asal_satuan' => 'Pos Komando Pusat', 'status_unit' => 'Siap Ops'],
        ];

        foreach ($units as $unit) {
            Unit::firstOrCreate(['nomor_seri' => $unit['nomor_seri']], $unit);
        }

        $this->command->info('✅ UnitSeeder: ' . count($units) . ' unit DART berhasil ditambahkan.');
    }
}
