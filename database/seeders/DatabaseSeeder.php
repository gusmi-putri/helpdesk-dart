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
        // 1. Seed Roles
        $adminRole = \App\Models\Role::firstOrCreate(['nama_role' => 'Admin']);
        $stafRole = \App\Models\Role::create(['nama_role' => 'Staf']);
        $teknisiRole = \App\Models\Role::create(['nama_role' => 'Teknisi']);
        $pelaporRole = \App\Models\Role::create(['nama_role' => 'Pelapor']);

        // 2. Seed Users
        $admin = \App\Models\User::create([
            'username' => 'admin',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'nama_lengkap' => 'Komandan Pusat',
            'role_id' => $adminRole->id,
            'is_approved' => true,
        ]);

        $staf = \App\Models\User::create([
            'username' => 'staf1',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'nama_lengkap' => 'Staf Komando 01',
            'role_id' => $stafRole->id,
            'is_approved' => true,
        ]);

        $teknisi = \App\Models\User::create([
            'username' => 'teknisi1',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'nama_lengkap' => 'Teknisi Alfa',
            'role_id' => $teknisiRole->id,
            'spesialisasi' => 'Mekanik & Elektronik',
            'is_approved' => true,
        ]);

        $pelapor = \App\Models\User::create([
            'username' => 'pelapor1',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'nama_lengkap' => 'Pos Pantau Alpha',
            'role_id' => $pelaporRole->id,
            'asal_satuan' => 'Sektor Utara',
            'is_approved' => true,
        ]);

        // 3. Seed Units via UnitSeeder
        $this->call(UnitSeeder::class);
        $unit1 = \App\Models\Unit::where('nomor_seri', 'DRT-001')->first();
        $unit2 = \App\Models\Unit::where('nomor_seri', 'DRT-003')->first();
        $unit4 = \App\Models\Unit::where('nomor_seri', 'DRT-004')->first();
        $unit12 = \App\Models\Unit::where('nomor_seri', 'DRT-012')->first();
        $unit15 = \App\Models\Unit::where('nomor_seri', 'DRT-015')->first();
        $unit22 = \App\Models\Unit::where('nomor_seri', 'DRT-022')->first();

        // 4. Seed Reports
        \App\Models\Report::create([
            'unit_id' => $unit1->id,
            'user_id' => $pelapor->id,
            'staff_id' => $staf->id,
            'teknisi_id' => $teknisi->id,
            'tanggal_lapor' => now()->subDays(2),
            'lokasi_laporan' => 'Sektor Utara',
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
            'lokasi_laporan' => 'Sektor Utara',
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
            'lokasi_laporan' => 'Sektor Utara',
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
            'lokasi_laporan' => 'Sektor Selatan',
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
            'lokasi_laporan' => 'Sektor Selatan',
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
            'lokasi_laporan' => 'Sektor Timur',
            'klasifikasi' => 'SKE',
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
