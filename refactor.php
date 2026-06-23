<?php

$directories = [
    'app/Http/Controllers',
    'app/Models',
    'database/seeders',
    'resources/js/Pages/Helpdesk',
    '.'
];

$extensions = ['php', 'tsx', 'csv', 'ts'];

$filesToProcess = [];

function scanDirRecursive($dir, $extensions, &$files) {
    if (!is_dir($dir)) return;
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
    foreach ($iterator as $file) {
        if ($file->isFile()) {
            $ext = pathinfo($file->getFilename(), PATHINFO_EXTENSION);
            if (in_array($ext, $extensions)) {
                $files[] = $file->getPathname();
            }
        }
    }
}

foreach ($directories as $dir) {
    if ($dir === '.') {
        $filesToProcess[] = 'template_unit.csv';
    } else {
        scanDirRecursive($dir, $extensions, $filesToProcess);
    }
}

$filesToProcess = array_unique($filesToProcess);

$totalReplaced = 0;
foreach ($filesToProcess as $file) {
    $content = file_get_contents($file);
    if ($content === false) continue;
    
    $original = $content;
    
    // Replace DB column / code references
    $content = str_replace('jenis_dart', 'jenis', $content);
    // Replace text labels
    $content = str_replace('Jenis DART', 'Jenis', $content);
    $content = str_replace('Jenis DART *', 'Jenis *', $content);
    $content = str_replace('JENIS DART', 'JENIS', $content);
    
    // Specifically for the seeders and some old values
    // We'll manually update UnitModal and StafUnitModal later.

    if ($original !== $content) {
        file_put_contents($file, $content);
        echo "Updated: $file\n";
        $totalReplaced++;
    }
}

echo "Total files updated: $totalReplaced\n";

