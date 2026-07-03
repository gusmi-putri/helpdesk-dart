<?php
// Script untuk membersihkan dan membuat cache konfigurasi di cPanel
// Ganti $corePath sesuai nama folder tempat Anda menaruh file inti Laravel
$corePath = __DIR__ . '/../helpdesk-core';

if (!file_exists($corePath . '/artisan')) {
    die("Error: File artisan tidak ditemukan. Pastikan path core ($corePath) sudah benar.");
}

echo "Memulai proses optimasi Laravel...<br><br>";

try {
    // Jalankan command artisan
    exec("php $corePath/artisan config:cache 2>&1", $output, $return_var);
    echo "<b>Config Cache:</b><br>" . implode("<br>", $output) . "<br><br>";
    $output = [];

    exec("php $corePath/artisan route:cache 2>&1", $output, $return_var);
    echo "<b>Route Cache:</b><br>" . implode("<br>", $output) . "<br><br>";
    $output = [];

    exec("php $corePath/artisan view:cache 2>&1", $output, $return_var);
    echo "<b>View Cache:</b><br>" . implode("<br>", $output) . "<br><br>";
    
    echo "<b>Selesai!</b><br>";
    echo "<b>PENTING:</b> Segera hapus file optimize.php ini demi keamanan.";
} catch (Exception $e) {
    echo "Terjadi kesalahan: " . $e->getMessage();
}
?>
