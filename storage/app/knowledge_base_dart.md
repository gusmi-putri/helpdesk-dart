# PANDUAN PENANGANAN KENDALA DART (KNOWLEDGE BASE)

Ini adalah file sumber pengetahuan (knowledge base) untuk AI Gemini. 
Silakan BUKA file PDF "User Manual_Alkap DART Rev1.pdf" Anda, lalu COPY paste bagian-bagian penting mengenai **"Troubleshooting"** atau **"Penanganan Masalah"** ke file ini.

Semakin detail isi file ini, semakin akurat jawaban AI saat membantu Pelapor atau Teknisi.

---
## CONTOH FORMAT (Silakan hapus dan ganti dengan isi asli dari PDF):

### KENDALA: Target tidak mau naik/turun (Macet)
*   **Penyebab Kemungkinan:**
    *   Kabel power tidak terhubung dengan baik ke Motor.
    *   Baterai drop di bawah tegangan minimum.
    *   Gear motor kotor atau tersumbat kotoran.
*   **Langkah Pengecekan Awal (Aman untuk Pelapor):**
    1. Pastikan saklar power utama dalam keadaan ON.
    2. Periksa apakah lampu indikator baterai menyala merah atau hijau.
    3. Cek secara visual apakah ada batu/kotoran yang mengganjal mekanisme lipat. JANGAN dibongkar.
*   **Tindakan Lanjutan (Hanya Teknisi):**
    *   Bongkar housing motor dan bersihkan gear.
    *   Cek tegangan output baterai dengan multitester (Harus di atas 11.5V).

### KENDALA: Sensor tidak mendeteksi tembakan
*   **Penyebab Kemungkinan:** ...
*   **Langkah Pengecekan Awal:** ...

---
(Tambahkan isi PDF Anda di bawah ini)

### KENDALA: Perangkat DART mati total (Tidak ada reaksi sama sekali)
*   **Penyebab Kemungkinan:**
    *   Tidak ada aliran daya dari sumber listrik.
    *   Kabel power AC terlepas atau tidak terpasang dengan baik.
*   **Langkah Pengecekan Awal (Aman untuk Pelapor):**
    1. Pastikan steker sudah terhubung ke stop kontak sumber listrik PLN.
    2. Pastikan MAIN POWER SWITCH sudah ditekan ke posisi ON.
    3. Periksa secara visual apakah lampu POWER INDIKATOR menyala.
*   **Tindakan Lanjutan (Hanya Teknisi):**
    *   Cek tegangan pada sumber arus listrik PLN 220 VAC untuk memastikan ada arus yang masuk.

### KENDALA: Lampu indikator menyala tetapi alat tidak bereaksi
*   **Penyebab Kemungkinan:**
    *   Terdapat sikring (fuse) arus searah (DC) yang terputus akibat lonjakan listrik atau korsleting.
*   **Langkah Pengecekan Awal (Aman untuk Pelapor):**
    1. Coba tekan tombol TEST pada panel. Jika tetap diam, hentikan pengoperasian.
    2. Matikan MAIN POWER SWITCH (posisi OFF) untuk mencegah kerusakan lanjutan.
*   **Tindakan Lanjutan (Hanya Teknisi):**
    *   Cek fuse sikring DC.
    *   Apabila putus, ganti dengan yang baru dengan ampere yang sama yaitu 15 ampere.

### KENDALA: Posisi lesan tembak tidak presisi (Terlalu maju/UP atau mundur/DOWN)
*   **Penyebab Kemungkinan:**
    *   Sensor pembatas gerak (Limit Switch) bergeser atau tidak terkalibrasi dengan baik.
*   **Langkah Pengecekan Awal (Aman untuk Pelapor):**
    1. Periksa sekitar alat secara visual, pastikan tidak ada benda asing/kotoran yang mengganjal mekanisme lesan.
    2. JANGAN mencoba membengkokkan atau memaksa lengan mekanik secara manual.
