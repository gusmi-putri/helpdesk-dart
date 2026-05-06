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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_id')->constrained('units');
            $table->foreignId('user_id')->constrained('users'); // Pelapor
            $table->foreignId('staff_id')->nullable()->constrained('users'); // Staf Komando
            $table->foreignId('teknisi_id')->nullable()->constrained('users'); // Teknisi
            $table->timestamp('tanggal_lapor');
            $table->string('lokasi_laporan')->nullable();
            $table->string('klasifikasi')->nullable();
            $table->string('tingkat_kerusakan')->nullable();
            $table->string('urgensi')->nullable();
            $table->text('deskripsi_kerusakan');
            $table->string('file_bukti')->nullable();
            $table->string('file_bukti_selesai')->nullable();
            $table->enum('status_laporan', ['Pending', 'Proses', 'Selesai'])->default('Pending');
            $table->enum('metode_perbaikan', ['Online', 'Offline'])->nullable();
            $table->timestamp('tgl_ditunjuk')->nullable();
            $table->timestamp('tgl_selesai')->nullable();
            $table->text('catatan_teknisi')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
