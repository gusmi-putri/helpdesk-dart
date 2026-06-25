<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Satuan;

class SatuanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $satuans = [
            // KOSTRAD
            ['nama_satuan' => 'MAKOSTRAD', 'latitude' => -6.1738, 'longitude' => 106.8286],
            ['nama_satuan' => 'DIVIF 1 KOSTRAD', 'latitude' => -6.4385, 'longitude' => 106.8458],
            ['nama_satuan' => 'DIVIF 2 KOSTRAD', 'latitude' => -7.8761, 'longitude' => 112.6687],
            ['nama_satuan' => 'DIVIF 3 KOSTRAD', 'latitude' => -5.2285, 'longitude' => 119.5168],

            // KOPASSUS
            ['nama_satuan' => 'MAKO KOPASSUS', 'latitude' => -6.3168, 'longitude' => 106.8596],
            ['nama_satuan' => 'GRUP 1 KOPASSUS', 'latitude' => -6.1037, 'longitude' => 106.1158],
            ['nama_satuan' => 'GRUP 2 KOPASSUS', 'latitude' => -7.5489, 'longitude' => 110.7410],
            ['nama_satuan' => 'PUSDIKLATPASSUS', 'latitude' => -6.9248, 'longitude' => 107.4912],

            // MARINIR & TNI AL
            ['nama_satuan' => 'MAKO MARINIR', 'latitude' => -6.1779, 'longitude' => 106.8378],
            ['nama_satuan' => 'PASMAR 1', 'latitude' => -6.1039, 'longitude' => 106.9455],
            ['nama_satuan' => 'PASMAR 2', 'latitude' => -7.3916, 'longitude' => 112.7246],
            ['nama_satuan' => 'PASMAR 3', 'latitude' => -0.8931, 'longitude' => 131.3129],
            ['nama_satuan' => 'LANTAMAL III', 'latitude' => -6.1305, 'longitude' => 106.8267],
            ['nama_satuan' => 'LANTAMAL V', 'latitude' => -7.2023, 'longitude' => 112.7381],

            // KOPASGAT & TNI AU
            ['nama_satuan' => 'MAKO KOPASGAT', 'latitude' => -6.9749, 'longitude' => 107.5448],
            ['nama_satuan' => 'LANUD HALIM PERDANAKUSUMA', 'latitude' => -6.2655, 'longitude' => 106.8856],
            ['nama_satuan' => 'LANUD ISWAHJUDI', 'latitude' => -7.6163, 'longitude' => 111.4361],
            ['nama_satuan' => 'LANUD ROESMIN NURJADIN', 'latitude' => -0.4608, 'longitude' => 101.4475],
            ['nama_satuan' => 'LANUD SULTAN HASANUDDIN', 'latitude' => -5.0616, 'longitude' => 119.5540],
            ['nama_satuan' => 'LANUD SUPADIO', 'latitude' => -0.1448, 'longitude' => 109.4042],

            // DEFAULT KODAM
            ['nama_satuan' => 'BENGPUSKOMLEKAD', 'latitude' => -6.9147, 'longitude' => 107.6098],
            ['nama_satuan' => 'KODAM JAYA', 'latitude' => -6.255, 'longitude' => 106.877],
            ['nama_satuan' => 'KODAM III/SILIWANGI', 'latitude' => -6.9147, 'longitude' => 107.6098],
            ['nama_satuan' => 'KODAM IV/DIPONEGORO', 'latitude' => -7.048, 'longitude' => 110.409],
            ['nama_satuan' => 'KODAM V/BRAWIJAYA', 'latitude' => -7.289, 'longitude' => 112.721],
            ['nama_satuan' => 'KODAM I/BUKIT BARISAN', 'latitude' => 3.595, 'longitude' => 98.672],
            ['nama_satuan' => 'KODAM XIV/HASANUDDIN', 'latitude' => -5.147, 'longitude' => 119.432],
            ['nama_satuan' => 'KODAM XVII/CENDERAWASIH', 'latitude' => -2.591, 'longitude' => 140.669],
            ['nama_satuan' => 'KODAM VI/MULAWARMAN', 'latitude' => -1.242, 'longitude' => 116.852],
            ['nama_satuan' => 'KODAM IX/UDAYANA', 'latitude' => -8.670, 'longitude' => 115.212],



            // DUMMY DATA FROM SEEDER
            ['nama_satuan' => 'AKMIL', 'latitude' => -7.4789, 'longitude' => 110.2170],
            ['nama_satuan' => 'YONIF RAIDER 303/SSM', 'latitude' => -7.2286, 'longitude' => 107.9089],
            ['nama_satuan' => 'YONIF 315/GARUDA', 'latitude' => -6.5950, 'longitude' => 106.8166],
            ['nama_satuan' => 'PUSDIKIF PUSSENIF', 'latitude' => -6.8375, 'longitude' => 107.4667],
            ['nama_satuan' => 'SATUAN RADAR 211', 'latitude' => -6.1039, 'longitude' => 106.9455],

            // NEW SATUAN KOORDINAT
            ['nama_satuan' => 'YONIF PARA RAIDER 501', 'latitude' => -7.6198, 'longitude' => 111.5309],
            ['nama_satuan' => 'YONIF RAIDER 509', 'latitude' => -8.1741, 'longitude' => 113.7198],
            ['nama_satuan' => 'YONIF RAIDER 328', 'latitude' => -6.4439, 'longitude' => 106.8333],
            ['nama_satuan' => 'YONIF RAIDER 300', 'latitude' => -6.8115, 'longitude' => 107.1528],
            ['nama_satuan' => 'YON ARMED 9', 'latitude' => -6.5625, 'longitude' => 107.4475],
            ['nama_satuan' => 'YON KAV 4', 'latitude' => -6.9234, 'longitude' => 107.6258],
            ['nama_satuan' => 'YONIF 310', 'latitude' => -6.9458, 'longitude' => 106.9128],
            ['nama_satuan' => 'YONIF RAIDER 323', 'latitude' => -7.3758, 'longitude' => 108.5667],
            ['nama_satuan' => 'YON ARHANUD 3', 'latitude' => -6.9069, 'longitude' => 107.6369],
            ['nama_satuan' => 'YONIF 320', 'latitude' => -6.3128, 'longitude' => 105.8528],
            ['nama_satuan' => 'YON ARMED 4', 'latitude' => -6.8858, 'longitude' => 107.5458],
            ['nama_satuan' => 'YON KAV 9', 'latitude' => -6.2758, 'longitude' => 106.6667],
            ['nama_satuan' => 'YON ARHANUD 10', 'latitude' => -6.2588, 'longitude' => 106.8228],
        ];

        $kodeCounter = 1;
        foreach ($satuans as $s) {
            // Generate dummy code
            $kodeSatuan = 'SAT-' . str_pad($kodeCounter, 3, '0', STR_PAD_LEFT);
            $kodeCounter++;

            // Basic Address Mapping
            $alamat = 'Markas ' . ucwords(strtolower($s['nama_satuan'])) . ', Indonesia';
            if (strpos($s['nama_satuan'], 'JAKARTA') !== false || strpos($s['nama_satuan'], 'MAKOSTRAD') !== false || strpos($s['nama_satuan'], 'MARINIR') !== false) {
                $alamat = 'Jl. Medan Merdeka, Jakarta Pusat, DKI Jakarta';
            } elseif (strpos($s['nama_satuan'], 'KOPASSUS') !== false && strpos($s['nama_satuan'], 'MAKO') !== false) {
                $alamat = 'Cijantung, Kec. Ps. Rebo, Kota Jakarta Timur, DKI Jakarta';
            } elseif (strpos($s['nama_satuan'], 'DIVIF 1') !== false) {
                $alamat = 'Cilodong, Kota Depok, Jawa Barat';
            } elseif (strpos($s['nama_satuan'], 'DIVIF 2') !== false) {
                $alamat = 'Singosari, Kabupaten Malang, Jawa Timur';
            } elseif (strpos($s['nama_satuan'], 'DIVIF 3') !== false) {
                $alamat = 'Pakatto, Kabupaten Gowa, Sulawesi Selatan';
            } elseif (strpos($s['nama_satuan'], 'AKMIL') !== false) {
                $alamat = 'Jl. Gatot Subroto, Magelang Tengah, Kota Magelang, Jawa Tengah';
            } elseif (strpos($s['nama_satuan'], 'SILIWANGI') !== false || strpos($s['nama_satuan'], 'BANDUNG') !== false) {
                $alamat = 'Kota Bandung, Jawa Barat';
            }

            Satuan::updateOrCreate(
                ['nama_satuan' => $s['nama_satuan']],
                [
                    'kode_satuan' => $kodeSatuan,
                    'alamat' => $alamat,
                    'latitude' => $s['latitude'],
                    'longitude' => $s['longitude'],
                    'is_verified' => true
                ]
            );
        }
    }
}
