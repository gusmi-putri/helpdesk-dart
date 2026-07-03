<?php

function testParseFile($filePath) {
    echo "=== TESTING FILE: $filePath ===\n";
    $handle = fopen($filePath, "r");
    if (!$handle) {
        echo "Gagal membuka file.\n";
        return;
    }

    // Delimiter detection
    $firstLine = fgets($handle);
    rewind($handle);
    $delimiter = ",";
    if (strpos($firstLine, ';') !== false && strpos($firstLine, ',') === false) {
        $delimiter = ";";
    } elseif (strpos($firstLine, ';') !== false && strpos($firstLine, ',') !== false) {
        $commaCount = substr_count($firstLine, ',');
        $semicolonCount = substr_count($firstLine, ';');
        if ($semicolonCount > $commaCount) {
            $delimiter = ";";
        }
    }

    echo "Detected delimiter: '$delimiter'\n";

    $header = true;
    $rows = [];
    while ($row = fgetcsv($handle, 1000, $delimiter)) {
        if ($header) { $header = false; continue; }
        if (count($row) < 4) continue;

        $nomor_seri = trim($row[0]);
        if (empty($nomor_seri) || str_starts_with($nomor_seri, '#')) continue;

        $jenis_raw = trim($row[1]);
        $asal_satuan = trim($row[2]);
        $status_unit_raw = isset($row[3]) ? trim($row[3]) : 'Beroperasi';

        // Check case-insensitive valid jenis
        $validJenis = ['DART STD', 'DART STK', 'DART Portabel - Swing', 'DART Portabel - Pop', 'DART Portabel - Flip', 'DART Marathon Target', 'Moving Target'];
        $jenis = 'DART STD';
        foreach ($validJenis as $vj) {
            if (strcasecmp($jenis_raw, $vj) === 0) {
                $jenis = $vj;
                break;
            }
        }

        // Check status mapping
        $statusMap = [
            'siap ops' => 'Beroperasi',
            'beroperasi' => 'Beroperasi',
            'rusak' => 'Rusak',
            'perbaikan' => 'Perbaikan',
            'nonaktif' => 'Nonaktif',
        ];
        $status_unit_lower = strtolower($status_unit_raw);
        $status_unit = isset($statusMap[$status_unit_lower]) ? $statusMap[$status_unit_lower] : 'Beroperasi';

        $rows[] = [
            'nomor_seri' => $nomor_seri,
            'jenis' => $jenis,
            'asal_satuan' => $asal_satuan,
            'status_unit' => $status_unit
        ];
    }

    fclose($handle);
    print_r($rows);
}

testParseFile('unit_import_test_baru.csv');
testParseFile('unit_import_test_semicolon.csv');
