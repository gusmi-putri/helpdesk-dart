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
            $table->enum('jenis_perbaikan', ['Swadaya', 'Non-Swadaya'])->default('Swadaya')->after('urgensi');
            $table->text('dokumen_anggaran')->nullable()->after('file_bukti');
            $table->text('keterangan_anggaran')->nullable()->after('dokumen_anggaran');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->dropColumn(['jenis_perbaikan', 'dokumen_anggaran', 'keterangan_anggaran']);
        });
    }
};
