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
        if (!Schema::hasColumn('units', 'jenis_dart')) {
            Schema::table('units', function (Blueprint $table) {
                $table->enum('jenis_dart', ['DART STD', 'DART STK', 'SKE', 'MOVING TARGET'])
                      ->default('DART STD')
                      ->after('nama_dart');
            });
        }
    }

    public function down(): void
    {
        Schema::table('units', function (Blueprint $table) {
            $table->dropColumn('jenis_dart');
        });
    }
};
