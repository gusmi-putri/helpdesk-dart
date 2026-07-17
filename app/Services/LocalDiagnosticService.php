<?php

namespace App\Services;

class LocalDiagnosticService
{
    /**
     * Aturan diagnostik berbasis kata kunci.
     * Setiap entri memiliki: keywords (trigger), causes (kemungkinan penyebab), steps (langkah awal).
     */
    protected array $rules = [
        [
            'keywords' => ['layar', 'display', 'screen', 'monitor', 'gambar', 'tampilan', 'blank', 'gelap', 'hitam', 'tidak muncul', 'putih', 'bergaris', 'baret', 'berbayang', 'buram', 'flicker', 'kedap-kedip', 'mati sebagian', 'lcd'],
            'topic'    => 'Masalah Layar / Display',
            'causes'   => [
                'Kabel data penghubung modul display longgar atau putus.',
                'Driver display/firmware pada unit DART mengalami kerusakan.',
                'Backlight layar terbakar akibat tegangan tidak stabil.',
                'Modul layar mengalami kerusakan fisik akibat benturan.',
            ],
            'steps' => [
                'Pastikan unit dalam kondisi **mati total** sebelum melakukan pemeriksaan.',
                'Periksa secara visual apakah ada **retakan atau kerusakan fisik** pada permukaan layar.',
                'Coba **restart/reboot ulang** unit DART menggunakan tombol power utama.',
                'Periksa apakah sumber daya (baterai/adaptor) berfungsi normal — indikator daya harus menyala.',
            ],
        ],
        [
            'keywords' => ['sensor', 'deteksi', 'tidak terdeteksi', 'laser', 'hit', 'tembakan', 'tidak merespons', 'tidak bereaksi', 'meleset', 'akurasi', 'ngaco', 'tidak kena', 'tidak peka', 'kalibrasi', 'macet', 'bidikan', 'delay', 'telat'],
            'topic'    => 'Masalah Sensor / Deteksi',
            'causes'   => [
                'Lensa sensor kotor terhalang debu, kotoran, atau kondensasi.',
                'Kalibrasi sensor sudah lama tidak dilakukan atau posisi offset.',
                'Komponen sensor terbakar akibat tegangan berlebih.',
                'Interferensi cahaya lingkungan yang terlalu terang (cahaya matahari langsung).',
            ],
            'steps' => [
                'Bersihkan lensa sensor menggunakan **kain microfiber kering** — jangan menggunakan cairan.',
                'Pastikan area sekitar target **tidak terkena cahaya matahari langsung** saat pengujian.',
                'Lakukan **reset kalibrasi** menggunakan prosedur di halaman 32 buku panduan DART.',
                'Uji sensor dengan **jarak minimum (3 meter)** untuk memverifikasi respons dasar.',
            ],
        ],
        [
            'keywords' => ['daya', 'power', 'mati', 'tidak nyala', 'mati total', 'baterai', 'batre', 'charger', 'casan', 'adaptor', 'listrik', 'tegangan', 'drop', 'bocor', 'kembung', 'panas', 'overheat', 'konslet', 'kabel putus', 'restart terus', 'mati sendiri'],
            'topic'    => 'Masalah Catu Daya / Power',
            'causes'   => [
                'Baterai habis atau mengalami kerusakan sel (kembung/bocor).',
                'Konektor adaptor DC longgar atau korosi.',
                'Fuse/sekring internal putus akibat lonjakan tegangan.',
                'Modul regulator tegangan internal mengalami kerusakan.',
            ],
            'steps' => [
                '**Periksa kabel adaptor** dari ujung ke ujung — pastikan tidak ada keretakan atau sobekan.',
                'Coba gunakan **adaptor/sumber daya cadangan** yang terverifikasi.',
                '**Jangan membuka** casing unit — pemeriksaan internal harus oleh Teknisi bersertifikat.',
                'Catat **kode tegangan** pada label unit dan bandingkan dengan output adaptor yang digunakan.',
            ],
        ],
        [
            'keywords' => ['koneksi', 'jaringan', 'wifi', 'bluetooth', 'komunikasi', 'sinkronisasi', 'sync', 'link', 'putus', 'disconnect', 'sinyal', 'lemah', 'lemot', 'pairing', 'tidak konek', 'hilang sinyal', 'offline', 'delay ping', 'lag'],
            'topic'    => 'Masalah Koneksi / Komunikasi',
            'causes'   => [
                'Modul WiFi/Bluetooth mengalami gangguan firmware.',
                'Interferensi frekuensi radio di area latihan.',
                'Antena internal longgar atau terputus akibat getaran.',
                'Pengaturan jaringan pada unit tidak sesuai dengan konfigurasi server.',
            ],
            'steps' => [
                'Lakukan **restart unit** dan coba sambungkan kembali ke jaringan.',
                'Pastikan **jarak unit ke access point** tidak melebihi 30 meter.',
                'Periksa apakah unit lain di lokasi yang sama **mengalami masalah serupa** — jika ya, masalah ada di jaringan.',
                'Catat **SSID dan channel WiFi** yang digunakan untuk dilaporkan ke Teknisi.',
            ],
        ],
        [
            'keywords' => ['fisik', 'rusak', 'retak', 'pecah', 'patah', 'bengkok', 'penyok', 'jatuh', 'tertimpa', 'bentur', 'hancur', 'lepas', 'kendur', 'koclak', 'casing', 'bodi', 'body', 'bolong', 'sobek', 'terbakar', 'kabel luar', 'tergores'],
            'topic'    => 'Kerusakan Fisik / Mekanikal',
            'causes'   => [
                'Benturan keras saat transportasi atau saat penggunaan di lapangan.',
                'Penyimpanan tidak sesuai standar (ditumpuk, tertekan).',
                'Material casing mengalami kelelahan (fatigue) akibat penggunaan intensif.',
            ],
            'steps' => [
                '**Dokumentasikan kerusakan** dengan foto dari minimal 3 sudut — depan, samping, dan area kerusakan.',
                '**Hentikan penggunaan unit** segera untuk mencegah kerusakan sekunder.',
                'Simpan unit di **tempat yang aman dan tidak terkena beban** sampai Teknisi tiba.',
                '**Jangan mencoba memperbaiki sendiri** — kerusakan fisik memerlukan penggantian suku cadang resmi.',
            ],
        ],
        [
            'keywords' => ['software', 'error', 'sistem', 'aplikasi', 'program', 'update', 'hang', 'freeze', 'macet', 'crash', 'bug', 'glitch', 'force close', 'keluar sendiri', 'stuck', 'loading', 'booting', 'bootloop', 'firmware', 'os', 'reset'],
            'topic'    => 'Masalah Perangkat Lunak / Firmware',
            'causes'   => [
                'Firmware unit mengalami korupsi atau gagal update.',
                'Memori internal penuh atau mengalami bad sector.',
                'Konflik antara versi software kontroller dengan firmware unit.',
            ],
            'steps' => [
                'Coba lakukan **factory reset** menggunakan tombol reset di bagian belakang unit (hold 10 detik).',
                'Catat **versi firmware** unit (tersedia di menu Settings > About).',
                'Pastikan **koneksi stabil ke server** sebelum mencoba proses update ulang.',
                '**Jangan matikan unit** di tengah proses update — ini dapat memperparah kerusakan firmware.',
            ],
        ],
        [
            'keywords' => ['suara', 'bunyi', 'speaker', 'alarm', 'audio', 'beep', 'bising', 'nyaring', 'pelan', 'pecah', 'kresek', 'kemeresek', 'bisu', 'mute', 'sirine', 'mendengung'],
            'topic'    => 'Masalah Audio / Indikator Suara',
            'causes'   => [
                'Speaker internal mengalami kerusakan akibat kelembaban atau benturan.',
                'Pengaturan volume atau mode diam aktif secara tidak sengaja.',
                'Kabel speaker internal longgar dari board utama.',
            ],
            'steps' => [
                'Periksa **pengaturan volume** di menu unit — pastikan tidak dalam mode silent.',
                'Coba **restart unit** untuk mereset konfigurasi audio.',
                'Uji apakah alarm visual (LED indikator) masih berfungsi normal.',
            ],
        ],
    ];

