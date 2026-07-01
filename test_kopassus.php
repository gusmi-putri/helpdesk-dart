<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$units = \App\Models\Unit::all();
foreach ($units as $unit) {
    if (stripos($unit->asal_satuan, 'kopassus') !== false || in_array($unit->status_unit, ['Rusak', 'Perbaikan'])) {
        echo "Unit ID: " . $unit->id . " | Seri: " . $unit->nomor_seri . " | Satuan: " . $unit->asal_satuan . " | Status: " . $unit->status_unit . "\n";
        $reports = $unit->reports;
        foreach($reports as $r) {
            echo "  -> Report ID: " . $r->id . " Status: " . $r->status_laporan . "\n";
        }
    }
}
