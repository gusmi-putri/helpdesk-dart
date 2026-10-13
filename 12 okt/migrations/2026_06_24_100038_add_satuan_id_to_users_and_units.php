<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('satuan_id')->nullable()->after('asal_satuan')->constrained('satuans')->nullOnDelete();
        });

        Schema::table('units', function (Blueprint $table) {
            $table->foreignId('satuan_id')->nullable()->after('asal_satuan')->constrained('satuans')->nullOnDelete();
        });

        // Migrate existing data
        $this->migrateData('users');
        $this->migrateData('units');

        // Make old columns nullable (just in case they weren't)
        Schema::table('users', function (Blueprint $table) {
            $table->string('asal_satuan')->nullable()->change();
        });
        Schema::table('units', function (Blueprint $table) {
            $table->string('asal_satuan')->nullable()->change();
        });
    }

    protected function migrateData($table)
    {
        $records = DB::table($table)->whereNotNull('asal_satuan')->get();
        foreach ($records as $record) {
            $satuanName = trim($record->asal_satuan);
            if (empty($satuanName)) continue;

            $satuan = DB::table('satuans')->where('nama_satuan', $satuanName)->first();
            if (!$satuan) {
                $satuanId = DB::table('satuans')->insertGetId([
                    'nama_satuan' => $satuanName,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'is_active' => true,
                ]);
            } else {
                $satuanId = $satuan->id;
            }

            DB::table($table)->where('id', $record->id)->update([
                'satuan_id' => $satuanId
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['satuan_id']);
            $table->dropColumn('satuan_id');
        });

        Schema::table('units', function (Blueprint $table) {
            $table->dropForeign(['satuan_id']);
            $table->dropColumn('satuan_id');
        });
    }
};
