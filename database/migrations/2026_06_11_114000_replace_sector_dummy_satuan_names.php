<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private array $replacements = [
        'Sektor Utara' => 'AKMIL',
        'Sektor Selatan' => 'YONIF RAIDER 303/SSM',
        'Sektor Timur' => 'YONIF 315/GARUDA',
        'Sektor Barat' => 'PUSDIKIF PUSSENIF',
        'Pos Komando Pusat' => 'BENGPUSKOMLEKAD',
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach ($this->replacements as $from => $to) {
            DB::table('units')->where('asal_satuan', $from)->update(['asal_satuan' => $to]);
            DB::table('users')->where('asal_satuan', $from)->update(['asal_satuan' => $to]);
            DB::table('reports')->where('lokasi_laporan', $from)->update(['lokasi_laporan' => $to]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach (array_reverse($this->replacements) as $from => $to) {
            DB::table('units')->where('asal_satuan', $to)->update(['asal_satuan' => $from]);
            DB::table('users')->where('asal_satuan', $to)->update(['asal_satuan' => $from]);
            DB::table('reports')->where('lokasi_laporan', $to)->update(['lokasi_laporan' => $from]);
        }
    }
};
