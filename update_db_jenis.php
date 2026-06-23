<?php

use App\Models\Unit;
use App\Models\UnitMutation;

$map = [
    'DART STD' => 'dart std (standar)',
    'DART STK' => 'dart stk (khusus)',
    'SKE' => 'dart portabel-swing',
    'MOVING TARGET' => 'moving target (bukan dart)'
];

foreach ($map as $old => $new) {
    Unit::where('jenis', $old)->update(['jenis' => $new]);
}

$mutations = UnitMutation::all();
foreach ($mutations as $m) {
    $data = $m->unit_data;
    if (isset($data['jenis_dart'])) {
        $data['jenis'] = $data['jenis_dart'];
        unset($data['jenis_dart']);
    }
    if (isset($data['jenis']) && isset($map[$data['jenis']])) {
        $data['jenis'] = $map[$data['jenis']];
    }
    $m->unit_data = $data;
    $m->save();
}

echo "Database values updated successfully.\n";
