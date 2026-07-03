<?php
// Script untuk membuat symlink di cPanel
$targetFolder = $_SERVER['DOCUMENT_ROOT'].'/../helpdesk-core/storage/app/public';
$linkFolder = $_SERVER['DOCUMENT_ROOT'].'/storage';

if(file_exists($linkFolder)){
    echo "Symlink sudah ada! Harap hapus folder/file 'storage' di public_html jika ingin membuat ulang.";
} else {
    // Pastikan path target benar-benar ada
    if (!file_exists($targetFolder)) {
        echo "Error: Folder target ($targetFolder) tidak ditemukan! Pastikan Anda sudah mengupload folder 'storage'.";
    } else {
        if(symlink($targetFolder, $linkFolder)){
            echo "Symlink BERHASIL dibuat!<br>";
            echo "<b>PENTING:</b> Segera hapus file symlink.php ini demi keamanan.";
        } else {
            echo "Gagal membuat symlink. Coba buat melalui terminal cPanel: <code>ln -s ../helpdesk-core/storage/app/public storage</code>";
        }
    }
}
?>
