<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Ticket;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Users (Roles: Admin, Staf, Teknisi, Pelapor)
        $admin = User::factory()->create([
            'name' => 'Komandan Pusat',
            'email' => 'admin@dart.com',
            'role' => 'Admin',
            'password' => Hash::make('password')
        ]);

        $staf = User::factory()->create([
            'name' => 'Staf Operasional',
            'email' => 'staf@dart.com',
            'role' => 'Staf',
            'password' => Hash::make('password')
        ]);

        $teknisi = User::factory()->create([
            'name' => 'Sertu Bambang',
            'email' => 'teknisi@dart.com',
            'role' => 'Teknisi',
            'password' => Hash::make('password')
        ]);

        $teknisi2 = User::factory()->create([
            'name' => 'Pratu Wira',
            'email' => 'teknisi2@dart.com',
            'role' => 'Teknisi',
            'password' => Hash::make('password')
        ]);

        $pelapor1 = User::factory()->create([
            'name' => 'Pos Pantau Alpha',
            'email' => 'alpha@dart.com',
            'role' => 'Pelapor',
            'password' => Hash::make('password')
        ]);

        $pelapor2 = User::factory()->create([
            'name' => 'Gudang Logistik',
            'email' => 'gudang@dart.com',
            'role' => 'Pelapor',
            'password' => Hash::make('password')
        ]);

        $pelapor3 = User::factory()->create([
            'name' => 'Area Latihan B',
            'email' => 'areab@dart.com',
            'role' => 'Pelapor',
            'password' => Hash::make('password')
        ]);

        // 2. Create Tickets directly mimicking the mock data
        Ticket::create([
            'case_id' => 'CASE-26-04-001',
            'user_id' => $pelapor1->id,
            'status' => 'SELESAI',
            'barang_rusak' => 'Kamera Thermal Sektor Utara',
            'lokasi' => 'Menara Utara',
            'deskripsi' => 'Kamera memberikan tampilan blank memancarkan artefak hitam setelah cuaca buruk. Diperlukan penanganan cepat karena area blind spot.',
            'created_at' => Carbon::parse('2026-04-21 08:30:00'),
            
            'technician_id' => $teknisi->id,
            'tanggal_penanganan' => Carbon::parse('2026-04-21 10:15:00'),
            'tindakan' => 'Melakukan kalibrasi ulang sensor thermal dan penggantian kabel optik yang terputus akibat gangguan cuaca.',
            'suku_cadang' => 'Kabel Optik Mil-Spec, Lensa Sensor Cadangan',
            'status_perbaikan' => 'TUNTAS'
        ]);

        Ticket::create([
            'case_id' => 'CASE-26-04-002',
            'user_id' => $pelapor2->id,
            'status' => 'PENDING',
            'barang_rusak' => 'Sensor Pintu Baja Taktis',
            'lokasi' => 'Bunker Bawah Tanah',
            'deskripsi' => 'Pintu baja otomatis macet total. Pemindai RF-ID berkedip merah terus-menerus dan menolak semua akses card level 3.',
            'created_at' => Carbon::parse('2026-04-21 09:15:00'),
        ]);

        Ticket::create([
            'case_id' => 'CASE-26-04-003',
            'user_id' => $pelapor3->id,
            'status' => 'DIPROSES',
            'barang_rusak' => 'Sistem Ventilasi Udara',
            'lokasi' => 'Gudang Persenjataan',
            'deskripsi' => 'Kipas exhaust berdengung keras dan tidak menyedot udara dengan maksimal. Membuat suhu ruangan menjadi tidak stabil.',
            'created_at' => Carbon::parse('2026-04-21 11:20:00'),
            
            'technician_id' => $teknisi2->id,
            'tanggal_penanganan' => Carbon::parse('2026-04-21 13:00:00'),
            'tindakan' => 'Sedang dilakukan pengecekan motor kipas dan dinamo. Membutuhkan izin kelistrikan sebelum mematikan panel utama.',
            'suku_cadang' => '-',
            'status_perbaikan' => 'DIANALISA'
        ]);
        
    }
}