    /**
     * Saran berdasarkan tingkat kerusakan.
     */
    protected array $levelAdvice = [
        'Ringan' => [
            'label' => '🟡 KENDALA RINGAN',
            'summary' => 'Berdasarkan klasifikasi **Ringan**, unit kemungkinan masih dapat digunakan secara terbatas. Periksa langkah awal di bawah sebelum menghentikan operasi penuh.',
            'alert' => '',
        ],
        'Sedang' => [
            'label' => '🟠 KENDALA SEDANG',
            'summary' => 'Berdasarkan klasifikasi **Sedang**, unit memerlukan pemeriksaan teknis segera. **Hentikan penggunaan operasional** unit ini hingga teknisi melakukan evaluasi.',
            'alert' => '> ⚠️ Disarankan untuk **tidak memaksakan penggunaan** unit DART hingga perbaikan dilakukan, guna mencegah kerusakan yang lebih luas.',
        ],
        'Parah' => [
            'label' => '🔴 KENDALA PARAH / KRITIS',
            'summary' => 'Berdasarkan klasifikasi **Parah**, unit berada dalam kondisi kritis. **Hentikan operasi segera** dan amankan unit.',
            'alert' => '> 🚨 **PERINGATAN:** Jangan mencoba memperbaiki sendiri. Jangan menyalakan ulang unit jika ada indikasi asap, bau terbakar, atau kerusakan parah. Hubungi Teknisi dan laporkan kepada atasan.',
        ],
    ];

