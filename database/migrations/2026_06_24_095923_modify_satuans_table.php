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
        Schema::table('satuans', function (Blueprint $table) {
            $table->string('kode_satuan')->nullable()->unique()->after('id');
            $table->string('kotama')->nullable()->after('nama_satuan');
            $table->text('alamat')->nullable()->after('kotama');
            $table->boolean('is_active')->default(true)->after('longitude');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('satuans', function (Blueprint $table) {
            $table->dropColumn(['kode_satuan', 'kotama', 'alamat', 'is_active']);
        });
    }
};