*   **Tindakan Lanjutan (Hanya Teknisi):**
    *   Bongkar DART.
    *   Atur ulang Sensor (Limit Switch) yang berada pada CAM lengan hingga mendapatkan posisi yang presisi.

### KENDALA: Lesan tembak bergerak naik turun sendiri tanpa dioperasikan
*   **Penyebab Kemungkinan:**
    *   Terdapat noise, sambungan kendur, atau korsleting pada jalur kabel saluran (kabel kendali).
*   **Langkah Pengecekan Awal (Aman untuk Pelapor):**
    1. Segera cabut konektor TRIGGER pada perangkat untuk menghentikan pergerakan liar.
    2. Amankan area di sekitar target tembak.
*   **Tindakan Lanjutan (Hanya Teknisi):**
    *   Cek kabel saluran dengan menggunakan avometer.
    *   Identifikasi untuk mengetahui apakah terdapat sambungan atau kabel yang terputus atau tidak.

### KENDALA: Lampu indikator menyala, FUSE aman, tetapi tidak mau bereaksi
*   **Penyebab Kemungkinan:**
    *   Terdapat kelonggaran atau masalah pada sirkuit relai (relay) penggerak.
*   **Langkah Pengecekan Awal (Aman untuk Pelapor):**
    1. Pastikan tidak ada indikasi bau hangus dari dalam boks.
    2. Matikan perangkat dan segera hubungi teknisi.
*   **Tindakan Lanjutan (Hanya Teknisi):**
    *   Buka cover dan tutup perangkat DART.
    *   Cek kondisi fisik dan soket pada Relay MY4NJ.

### KENDALA: Mesin merespon/bergerak sendiri saat kabel konektor SKE dipasang
*   **Penyebab Kemungkinan:**
    *   Penyambungan konektor dilakukan saat arus listrik masih mengalir (hot-plugging) yang memicu sinyal palsu.
*   **Langkah Pengecekan Awal (Aman untuk Pelapor):**
    1. Segera matikan alat.
    2. Lepaskan konektornya.
*   **Tindakan Lanjutan (Hanya Teknisi):**
    *   Pastikan untuk selalu mematikan power sebelum menyambungkan atau memutuskan kabel.

### KENDALA: Tercium bau mengganggu/hangus dari perangkat
*   **Penyebab Kemungkinan:**
    *   Terjadi overheating (panas berlebih) pada komponen kelistrikan.
    *   Kapasitor meledak akibat kesalahan polaritas listrik.
*   **Langkah Pengecekan Awal (Aman untuk Pelapor):**
    1. Matikan power sebelum menyambungkan atau memutuskan kabel.
    2. Jika tercium bau yang mengganggu, pindahkan alat ke tempat terbuka. Jauhkan personel dari perangkat.
*   **Tindakan Lanjutan (Hanya Teknisi):**
    *   Lakukan investigasi perangkat keras. Jika ada kapasitor elektrolit yang meledak/rusak, pastikan untuk mengganti dan menyambungkannya dengan polaritas yang benar: positif ke positif dan negatif ke negatif.
    *   Apabila terdapat kerusakan dan tidak dapat memperbaiki secara mandiri (Pemeliharaan Tingkat Satuan), agar melaporkan kepada satuan pemeliharaan di areal service nya (Satuan Pemeliharaan Tingkat Daerah/Hubdam atau Tingkat Pusat/Bengpushub Pushubad).

### KENDALA: Target/Lesan tidak mendeteksi tembakan (Tidak ada respon saat tertembak)
*   **Penyebab Kemungkinan:**
    *   Sensor getar/akustik rusak, kabel sensor putus, atau sensitivitas sensor terlalu rendah.
*   **Langkah Pengecekan Awal (Aman untuk Pelapor):**
    1. Pastikan kabel sensor tertancap sempurna pada soketnya.
    2. Coba ketuk lesan secara manual untuk melihat apakah ada respon mekanik/indikator.
