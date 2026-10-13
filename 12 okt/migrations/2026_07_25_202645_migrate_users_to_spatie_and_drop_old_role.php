<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Move data
        $oldRoles = DB::table('old_roles')->get();
        $newRoles = DB::table('roles')->get();

        foreach ($oldRoles as $oldRole) {
            if (!$newRoles->contains('name', ucfirst($oldRole->nama_role))) {
                DB::table('roles')->insert([
                    'name' => ucfirst($oldRole->nama_role),
                    'guard_name' => 'web',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
        $newRoles = DB::table('roles')->get();

        $users = DB::table('users')->get();
        foreach ($users as $user) {
            if ($user->role_id) {
                $oldRole = $oldRoles->firstWhere('id', $user->role_id);
                if ($oldRole) {
                    $newRole = $newRoles->firstWhere('name', ucfirst($oldRole->nama_role));
                    if ($newRole) {
                        DB::table('model_has_roles')->insert([
                            'role_id' => $newRole->id,
                            'model_type' => 'App\Models\User',
                            'model_id' => $user->id,
                        ]);
                    }
                }
            }
        }

        // 2. Drop columns and tables
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role_id');
        });

        Schema::dropIfExists('old_roles');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('spatie_and_drop_old_role', function (Blueprint $table) {
            //
        });
    }
};
