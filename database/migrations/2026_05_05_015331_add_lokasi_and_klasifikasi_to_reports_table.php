<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            if (!Schema::hasColumn('reports', 'lokasi_laporan')) {
                $table->string('lokasi_laporan')->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('reports', 'klasifikasi')) {
                $table->string('klasifikasi')->nullable()->after('lokasi_laporan');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn(['lokasi_laporan', 'klasifikasi']);
        });
    }
};
