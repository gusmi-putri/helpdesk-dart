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
            if (Schema::hasColumn('satuans', 'kotama')) {
                $table->dropColumn('kotama');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('satuans', function (Blueprint $table) {
            if (! Schema::hasColumn('satuans', 'kotama')) {
                $table->string('kotama')->nullable()->after('nama_satuan');
            }
        });
    }
};
