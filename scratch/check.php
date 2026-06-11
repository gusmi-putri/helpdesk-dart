<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

DB::statement("ALTER TABLE units MODIFY COLUMN status_unit ENUM('Siap Ops', 'Rusak', 'Perbaikan', 'Nonaktif') DEFAULT 'Siap Ops'");
echo "Table altered successfully.\n";
