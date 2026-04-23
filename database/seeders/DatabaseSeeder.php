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
        $adminRole = \App\Models\Role::create(['nama_role' => 'Admin']);
        $stafRole = \App\Models\Role::create(['nama_role' => 'Staf']);
        $teknisiRole = \App\Models\Role::create(['nama_role' => 'Teknisi']);
        $pelaporRole = \App\Models\Role::create(['nama_role' => 'Pelapor']);

        // 2. Seed Users
        $admin = \App\Models\User::create([
            'username' => 'admin',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'nama_lengkap' => 'Komandan Pusat',
            'role_id' => $adminRole->id,
        ]);

        $staf = \App\Models\User::create([
            'username' => 'staf1',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'nama_lengkap' => 'Staf Komando 01',
            'role_id' => $stafRole->id,
        ]);

        $teknisi = \App\Models\User::create([
            'username' => 'teknisi1',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'nama_lengkap' => 'Teknisi Alfa',
            'role_id' => $teknisiRole->id,
            'spesialisasi' => 'Mekanik & Elektronik',
        ]);

        $pelapor = \App\Models\User::create([
            'username' => 'pelapor1',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'nama_lengkap' => 'Pos Pantau Alpha',
            'role_id' => $pelaporRole->id,
            'asal_satuan' => 'Sektor Utara',
        ]);

        // 3. Seed Units
        $unit = \App\Models\Unit::create([
            'nomor_seri' => 'DRT-001',
            'nama_dart' => 'Kamera Thermal V3',
            'asal_satuan' => 'Sektor Utara',
            'status_unit' => 'Siap Ops',
        ]);

        // 4. Seed a Report
        \App\Models\Report::create([
            'unit_id' => $unit->id,
            'user_id' => $pelapor->id,
            'staff_id' => $staf->id,
            'teknisi_id' => $teknisi->id,
            'tanggal_lapor' => now(),
            'deskripsi_kerusakan' => 'Lensa pecah akibat benturan objek asing.',
            'status_laporan' => 'Proses',
            'metode_perbaikan' => 'Offline',
            'tgl_ditunjuk' => now(),
        ]);
    }
}