*   **Tindakan Lanjutan (Hanya Teknisi):**
    *   Kalibrasi ulang sensitivitas sensor pada panel kontrol/modul sensor.
    *   Cek kontinuitas kabel sensor dengan avometer, ganti sensor jika dipastikan rusak.

### KENDALA: Pergerakan mekanik lengan target kasar, tersendat, atau berderit
*   **Penyebab Kemungkinan:**
    *   Kurangnya pelumasan pada engsel/gear.
    *   Ada kotoran, pasir, atau karat menumpuk, atau *bearing* sudah aus.
*   **Langkah Pengecekan Awal (Aman untuk Pelapor):**
    1. Bersihkan area sekitar engsel mekanik dari debu, batu, atau lumpur.
*   **Tindakan Lanjutan (Hanya Teknisi):**
    *   Berikan pelumas (grease/gemuk) pada roda gigi dan engsel yang bergerak.
    *   Bongkar dan ganti komponen *bearing* atau *gear* jika terlihat aus parah.

### KENDALA: Suara motor mendengung tetapi lengan target tidak bergerak
*   **Penyebab Kemungkinan:**
    *   Motor tertahan oleh benda keras (macet total).
    *   Tegangan listrik *drop*, atau kapasitor motor (pada tipe motor AC) lemah/rusak.
*   **Langkah Pengecekan Awal (Aman untuk Pelapor):**
    1. Segera matikan alat untuk mencegah gulungan motor terbakar.
    2. Pastikan tidak ada objek keras yang menghalangi pergerakan lengan.
*   **Tindakan Lanjutan (Hanya Teknisi):**
    *   Cek voltase yang masuk ke motor.
    *   Lakukan pengecekan nilai kapasitansi pada kapasitor motor. Ganti kapasitor jika nilainya menurun drastis.

### KENDALA: Komunikasi / Koneksi ke ruang kendali terputus (Jika menggunakan sistem kontrol jarak jauh)
*   **Penyebab Kemungkinan:**
    *   Kabel data (LAN/Serial) terputus, pin konektor bengkok/kotor.
    *   Modul komunikasi atau *transceiver* rusak.
*   **Langkah Pengecekan Awal (Aman untuk Pelapor):**
    1. Periksa kerapatan colokan kabel data dari DART ke sistem kendali.
    2. Pastikan tidak ada kabel yang terjepit atau tertarik kencang.
*   **Tindakan Lanjutan (Hanya Teknisi):**
    *   Lakukan pengetesan kontinuitas pada kabel data menggunakan LAN *tester* atau *multimeter*.
    *   Cek *setting* IP atau *Baud rate* pada mikrokontroler jika menggunakan sistem digital.

### KENDALA: Motor penggerak (Dinamo) terasa sangat panas (Overheat)
*   **Penyebab Kemungkinan:**
    *   Alat digunakan terlalu lama tanpa jeda (melebihi *duty cycle*).
    *   Sirkulasi udara pada boks tertutup rapat, atau beban mekanik kelewat berat.
*   **Langkah Pengecekan Awal (Aman untuk Pelapor):**
    1. Matikan perangkat dan biarkan motor mendingin selama 15-30 menit.
    2. Jauhkan dari paparan sinar matahari langsung jika memungkinkan.
*   **Tindakan Lanjutan (Hanya Teknisi):**
    *   Periksa apakah ada pergeseran/kebengkokan mekanik yang membuat putaran motor menjadi berat.
    *   Pastikan kipas pendingin (*cooling fan*) di dalam boks berfungsi dengan baik.

### KENDALA: Bodi perangkat / Casing mengalami korosi atau karatan
*   **Penyebab Kemungkinan:**
    *   Faktor cuaca, kelembapan tinggi, atau lapisan cat anti-karat terkelupas.
*   **Langkah Pengecekan Awal (Aman untuk Pelapor):**
    1. Hindari menempatkan perangkat di area yang terendam genangan air.
    2. Bersihkan bodi perangkat dari tanah/lumpur setelah pemakaian.
