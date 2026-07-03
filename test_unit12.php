<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$unit = \App\Models\Unit::find(12);
if ($unit) {
    foreach($unit->reports as $r) {
        echo "Report #{$r->id}: {$r->deskripsi_kerusakan} | Status: {$r->status_laporan} | Tgl: {$r->created_at}\n";
    }
}
