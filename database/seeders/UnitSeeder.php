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
            ['nomor_seri' => 'PU - 42 - 001 - 2025', 'jenis' => 'DART Pop Up',      'asal_satuan' => 'AKMIL',                 'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'PU - 42 - 002 - 2025', 'jenis' => 'DART Pop Up',      'asal_satuan' => 'AKMIL',                 'status_unit' => 'Beroperasi'],

            // Yonif Raider 303/SSM - Garut
            ['nomor_seri' => 'FL - 42 - 001 - 2025', 'jenis' => 'DART Flip',        'asal_satuan' => 'YONIF RAIDER 303/SSM',  'status_unit' => 'Rusak'],
            ['nomor_seri' => 'PU - 42 - 003 - 2025', 'jenis' => 'DART Pop Up',      'asal_satuan' => 'YONIF RAIDER 303/SSM',  'status_unit' => 'Perbaikan'],

            // Yonif 315/Garuda - Bogor
            ['nomor_seri' => 'SW - 42 - 001 - 2025', 'jenis' => 'DART Swing',       'asal_satuan' => 'YONIF 315/GARUDA',      'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'MV - 42 - 001 - 2025', 'jenis' => 'Moving Target',    'asal_satuan' => 'YONIF 315/GARUDA',      'status_unit' => 'Beroperasi'],

            // Pusdikif Pussenif - Cipatat
            ['nomor_seri' => 'FL - 42 - 002 - 2025', 'jenis' => 'DART Flip',        'asal_satuan' => 'PUSDIKIF PUSSENIF',     'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'PU - 42 - 004 - 2025', 'jenis' => 'DART Pop Up',      'asal_satuan' => 'PUSDIKIF PUSSENIF',     'status_unit' => 'Nonaktif'],

            // Bengpuskomlekad - Bandung
            ['nomor_seri' => 'SW - 42 - 002 - 2025', 'jenis' => 'DART Swing',       'asal_satuan' => 'BENGPUSKOMLEKAD',       'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'MV - 42 - 002 - 2025', 'jenis' => 'Moving Target',    'asal_satuan' => 'BENGPUSKOMLEKAD',       'status_unit' => 'Beroperasi'],

            // Grup 1 Kopassus - Serang
            ['nomor_seri' => 'PU - 42 - 005 - 2025', 'jenis' => 'DART Pop Up',      'asal_satuan' => 'GRUP 1 KOPASSUS',       'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'PU - 42 - 006 - 2025', 'jenis' => 'DART Pop Up',      'asal_satuan' => 'GRUP 1 KOPASSUS',       'status_unit' => 'Rusak'],

            // Grup 2 Kopassus - Kartasura Solo
            ['nomor_seri' => 'SW - 42 - 003 - 2025', 'jenis' => 'DART Swing',       'asal_satuan' => 'GRUP 2 KOPASSUS',       'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'FL - 42 - 003 - 2025', 'jenis' => 'DART Flip',        'asal_satuan' => 'GRUP 2 KOPASSUS',       'status_unit' => 'Beroperasi'],

            // Yonif Para Raider 501/BY - Madiun
            ['nomor_seri' => 'MV - 42 - 003 - 2025', 'jenis' => 'Moving Target',    'asal_satuan' => 'YONIF PARA RAIDER 501', 'status_unit' => 'Perbaikan'],
            ['nomor_seri' => 'PU - 42 - 007 - 2025', 'jenis' => 'DART Pop Up',      'asal_satuan' => 'YONIF PARA RAIDER 501', 'status_unit' => 'Beroperasi'],

            // Yonif Raider 509/BY - Jember
            ['nomor_seri' => 'FL - 42 - 004 - 2025', 'jenis' => 'DART Flip',        'asal_satuan' => 'YONIF RAIDER 509',      'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'SW - 42 - 004 - 2025', 'jenis' => 'DART Swing',       'asal_satuan' => 'YONIF RAIDER 509',      'status_unit' => 'Nonaktif'],

            // Yonif Raider 328/DGH - Cilodong Depok
            ['nomor_seri' => 'PU - 42 - 008 - 2025', 'jenis' => 'DART Pop Up',      'asal_satuan' => 'YONIF RAIDER 328',      'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'MV - 42 - 004 - 2025', 'jenis' => 'Moving Target',    'asal_satuan' => 'YONIF RAIDER 328',      'status_unit' => 'Beroperasi'],

            // Yonif Raider 300/BJW - Cianjur
            ['nomor_seri' => 'PU - 42 - 009 - 2025', 'jenis' => 'DART Pop Up',      'asal_satuan' => 'YONIF RAIDER 300',      'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'FL - 42 - 005 - 2025', 'jenis' => 'DART Flip',        'asal_satuan' => 'YONIF RAIDER 300',      'status_unit' => 'Rusak'],

            // Yon Armed 9/Pasopati - Purwakarta
            ['nomor_seri' => 'PU - 42 - 010 - 2025', 'jenis' => 'DART Pop Up',      'asal_satuan' => 'YON ARMED 9',           'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'SW - 42 - 005 - 2025', 'jenis' => 'DART Swing',       'asal_satuan' => 'YON ARMED 9',           'status_unit' => 'Beroperasi'],

            // Yon Kav 4/KC - Bandung
            ['nomor_seri' => 'MV - 42 - 005 - 2025', 'jenis' => 'Moving Target',    'asal_satuan' => 'YON KAV 4',             'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'PU - 42 - 011 - 2025', 'jenis' => 'DART Pop Up',      'asal_satuan' => 'YON KAV 4',             'status_unit' => 'Perbaikan'],

            // Yonif 310/KK - Sukabumi
            ['nomor_seri' => 'SW - 42 - 006 - 2025', 'jenis' => 'DART Swing',       'asal_satuan' => 'YONIF 310',             'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'MV - 42 - 006 - 2025', 'jenis' => 'Moving Target',    'asal_satuan' => 'YONIF 310',             'status_unit' => 'Beroperasi'],

            // Yonif Raider 323/BP - Banjar
            ['nomor_seri' => 'PU - 42 - 012 - 2025', 'jenis' => 'DART Pop Up',      'asal_satuan' => 'YONIF RAIDER 323',      'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'FL - 42 - 006 - 2025', 'jenis' => 'DART Flip',        'asal_satuan' => 'YONIF RAIDER 323',      'status_unit' => 'Beroperasi'],

            // Yon Arhanud 3/YBY - Bandung
            ['nomor_seri' => 'SW - 42 - 007 - 2025', 'jenis' => 'DART Swing',       'asal_satuan' => 'YON ARHANUD 3',         'status_unit' => 'Rusak'],
            ['nomor_seri' => 'FL - 42 - 007 - 2025', 'jenis' => 'DART Flip',        'asal_satuan' => 'YON ARHANUD 3',         'status_unit' => 'Beroperasi'],

            // Satuan Radar 211 - Kab. Tangerang
            ['nomor_seri' => 'MV - 42 - 007 - 2025', 'jenis' => 'Moving Target',    'asal_satuan' => 'SATUAN RADAR 211',      'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'PU - 42 - 013 - 2025', 'jenis' => 'DART Pop Up',      'asal_satuan' => 'SATUAN RADAR 211',      'status_unit' => 'Nonaktif'],

            // Yonif 320/BP - Pandeglang
            ['nomor_seri' => 'FL - 42 - 008 - 2025', 'jenis' => 'DART Flip',        'asal_satuan' => 'YONIF 320',             'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'MV - 42 - 008 - 2025', 'jenis' => 'Moving Target',    'asal_satuan' => 'YONIF 320',             'status_unit' => 'Perbaikan'],

            // Yon Armed 4/PR - Cimahi
            ['nomor_seri' => 'PU - 42 - 014 - 2025', 'jenis' => 'DART Pop Up',      'asal_satuan' => 'YON ARMED 4',           'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'FL - 42 - 009 - 2025', 'jenis' => 'DART Flip',        'asal_satuan' => 'YON ARMED 4',           'status_unit' => 'Beroperasi'],

            // Yon Kav 9/SDK - Tangerang Selatan
            ['nomor_seri' => 'SW - 42 - 008 - 2025', 'jenis' => 'DART Swing',       'asal_satuan' => 'YON KAV 9',             'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'PU - 42 - 015 - 2025', 'jenis' => 'DART Pop Up',      'asal_satuan' => 'YON KAV 9',             'status_unit' => 'Rusak'],

            // Yon Arhanud 10/ABC - Jakarta Selatan
            ['nomor_seri' => 'SW - 42 - 009 - 2025', 'jenis' => 'DART Swing',       'asal_satuan' => 'YON ARHANUD 10',        'status_unit' => 'Beroperasi'],
            ['nomor_seri' => 'MV - 42 - 009 - 2025', 'jenis' => 'Moving Target',    'asal_satuan' => 'YON ARHANUD 10',        'status_unit' => 'Beroperasi'],
        ];

        foreach ($units as $unit) {
            $satuan = \App\Models\Satuan::where('nama_satuan', $unit['asal_satuan'])->first();
            if ($satuan) {
                $unit['satuan_id'] = $satuan->id;
            }

            Unit::updateOrCreate(
                ['nomor_seri' => $unit['nomor_seri']],
                $unit
            );
        }

        $this->command->info('UnitSeeder: ' . count($units) . ' unit DART berhasil disinkronkan.');
    }
}
