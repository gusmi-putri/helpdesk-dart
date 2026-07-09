<?php
$host = 'localhost';
$port = '3306';
$user = 'root';
$pass = '';

echo "Mencoba koneksi ke $host:$port...\n";

try {
    $pdo = new PDO("mysql:host=$host;port=$port", $user, $pass);
    echo "✅ KONEKSI BERHASIL!\n";
    
    echo "\nDaftar Database yang ada:\n";
    $stmt = $pdo->query("SHOW DATABASES");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "- " . $row['Database'] . "\n";
    }
} catch (PDOException $e) {
    echo "❌ KONEKSI GAGAL!\n";
    echo "Pesan Error: " . $e->getMessage() . "\n";
    echo "Kode Error: " . $e->getCode() . "\n";
}
