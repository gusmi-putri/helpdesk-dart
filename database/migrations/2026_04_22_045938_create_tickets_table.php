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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('case_id')->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['PENDING', 'DIPROSES', 'SELESAI'])->default('PENDING');
            $table->string('barang_rusak');
            $table->string('lokasi');
            $table->text('deskripsi');
            $table->string('dokumentasi_path')->nullable();
            
            $table->foreignId('technician_id')->nullable()->constrained('users')->onDelete('set null');
            $table->dateTime('tanggal_penanganan')->nullable();
            $table->text('tindakan')->nullable();
            $table->string('suku_cadang')->nullable();
            $table->enum('status_perbaikan', ['MENUNGGU', 'DIANALISA', 'PERBAIKAN', 'TUNTAS'])->default('MENUNGGU');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
