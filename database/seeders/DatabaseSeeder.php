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
            'urgensi' => 'URGENT',
            'deskripsi_kerusakan' => 'Radar tidak merespon perintah frekuensi X.',
            'status_laporan' => 'Pending',
        ]);

        // Sync status units
        foreach (\App\Models\Unit::all() as $u) {
            $u->syncStatus();
        }
    }
}
