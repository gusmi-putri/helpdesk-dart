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
            if (Schema::hasColumn('reports', 'file_bukti_selesai_video')) {
                $table->dropColumn('file_bukti_selesai_video');
            }
        });

        Schema::table('units', function (Blueprint $table) {
            if (Schema::hasColumn('units', 'latitude')) {
                $table->dropColumn('latitude');
            }
            if (Schema::hasColumn('units', 'longitude')) {
                $table->dropColumn('longitude');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            if (! Schema::hasColumn('reports', 'file_bukti_selesai_video')) {
                $table->string('file_bukti_selesai_video')->nullable()->after('file_bukti_selesai');
            }
        });

        Schema::table('units', function (Blueprint $table) {
            if (! Schema::hasColumn('units', 'latitude')) {
                $table->decimal('latitude', 10, 8)->nullable()->after('asal_satuan');
            }
            if (! Schema::hasColumn('units', 'longitude')) {
                $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            }
        });
    }
};
