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
            $table->enum('tingkat_kerusakan', ['Ringan', 'Sedang', 'Parah'])->default('Ringan')->after('deskripsi_kerusakan');
            $table->enum('urgensi', ['Sangat Mendesak', 'Bisa Menunggu', 'Pemeliharaan Rutin'])->default('Bisa Menunggu')->after('tingkat_kerusakan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn(['tingkat_kerusakan', 'urgensi']);
        });
    }
};