*   **Tindakan Lanjutan (Hanya Teknisi):**
    *   Amplas area yang berkarat, bersihkan, lalu lapisi kembali dengan cat semprot anti-karat (*rust-proof paint*).

### KENDALA: Tombol-tombol pada panel kontrol terasa keras, macet, atau tidak merespon
*   **Penyebab Kemungkinan:**
    *   Penumpukan debu, tanah, atau kotoran di sela-sela tombol.
    *   *Push button switch* di bagian dalam sudah aus/rusak.
*   **Langkah Pengecekan Awal (Aman untuk Pelapor):**
    1. Bersihkan area tombol dengan kuas halus. JANGAN disemprot air.
*   **Tindakan Lanjutan (Hanya Teknisi):**
    *   Bongkar panel kontrol, semprot saklar dengan *Contact Cleaner*.
    *   Jika masih macet, ganti komponen *push button* dengan yang baru.

### KENDALA: Konektor kabel aus, longgar, atau pin bengkok/patah
*   **Penyebab Kemungkinan:**
    *   Proses bongkar-pasang kabel dilakukan dengan paksa atau tidak sejajar (miring).
    *   Penumpukan kerak oksida akibat pemakaian luar ruangan.
*   **Langkah Pengecekan Awal (Aman untuk Pelapor):**
    1. Jangan memaksa menancapkan konektor jika terasa terganjal.
*   **Tindakan Lanjutan (Hanya Teknisi):**
    *   Luruskan pin yang bengkok secara perlahan menggunakan tang lancip.
    *   Jika pin patah, potong kabel dan ganti dengan kepala konektor (Soket/Plug) yang baru.

### KENDALA: Terdapat air embun atau genangan air di dalam boks kontrol (Water Ingress)
*   **Penyebab Kemungkinan:**
    *   Karet pelindung (Seal) boks retak atau penutup tidak dikunci rapat.
    *   Terkena hujan lebat saat penutup terbuka.
*   **Langkah Pengecekan Awal (Aman untuk Pelapor):**
    1. Segera putus aliran listrik dari sumber!
    2. Jangan operasikan perangkat dalam keadaan basah.
*   **Tindakan Lanjutan (Hanya Teknisi):**
    *   Buka boks, keringkan komponen elektronik menggunakan *hairdryer* bersuhu rendah atau *blower*.
    *   Ganti karet *seal* pintu boks dan tambahkan *Silica Gel* untuk menyerap kelembapan sisa.

### KENDALA: Terdengar suara "Cetak-cetak" berulang dari dalam boks tanpa pergerakan mekanik
*   **Penyebab Kemungkinan:**
    *   Relay bekerja (mengontak) tetapi tidak ada arus daya besar yang mengalir ke motor (kabel power motor putus).
    *   Tegangan suplai tidak stabil sehingga relay "chattering".
*   **Langkah Pengecekan Awal (Aman untuk Pelapor):**
    1. Matikan saklar utama dan hentikan penggunaan.
*   **Tindakan Lanjutan (Hanya Teknisi):**
    *   Periksa jalur kabel dari output relay menuju motor.
    *   Cek kondisi kontak *platina* di dalam relay, jika gosong/hitam ganti relay tersebut.

### KENDALA: Respon target melambat atau ada jeda waktu (delay) saat diperintahkan
*   **Penyebab Kemungkinan:**
    *   Interferensi sinyal kendali, memori mikrokontroler penuh, atau tegangan suplai ngedrop saat beban puncak.
*   **Langkah Pengecekan Awal (Aman untuk Pelapor):**
    1. Matikan alat (*Restart/Reboot*) selama 1 menit, lalu nyalakan kembali.
*   **Tindakan Lanjutan (Hanya Teknisi):**
    *   Periksa kestabilan *Power Supply*.
    *   Cek jalur kabel komunikasi apakah melintang berdekatan dengan jalur kabel tegangan tinggi PLN (bisa menimbulkan induksi EMF).
