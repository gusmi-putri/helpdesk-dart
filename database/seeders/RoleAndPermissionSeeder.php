<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permissions by module
        $permissions = [
            // Dashboard / General Views
            'view-dashboard-admin',
            'view-dashboard-staf',
            'view-dashboard-teknisi',
            'view-dashboard-pelapor',
            
            // Personel (Users)
            'create-users',
            'read-users',
            'update-users',
            'delete-users',

            // Satuan
            'create-satuans',
            'read-satuans',
            'update-satuans',
            'delete-satuans',

            // Inventaris (Units)
            'create-units',
            'read-units',
            'update-units',
            'delete-units',

            // Laporan (Reports)
            'create-reports',
            'read-reports',
            'update-reports',
            'delete-reports',
            'assign-reports', // For assigning technicians (Ticket Manager)
            'verify-reports',
            'process-reports', // For technicians
            'export-recap',

            // Mutasi (Mutations)
            'create-mutations',
            'read-mutations',
            'update-mutations',
            'delete-mutations',

            // Logs
            'read-logs',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Define roles and assign permissions
        
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $admin->givePermissionTo(Permission::all());

        $supervisor = Role::firstOrCreate(['name' => 'Supervisor']);
        $supervisor->givePermissionTo([
            'view-dashboard-admin',
            'read-users',
            'read-satuans',
            'read-units',
            'read-reports',
            'read-mutations',
            'export-recap',
        ]);

        $staf = Role::firstOrCreate(['name' => 'Staf']);
        $staf->givePermissionTo([
            'view-dashboard-staf',
            'read-satuans',
            'create-satuans',
            'update-satuans',
            'read-units',
            'create-units',
            'update-units',
            'read-reports',
            'update-reports',
            'assign-reports',
            'verify-reports',
            'export-recap',
            'read-mutations',
            'create-mutations',
        ]);

        $teknisi = Role::firstOrCreate(['name' => 'Teknisi']);
        $teknisi->givePermissionTo([
            'view-dashboard-teknisi',
            'process-reports',
        ]);

        $pelapor = Role::firstOrCreate(['name' => 'Pelapor']);
        $pelapor->givePermissionTo([
            'view-dashboard-pelapor',
            'create-reports',
        ]);
    }
}
