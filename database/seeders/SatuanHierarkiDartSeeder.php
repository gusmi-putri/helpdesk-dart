<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Satuan;

/**
 * Relasi induk-anak (Kodam -> Yonif) sesuai Lampiran Surat Perintah Kasad
 * Nomor Sprin/5377/XII/2024 tanggal 16 Desember 2024 — Daftar Distribusi Alkap DART.
 * Satuan yang belum ada akan dibuat baru, yang sudah ada (match nama_satuan) hanya di-update parent_id-nya.
 */
class SatuanHierarkiDartSeeder extends Seeder
{
    public function run(): void
    {
        $struktur = [
            'KODAM I/BUKIT BARISAN' => ['YONIF 121/MK'],
            'KODAM II/SRIWIJAYA' => ['YONIF 200/BN'],
            'KODAM III/SILIWANGI' => ['YONIF 300/BJW', 'YONIF 320/BP'],
            'KODAM V/BRAWIJAYA' => ['YONIF 502/UY'],
            'KODAM VI/MULAWARMAN' => ['YONIF 613/RJA'],
            'KODAM IX/UDAYANA' => ['YONIF 743/PSY'],
            'KODAM XII/TANJUNGPURA' => ['YONIF 643/WNS'],
            'KODAM XIII/MERDEKA' => ['YONIF 715/MTL', 'YONIF 431/SSP'],
            'KODAM XIV/HASANUDDIN' => ['YONIF 700/WYC'],
            'KODAM XV/PATTIMURA' => ['YONIF 735/NWS'],
            'KODAM XVII/CENDERAWASIH' => ['YONIF 751/VJS'],
            'KODAM XVIII/KASUARI' => ['YONIF 763/SBA'],
        ];

        $kodeCounter = (int) (Satuan::max('id') ?? 0) + 1000;

        foreach ($struktur as $namaKodam => $yonifs) {
            $kodam = Satuan::firstOrCreate(
                ['nama_satuan' => $namaKodam],
                [
                    'kode_satuan' => 'SAT-' . str_pad($kodeCounter++, 3, '0', STR_PAD_LEFT),
                    'alamat' => 'Markas ' . ucwords(strtolower($namaKodam)) . ', Indonesia',
                    'is_verified' => true,
                ]
            );

            foreach ($yonifs as $namaYonif) {
                Satuan::updateOrCreate(
                    ['nama_satuan' => $namaYonif],
                    [
                        'parent_id' => $kodam->id,
                        'kode_satuan' => Satuan::where('nama_satuan', $namaYonif)->value('kode_satuan')
                            ?? 'SAT-' . str_pad($kodeCounter++, 3, '0', STR_PAD_LEFT),
                        'alamat' => Satuan::where('nama_satuan', $namaYonif)->value('alamat')
                            ?? 'Markas ' . ucwords(strtolower($namaYonif)) . ', Indonesia',
                        'is_verified' => true,
                    ]
                );
            }
        }
    }
}