    /**
     * Analisis lokal berdasarkan deskripsi dan tingkat kerusakan.
     */
    public function getDiagnosticAdvice(string $description, string $level, string $unitName): string
    {
        $descLower = mb_strtolower($description);

        // Cari aturan yang cocok berdasarkan kata kunci
        $matchedRule = null;
        $highestScore = 0;

        foreach ($this->rules as $rule) {
            $score = 0;
            foreach ($rule['keywords'] as $keyword) {
                if (str_contains($descLower, $keyword)) {
                    $score++;
                }
            }
            if ($score > $highestScore) {
                $highestScore = $score;
                $matchedRule = $rule;
            }
        }

        // Ambil info level
        $levelInfo = $this->levelAdvice[$level] ?? $this->levelAdvice['Sedang'];

        // Header
        $output = "## {$levelInfo['label']}\n\n";
        $output .= "**Unit:** `{$unitName}` | **Tingkat:** {$level}\n\n";
        $output .= "{$levelInfo['summary']}\n\n";

        if (!empty($levelInfo['alert'])) {
            $output .= "{$levelInfo['alert']}\n\n";
        }

        $output .= "---\n\n";

        if ($matchedRule && $highestScore > 0) {
            // Ada kata kunci yang cocok
            $output .= "### 🔍 Analisis: {$matchedRule['topic']}\n\n";
            $output .= "**Kemungkinan Penyebab:**\n";
            foreach ($matchedRule['causes'] as $cause) {
                $output .= "- {$cause}\n";
            }
            $output .= "\n**Langkah Pemeriksaan Awal (oleh Pelapor):**\n";
            foreach ($matchedRule['steps'] as $i => $step) {
                $output .= ($i + 1) . ". {$step}\n";
            }
        } else {
            // Tidak ada kata kunci cocok — berikan saran umum
            $output .= "### 🔍 Analisis Umum\n\n";
            $output .= "Deskripsi kendala tidak cocok dengan pola kerusakan yang tersimpan dalam basis data. ";
            $output .= "Teknisi akan melakukan pemeriksaan manual secara langsung.\n\n";
            $output .= "**Langkah Umum yang Dapat Dilakukan:**\n";
            $output .= "1. **Dokumentasikan kondisi unit** dengan foto/video sebelum dipindahkan.\n";
            $output .= "2. **Hentikan penggunaan** unit yang bermasalah sampai Teknisi tiba.\n";
            $output .= "3. **Catat waktu dan kondisi** saat masalah pertama kali muncul.\n";
            $output .= "4. **Jangan mencoba memperbaiki sendiri** — serahkan kepada Teknisi bersertifikat.\n";
        }

        $output .= "\n---\n";
        $output .= "_Analisis ini dihasilkan secara **lokal** oleh sistem SISFO DART berdasarkan basis pengetahuan teknis unit DART. Teknisi terlatih akan melakukan verifikasi langsung._";

        return $output;
    }
}
