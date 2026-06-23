<?php
try {
    $pdo = new PDO('mysql:host=localhost;port=3306', 'root', '', [PDO::ATTR_TIMEOUT => 2]);
    echo "Connected successfully to localhost\n";
} catch(Exception $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
