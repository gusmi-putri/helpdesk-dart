<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            // AKMIL - Magelang
            ['nomor_seri' => 'DRT-001', 'jenis' => 'DART STD',      'asal_satuan' => 'AKMIL',                 'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'DRT-002', 'jenis' => 'DART STD',      'asal_satuan' => 'AKMIL',                 'status_unit' => 'Beroperasi'],

            // Yonif Raider 303/SSM - Garut
            ['nomor_seri' => 'DRT-003', 'jenis' => 'DART STK',      'asal_satuan' => 'YONIF RAIDER 303/SSM',  'status_unit' => 'Rusak'],
            ['nomor_seri' => 'DRT-004', 'jenis' => 'DART STD',      'asal_satuan' => 'YONIF RAIDER 303/SSM',  'status_unit' => 'Perbaikan'],

            // Yonif 315/Garuda - Bogor
            ['nomor_seri' => 'DRT-005', 'jenis' => 'DART Portabel - Swing',           'asal_satuan' => 'YONIF 315/GARUDA',      'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'DRT-006', 'jenis' => 'Moving Target', 'asal_satuan' => 'YONIF 315/GARUDA',      'status_unit' => 'Beroperasi'],

            // Pusdikif Pussenif - Cipatat
            ['nomor_seri' => 'DRT-007', 'jenis' => 'DART STK',      'asal_satuan' => 'PUSDIKIF PUSSENIF',     'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'DRT-008', 'jenis' => 'DART STD',      'asal_satuan' => 'PUSDIKIF PUSSENIF',     'status_unit' => 'Nonaktif'],

            // Bengpuskomlekad - Bandung
            ['nomor_seri' => 'DRT-009', 'jenis' => 'DART Portabel - Swing',           'asal_satuan' => 'BENGPUSKOMLEKAD',       'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'DRT-010', 'jenis' => 'Moving Target', 'asal_satuan' => 'BENGPUSKOMLEKAD',       'status_unit' => 'Beroperasi'],

            // Grup 1 Kopassus - Serang
            ['nomor_seri' => 'DRT-011', 'jenis' => 'DART STD',      'asal_satuan' => 'GRUP 1 KOPASSUS',       'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'DRT-012', 'jenis' => 'DART STD',      'asal_satuan' => 'GRUP 1 KOPASSUS',       'status_unit' => 'Rusak'],

            // Grup 2 Kopassus - Kartasura Solo
            ['nomor_seri' => 'DRT-013', 'jenis' => 'DART Portabel - Swing',           'asal_satuan' => 'GRUP 2 KOPASSUS',       'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'DRT-014', 'jenis' => 'DART STK',      'asal_satuan' => 'GRUP 2 KOPASSUS',       'status_unit' => 'Beroperasi'],

            // Yonif Para Raider 501/BY - Madiun
            ['nomor_seri' => 'DRT-015', 'jenis' => 'Moving Target', 'asal_satuan' => 'YONIF PARA RAIDER 501', 'status_unit' => 'Perbaikan'],
            ['nomor_seri' => 'DRT-016', 'jenis' => 'DART STD',      'asal_satuan' => 'YONIF PARA RAIDER 501', 'status_unit' => 'Beroperasi'],

            // Yonif Raider 509/BY - Jember
            ['nomor_seri' => 'DRT-017', 'jenis' => 'DART STK',      'asal_satuan' => 'YONIF RAIDER 509',      'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'DRT-018', 'jenis' => 'DART Portabel - Swing',           'asal_satuan' => 'YONIF RAIDER 509',      'status_unit' => 'Nonaktif'],

            // Yonif Raider 328/DGH - Cilodong Depok
            ['nomor_seri' => 'DRT-019', 'jenis' => 'DART STD',      'asal_satuan' => 'YONIF RAIDER 328',      'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'DRT-020', 'jenis' => 'Moving Target', 'asal_satuan' => 'YONIF RAIDER 328',      'status_unit' => 'Beroperasi'],

            // Yonif Raider 300/BJW - Cianjur
            ['nomor_seri' => 'DRT-021', 'jenis' => 'DART STD',      'asal_satuan' => 'YONIF RAIDER 300',      'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'DRT-022', 'jenis' => 'DART STK',      'asal_satuan' => 'YONIF RAIDER 300',      'status_unit' => 'Rusak'],

            // Yon Armed 9/Pasopati - Purwakarta
            ['nomor_seri' => 'DRT-023', 'jenis' => 'DART STD',      'asal_satuan' => 'YON ARMED 9',           'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'DRT-024', 'jenis' => 'DART Portabel - Swing',           'asal_satuan' => 'YON ARMED 9',           'status_unit' => 'Beroperasi'],

            // Yon Kav 4/KC - Bandung
            ['nomor_seri' => 'DRT-025', 'jenis' => 'Moving Target', 'asal_satuan' => 'YON KAV 4',             'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'DRT-026', 'jenis' => 'DART STD',      'asal_satuan' => 'YON KAV 4',             'status_unit' => 'Perbaikan'],

            // Yonif 310/KK - Sukabumi
            ['nomor_seri' => 'DRT-027', 'jenis' => 'DART Portabel - Swing',           'asal_satuan' => 'YONIF 310',             'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'DRT-028', 'jenis' => 'Moving Target', 'asal_satuan' => 'YONIF 310',             'status_unit' => 'Beroperasi'],

            // Yonif Raider 323/BP - Banjar
            ['nomor_seri' => 'DRT-029', 'jenis' => 'DART STD',      'asal_satuan' => 'YONIF RAIDER 323',      'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'DRT-030', 'jenis' => 'DART STK',      'asal_satuan' => 'YONIF RAIDER 323',      'status_unit' => 'Beroperasi'],

            // Yon Arhanud 3/YBY - Bandung
            ['nomor_seri' => 'DRT-031', 'jenis' => 'DART Portabel - Swing',           'asal_satuan' => 'YON ARHANUD 3',         'status_unit' => 'Rusak'],
            ['nomor_seri' => 'DRT-032', 'jenis' => 'DART STK',      'asal_satuan' => 'YON ARHANUD 3',         'status_unit' => 'Beroperasi'],

            // Satuan Radar 211 - Kab. Tangerang
            ['nomor_seri' => 'DRT-033', 'jenis' => 'Moving Target', 'asal_satuan' => 'SATUAN RADAR 211',      'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'DRT-034', 'jenis' => 'DART STD',      'asal_satuan' => 'SATUAN RADAR 211',      'status_unit' => 'Nonaktif'],

            // Yonif 320/BP - Pandeglang
            ['nomor_seri' => 'DRT-035', 'jenis' => 'DART STK',      'asal_satuan' => 'YONIF 320',             'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'DRT-036', 'jenis' => 'Moving Target', 'asal_satuan' => 'YONIF 320',             'status_unit' => 'Perbaikan'],

            // Yon Armed 4/PR - Cimahi
            ['nomor_seri' => 'DRT-037', 'jenis' => 'DART STD',      'asal_satuan' => 'YON ARMED 4',           'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'DRT-038', 'jenis' => 'DART STK',      'asal_satuan' => 'YON ARMED 4',           'status_unit' => 'Beroperasi'],

            // Yon Kav 9/SDK - Tangerang Selatan
            ['nomor_seri' => 'DRT-039', 'jenis' => 'DART Portabel - Swing',           'asal_satuan' => 'YON KAV 9',             'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'DRT-040', 'jenis' => 'DART STD',      'asal_satuan' => 'YON KAV 9',             'status_unit' => 'Rusak'],

            // Yon Arhanud 10/ABC - Jakarta Selatan
            ['nomor_seri' => 'DRT-041', 'jenis' => 'DART Portabel - Swing',           'asal_satuan' => 'YON ARHANUD 10',        'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'DRT-042', 'jenis' => 'Moving Target', 'asal_satuan' => 'YON ARHANUD 10',        'status_unit' => 'Beroperasi'],
        ];

        foreach ($units as $unit) {
            Unit::updateOrCreate(
                ['nomor_seri' => $unit['nomor_seri']],
                $unit
            );
        }

        $this->command->info('UnitSeeder: ' . count($units) . ' unit DART berhasil disinkronkan.');
    }
}
