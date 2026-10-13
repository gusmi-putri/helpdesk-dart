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
        Schema::create('maintenance_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('satuan_id')->constrained('satuans');
            $table->foreignId('user_id')->constrained('users'); // Pelapor (Staf Satuan)
            $table->string('nama_giat');
            $table->string('periode');
            $table->integer('tahun');
            $table->string('anggaran_pendukung');
            $table->decimal('jumlah_anggaran', 15, 2);
            $table->string('dokumen_anggaran');
            $table->string('dokumen_lpj');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_reports');
    }
};
