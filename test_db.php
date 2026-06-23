<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '', [PDO::ATTR_TIMEOUT => 2]);
    echo "Connected successfully to 127.0.0.1\n";
} catch(Exception $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
