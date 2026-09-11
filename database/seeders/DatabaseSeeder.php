<?php

namespace Database\Seeders;

use App\Models\User;
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
        $this->call(SatuanSeeder::class);
        $this->call(RoleAndPermissionSeeder::class);

        // 2. Seed Users
        $admin = \App\Models\User::create([
            'username' => 'admin',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'nama_lengkap' => 'Komandan Pusat',
            'email' => 'admin@pusat.mil.id',
            'nrp_nip' => '1100223344',
            'no_wa' => '081234567890',
            'is_approved' => true,
        ]);
        $admin->assignRole('Admin');

        $staf = \App\Models\User::create([
            'username' => 'staf1',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'nama_lengkap' => 'Staf Komando 01',
            'email' => 'staf1@komando.mil.id',
            'nrp_nip' => '2200334455',
            'no_wa' => '082345678901',
            'is_approved' => true,
        ]);
        $staf->assignRole('Staf');

        $teknisi = \App\Models\User::create([
            'username' => 'teknisi1',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'nama_lengkap' => 'Teknisi Alfa',
            'email' => 'teknisi1@bengpus.mil.id',
            'nrp_nip' => '3300445566',
            'no_wa' => '083456789012',
            'spesialisasi' => 'Mekanik, Elektronik & Jaringan Komunikasi',
            'is_approved' => true,
        ]);
        $teknisi->assignRole('Teknisi');

        $satuanAkmil = \App\Models\Satuan::where('nama_satuan', 'AKMIL')->first();
        $pelapor = \App\Models\User::create([
            'username' => 'pelapor1',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'nama_lengkap' => 'Operator Satkai AKMIL',
            'email' => 'operator@akmil.ac.id',
            'nrp_nip' => '4400556677',
            'no_wa' => '084567890123',
            'asal_satuan' => 'AKMIL',
            'satuan_id' => $satuanAkmil ? $satuanAkmil->id : null,
            'is_approved' => true,
        ]);
        $pelapor->assignRole('Pelapor');

        // 3. Seed Data Master
        $this->call(UnitSeeder::class);
        $unit1 = \App\Models\Unit::where('nomor_seri', 'PU - 42 - 001 - 2025')->first();
        $unit2 = \App\Models\Unit::where('nomor_seri', 'FL - 42 - 001 - 2025')->first();
        $unit4 = \App\Models\Unit::where('nomor_seri', 'PU - 42 - 003 - 2025')->first();
        $unit12 = \App\Models\Unit::where('nomor_seri', 'PU - 42 - 006 - 2025')->first();
        $unit15 = \App\Models\Unit::where('nomor_seri', 'MV - 42 - 003 - 2025')->first();
        $unit22 = \App\Models\Unit::where('nomor_seri', 'FL - 42 - 005 - 2025')->first();

        // 4. Seed Reports
        \App\Models\Report::create([
            'unit_id' => $unit1->id,
            'user_id' => $pelapor->id,
            'staff_id' => $staf->id,
            'teknisi_id' => $teknisi->id,
            'tanggal_lapor' => now()->subDays(2),
            'lokasi_laporan' => 'AKMIL',
            'klasifikasi' => 'HARDWARE',
            'tingkat_kerusakan' => 'SEDANG',
            'urgensi' => 'RUTIN',
            'deskripsi_kerusakan' => 'Lensa pecah akibat benturan objek asing.',
            'status_laporan' => 'Selesai',
            'metode_perbaikan' => 'Offline',
            'tgl_ditunjuk' => now()->subDays(2),
            'tgl_selesai' => now()->subDays(1),
            'catatan_teknisi' => 'Penggantian modul lensa V3 berhasil dilakukan.',
        ]);

        \App\Models\Report::create([
            'unit_id' => $unit2->id,
            'user_id' => $pelapor->id,
            'tanggal_lapor' => now(),
            'lokasi_laporan' => 'AKMIL',
            'klasifikasi' => 'ELEKTRONIK',
            'tingkat_kerusakan' => 'BERAT',
            'urgensi' => 'Sangat Mendesak',
            'deskripsi_kerusakan' => 'Radar tidak merespon perintah frekuensi X.',
            'status_laporan' => 'Pending',
        ]);

        \App\Models\Report::create([
            'unit_id' => $unit4->id,
            'user_id' => $pelapor->id,
            'tanggal_lapor' => now()->subHours(5),
            'lokasi_laporan' => 'AKMIL',
            'klasifikasi' => 'HARDWARE',
            'tingkat_kerusakan' => 'RINGAN',
            'urgensi' => 'Bisa Menunggu',
            'deskripsi_kerusakan' => 'Braket dudukan sensor longgar.',
            'status_laporan' => 'Diverifikasi',
        ]);

        \App\Models\Report::create([
            'unit_id' => $unit12->id,
            'user_id' => $pelapor->id,
            'staff_id' => $staf->id,
            'teknisi_id' => $teknisi->id,
            'tanggal_lapor' => now()->subHours(4),
            'lokasi_laporan' => 'YONIF RAIDER 303/SSM',
            'klasifikasi' => 'HARDWARE',
            'tingkat_kerusakan' => 'SEDANG',
            'urgensi' => 'Bisa Menunggu',
            'deskripsi_kerusakan' => 'Kabel daya sensor gerak terkelupas.',
            'status_laporan' => 'Diterima Teknisi',
            'tgl_ditunjuk' => now()->subHours(3),
        ]);

        \App\Models\Report::create([
            'unit_id' => $unit15->id,
            'user_id' => $pelapor->id,
            'staff_id' => $staf->id,
            'teknisi_id' => $teknisi->id,
            'tanggal_lapor' => now()->subHours(8),
            'lokasi_laporan' => 'YONIF RAIDER 303/SSM',
            'klasifikasi' => 'ELEKTRONIK',
            'tingkat_kerusakan' => 'BERAT',
            'urgensi' => 'Sangat Mendesak',
            'deskripsi_kerusakan' => 'Layar monitor simulator berkedip terus menerus.',
            'status_laporan' => 'Diproses',
            'tgl_ditunjuk' => now()->subHours(7),
        ]);

        \App\Models\Report::create([
            'unit_id' => $unit22->id,
            'user_id' => $pelapor->id,
            'tanggal_lapor' => now()->subDays(3),
            'lokasi_laporan' => 'YONIF 315/GARUDA',
            'klasifikasi' => 'S',
            'tingkat_kerusakan' => 'RINGAN',
            'urgensi' => 'Pemeliharaan Rutin',
            'deskripsi_kerusakan' => 'Laporan uji coba saja, tidak ada kerusakan riil.',
            'status_laporan' => 'Ditolak',
        ]);

        // Sync status units
        foreach (\App\Models\Unit::all() as $u) {
            $u->syncStatus();
        }
    }
}
