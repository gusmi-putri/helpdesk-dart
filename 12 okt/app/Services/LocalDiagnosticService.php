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
            'keywords' => ['charger', 'casan', 'cas', 'accu', 'aki', 'pengisian', 'tidak mengisi', 'tidak ngecas', 'indikator tidak menyala', 'kabel power', 'steker', 'fuse ac', 'saklar dc', 'konektor aki', 'berkarat', 'karat', 'drop', 'terputus-putus'],
            'topic'    => 'Masalah Charger / Pengisian Accu',
            'causes'   => [
                'Kabel power AC putus, steker longgar, atau isolasi kabel terkelupas.',
                'Fuse AC 2 ampere putus akibat arus lebih (overcurrent) atau hubungan singkat pada sisi primer.',
                'Konektor atau kabel menuju aki longgar atau berkarat, menyebabkan pengisian terputus-putus dan tegangan turun.',
                'Saklar DC rusak atau kontaknya memiliki resistansi tinggi, sehingga charger terlihat normal namun aki tidak terisi.',
            ],
            'steps' => [
                '**Periksa kabel power AC** dari ujung ke ujung — ukur kontinuitas kabel dan tegangan AC pada ujung kabel.',
                '**Periksa fuse AC 2A** secara fisik dan ukur kontinuitasnya; ganti sesuai rating yang ditentukan dan **jangan melakukan bypass fuse**.',
                '**Periksa konektor dan kabel menuju aki** dengan uji beban sambil mengukur tegangan; bersihkan konektor yang berkarat atau ganti kabel yang rusak.',
                '**Ukur penurunan tegangan pada saklar DC** — jika terdapat kerusakan atau resistansi tinggi, saklar DC perlu diganti.',
            ],
        ],
        [
            'keywords' => ['limit switch', 'lesan', 'naik turun', 'timbul tenggelam', 'bergerak ke kanan', 'bergerak ke kiri', 'autoplay', 'skip', 'posisi lengan', 'kanopi', 'cam', 'pandangan petembak', 'bergerak sendiri', 'tidak berhenti', 'bergerak otomatis'],
            'topic'    => 'Masalah Limit Switch / Mekanisme Gerak Sasaran',
            'causes'   => [
                'Posisi lengan limit switch tidak sesuai dengan pandangan petembak.',
                'Lesan tembak bergerak otomatis padahal mode autoplay tidak aktif — indikasi ada tombol remote control yang menyala atau tertekan.',
                'Mekanisme skip tidak bergerak saat autoplay diaktifkan karena kabel limit terlepas.',
                'Limit switch macet atau tidak berfungsi dengan baik.',
            ],
            'steps' => [
                '**Setel ulang posisi lengan limit switch** melalui cam limit switch — buka kanopi dan penutup DART, lalu longgarkan/kencangkan pengikat menggunakan kunci limit sesuai kebutuhan.',
                '**Periksa remote control** dan pastikan tidak ada tombol dalam kondisi menyala atau tertekan saat autoplay tidak aktif.',
                '**Periksa kabel limit** pada mekanisme skip — pasang kembali apabila terlepas hingga terhubung dengan baik.',
                '**Ganti limit switch** apabila ditemukan dalam kondisi macet atau tidak berfungsi dengan baik.',
            ],
        ],
        [
            'keywords' => ['fuse', 'sekring', 'tidak menyala', 'dart tidak hidup', 'putus', 'tidak hidup sama sekali'],
            'topic'    => 'Masalah Fuse / Sekring Utama Unit',
            'causes'   => [
                'Fuse utama unit putus akibat arus lebih atau hubungan singkat pada sistem kelistrikan unit.',
            ],
            'steps' => [
                '**Periksa fuse utama** pada unit — jika dalam kondisi putus, lakukan penggantian dengan fuse baru sesuai spesifikasi unit.',
                '**Jangan melakukan bypass fuse** dengan kawat atau bahan lain dalam kondisi apa pun — risiko korsleting/kebakaran.',
                'Jika fuse baru kembali putus setelah dipasang, **hentikan pengoperasian** dan laporkan sebagai indikasi korsleting pada sistem internal.',
            ],
        ],
        [
            'keywords' => ['motor', 'motor dc', 'konektor motor', 'korosi', 'rantai', 'sprocket', 'kendur', 'kencang', 'bunyi kasar', 'tersendat', 'roda', 'ban', 'selip', 'aus', 'licin'],
            'topic'    => 'Masalah Motor Penggerak, Rantai & Roda',
            'causes'   => [
                'Konektor motor terlepas atau mengalami korosi.',
                'Tegangan rantai terlalu kencang atau terlalu kendur, atau rantai tidak sejajar dengan sprocket.',
                'Ban/roda aus atau licin sehingga motor tetap berputar namun terjadi selip.',
            ],
            'steps' => [
                '**Periksa konektor motor** — jika ditemukan kotoran atau korosi, bersihkan menggunakan contact cleaner hingga koneksi kembali normal.',
                '**Periksa ketegangan rantai** dan kesejajarannya dengan sprocket; setel ulang ketegangan rantai dan beri pelumasan agar sistem penggerak bekerja optimal.',
                '**Periksa kondisi ban/roda** — bersihkan atau ganti ban yang sudah aus, serta sesuaikan tekanan/grip agar pergerakan alat kembali normal.',
            ],
        ],
        [
            'keywords' => ['tidak ada reaksi', 'tidak merespons sama sekali', 'tegangan rendah', 'di bawah 10 volt', 'lemah total', 'tidak bereaksi'],
            'topic'    => 'Masalah Tegangan Aki Rendah',
            'causes'   => [
                'Tegangan aki berada di bawah 10 volt sehingga perangkat tidak menunjukkan reaksi sama sekali.',
            ],
            'steps' => [
                '**Ukur tegangan aki** menggunakan multimeter.',
                'Apabila tegangan berada **di bawah 10 volt**, lakukan pengisian daya aki terlebih dahulu sebelum perangkat dioperasikan kembali.',
            ],
        ],
        [
            'keywords' => ['remote', 'remote control', 'alkap bergerak sendiri', 'sistem kendali', 'tidak merespon remote', 'kendali jarak jauh'],
            'topic'    => 'Masalah Remote Control / Sistem Kendali',
            'causes'   => [
                'Mode autoplay belum dimatikan secara manual, sehingga alat bergerak sendiri meski tombol remote belum ditekan.',
                'Gangguan pada sistem kendali internal Remote Control — seluruh sistem ini terintegrasi dan bersifat vital.',
            ],
            'steps' => [
                '**Pastikan autoplay dimatikan secara manual**, lalu tekan tombol pada remote control untuk mengendalikan alat sesuai kebutuhan.',
                'Jika gangguan tetap terjadi, **jangan membongkar unit Remote Control** — tidak ada komponen di dalamnya yang dapat diperbaiki secara mandiri oleh pengguna.',
                '**Serahkan penanganan kepada Teknisi** atau bawa unit kembali ke Bengpuskomlek untuk pemeriksaan lebih lanjut.',
            ],
        ],
        [
            'keywords' => ['fisik', 'rusak', 'retak', 'pecah', 'patah', 'bengkok', 'penyok', 'jatuh', 'tertimpa', 'bentur', 'hancur', 'lepas', 'koclak', 'casing', 'bodi', 'body', 'bolong', 'sobek', 'terbakar', 'kabel luar', 'tergores'],
            'topic'    => 'Kerusakan Fisik / Mekanikal',
            'causes'   => [
                'Benturan keras saat transportasi atau saat penggunaan di lapangan.',
                'Penyimpanan tidak sesuai standar (ditumpuk, tertekan, atau dibiarkan di area terbuka).',
                'Material casing mengalami kelelahan (fatigue) akibat penggunaan intensif.',
            ],
            'steps' => [
                '**Dokumentasikan kerusakan** dengan foto dari minimal 3 sudut — depan, samping, dan area kerusakan.',
                '**Hentikan penggunaan unit** segera untuk mencegah kerusakan sekunder.',
                'Simpan unit di **tempat yang aman dan tidak terkena beban** sampai Teknisi tiba.',
                '**Jangan mencoba memperbaiki sendiri** — kerusakan fisik memerlukan penggantian suku cadang resmi.',
            ],
        ],
    ];

    /**
     * Spesifikasi fuse utama per jenis unit, sesuai buku manual tiap DART.
     */
    protected array $fuseSpec = [
        'DART Flip'    => '20 ampere',
        'DART Pop Up'  => '20 ampere',
        'DART Swing'   => '30 ampere',
    ];

    /**
     * Hal-hal yang perlu diperhatikan per jenis unit, sesuai buku manual.
     */
    protected array $precautionsByJenis = [
        'DART Flip' => [
            'DART diberikan tanggul pelindung di bagian depan berupa penghalang atau karung pasir, sehingga unit terlindungi dari tembakan langsung selama latihan maupun pengujian.',
            'Jika tidak digunakan, jangan dibiarkan di area terbuka — simpan pada area tertutup dengan suhu ruang agar tidak terjadi kerusakan pada komponen.',
        ],
        'DART Pop Up' => [
            'DART diberikan tanggul pelindung di bagian depan berupa penghalang atau karung pasir, sehingga unit terlindungi dari tembakan langsung selama latihan maupun pengujian.',
            'Jika tidak digunakan, jangan dibiarkan di area terbuka — simpan pada area tertutup dengan suhu ruang agar tidak terjadi kerusakan pada komponen.',
        ],
        'DART Swing' => [
            'DART diberikan tanggul pelindung di bagian depan berupa penghalang atau karung pasir, sehingga unit terlindungi dari tembakan langsung selama latihan maupun pengujian.',
            'Jika tidak digunakan, jangan dibiarkan di area terbuka — simpan pada area tertutup dengan suhu ruang agar tidak terjadi kerusakan pada komponen.',
        ],
        'Moving Target' => [
            'Jangan menggunakan Moving Target lebih dari 10 menit tanpa jeda agar performa pergerakan tidak menurun dan komponen tidak cepat rusak — beri jeda beberapa menit sebelum dioperasikan kembali.',
            'Moving Target diberikan tanggul pelindung di bagian depan berupa penghalang atau karung pasir, sehingga unit terlindungi dari tembakan langsung selama latihan maupun pengujian.',
        ],
    ];

    /**
     * Saran berdasarkan tingkat kerusakan dan Doktrin Logistik TNI AD 2021.
     */
    protected array $levelAdvice = [
        'Ringan' => [
            'label' => '🟡 KENDALA RINGAN',
            'maintenance_level' => 'PEMELIHARAAN TINGKAT SATUAN',
            'summary' => 'Berdasarkan klasifikasi **Ringan**, unit memerlukan pemeliharaan yang bersifat sederhana. Perbaikan pada tingkat ini tidak memerlukan suku cadang, peralatan khusus, ataupun personel dengan keahlian tertentu sehingga menjadi kewenangan Satuan pemakai/organik.',
            'alert' => '',
        ],
        'Sedang' => [
            'label' => '🟠 KENDALA SEDANG',
            'maintenance_level' => 'PEMELIHARAAN TINGKAT DAERAH',
            'summary' => 'Berdasarkan klasifikasi **Sedang**, unit memerlukan pemeriksaan teknis dan kemungkinan penggantian/perbaikan suku cadang dengan menggunakan peralatan tertentu. Kewenangan perbaikan berada di instalasi pemeliharaan daerah oleh personel ahli.',
            'alert' => '> ⚠️ Disarankan untuk **tidak memaksakan penggunaan** unit DART hingga perbaikan dilakukan, guna mencegah kerusakan yang lebih luas.',
        ],
        'Parah' => [
            'label' => '🔴 KENDALA PARAH / KRITIS',
            'maintenance_level' => 'PEMELIHARAAN TINGKAT PUSAT',
            'summary' => 'Berdasarkan klasifikasi **Parah**, unit berada dalam kondisi rusak berat. Unit membutuhkan pemeliharaan tingkat lanjutan yang mungkin melibatkan tahapan produksi, modifikasi, atau rehabilitasi di instalasi pemeliharaan pusat (Bengkel Pusat).',
            'alert' => '> 🚨 **PERINGATAN:** Jangan mencoba memperbaiki sendiri. Jangan menyalakan ulang unit jika ada indikasi asap, bau terbakar, atau kerusakan parah. Amankan unit dan laporkan segera untuk evakuasi ke tingkat pusat.',
        ],
    ];

    /**
     * Analisis lokal berdasarkan deskripsi dan tingkat kerusakan.
     */
    public function getDiagnosticAdvice(
        string $description,
        string $level,
        string $unitName,
        ?float $confidence = null,
        bool $overridden = false,
        ?string $unitJenis = null
    ): string {
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
        $output = "{$levelInfo['label']}\n\n";
        $output .= "**Unit:** `{$unitName}` | **Tingkat Diagnosis:** {$level}\n";
        $output .= "**Tingkat Penanganan:** `{$levelInfo['maintenance_level']}`\n\n";
        $output .= "{$levelInfo['summary']}\n\n";

        if (!empty($levelInfo['alert'])) {
            $output .= "{$levelInfo['alert']}\n\n";
        }

        $output .= "---\n\n";

        $fuseRating = $this->fuseSpec[$unitJenis] ?? 'sesuai spesifikasi unit';

        if ($matchedRule && $highestScore > 0) {
            // Ada kata kunci yang cocok
            $output .= "### 🔍 Analisis: {$matchedRule['topic']}\n\n";
            $output .= "**Kemungkinan Penyebab:**\n";
            foreach ($matchedRule['causes'] as $cause) {
                $output .= "- {$cause}\n";
            }
            $output .= "\n**Langkah Pemeriksaan Awal (oleh Pelapor tingkat Satuan):**\n";
            foreach ($matchedRule['steps'] as $i => $step) {
                $step = str_replace('fuse baru sesuai spesifikasi unit', "fuse baru sesuai spesifikasi unit ({$fuseRating})", $step);
                $output .= ($i + 1) . ". {$step}\n";
            }
        } else {
            // Tidak ada kata kunci cocok — berikan saran umum
            $output .= "### 🔍 Analisis Umum\n\n";
            $output .= "Deskripsi kendala tidak cocok dengan pola kerusakan yang tersimpan dalam basis data. ";
            $output .= "Teknisi akan melakukan pemeriksaan manual secara langsung.\n\n";
            $output .= "**Langkah Umum yang Dapat Dilakukan:**\n";
            $output .= "1. **Dokumentasikan kondisi unit** dengan foto/video sebelum dipindahkan.\n";
            $output .= "2. **Hentikan penggunaan** unit yang bermasalah sampai Teknisi terkait tiba.\n";
            $output .= "3. **Catat waktu dan kondisi** saat masalah pertama kali muncul.\n";
            $output .= "4. **Jangan mencoba memperbaiki sendiri di luar kewenangan** — serahkan kepada unit perbaikan terkait.\n";
        }

        $precautions = $this->precautionsByJenis[$unitJenis] ?? null;
        if ($precautions) {
            $output .= "\n---\n\n";
            $output .= "**Hal yang Perlu Diperhatikan untuk {$unitJenis}:**\n";
            foreach ($precautions as $point) {
                $output .= "- {$point}\n";
            }
        }

        return $output;
    }
}