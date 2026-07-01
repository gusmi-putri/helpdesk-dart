<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$satuan = \App\Models\Satuan::first();
$unit = \App\Models\Unit::create([
    'nomor_seri' => 'TEST-TXN-001',
    'jenis' => 'DART STD',
    'asal_satuan' => $satuan ? $satuan->nama_satuan : 'UMUM',
    'status_unit' => 'Beroperasi'
]);

echo "Initial Status Unit: " . $unit->status_unit . "\n";

DB::transaction(function () use ($unit) {
    $report = \App\Models\Report::create([
        'unit_id' => $unit->id,
        'user_id' => 1,
        'lokasi_laporan' => 'Test',
        'klasifikasi' => 'RINGAN',
        'deskripsi_kerusakan' => 'Test',
        'tingkat_kerusakan' => 'RINGAN',
        'status_laporan' => 'Pending'
    ]);

    echo "Created report ID inside TXN: " . $report->id . "\n";

    \App\Models\Unit::find($unit->id)->syncStatus();
});

// Refresh to see if it persisted
$unit->refresh();
echo "After Pending Report TXN - Status Unit: " . $unit->status_unit . "\n";

$report = \App\Models\Report::where('unit_id', $unit->id)->first();
$report->forceDelete();
$unit->forceDelete();
