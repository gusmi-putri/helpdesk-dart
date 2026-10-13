<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BAP_{{ $report->case_id }}</title>
    <style>
        body {
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            margin: 2cm;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            font-weight: bold;
        }
        .header-top {
            text-decoration: underline;
        }
        .title {
            text-align: center;
            font-weight: bold;
            font-size: 14pt;
            margin-top: 30px;
            margin-bottom: 30px;
            text-decoration: underline;
            text-transform: uppercase;
        }
        .content {
            text-align: justify;
        }
        .list-numbered {
            padding-left: 20px;
        }
        .list-alpha {
            padding-left: 40px;
            list-style-type: lower-alpha;
        }
        .list-numeric-sub {
            padding-left: 60px;
            list-style-type: none;
        }
        .ttd-section {
            width: 100%;
            margin-top: 50px;
        }
        .ttd-box {
            float: right;
            width: 300px;
            text-align: center;
        }
        .ttd-name {
            margin-top: 80px;
            font-weight: bold;
            text-decoration: underline;
        }
        .page-break {
            page-break-after: always;
        }
        .lampiran-title {
            font-weight: bold;
            margin-bottom: 20px;
        }
        .img-container {
            text-align: center;
            margin-bottom: 20px;
        }
        .img-container img {
            max-width: 80%;
            border: 1px solid #000;
        }
        ol {
            margin-top: 0;
            margin-bottom: 0;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="header-top">DIREKTORAT PERHUBUNGAN ANGKATAN DARAT</div>
        <div>BENGKEL PUSAT KOMUNIKASI DAN ELEKTRONIKA</div>
    </div>

    <div class="title">
        LAPORAN PELAKSANAAN KEGIATAN HAR ALKOM DART TA {{ $tahunAnggaran }}<br>
        BENGPUSKOMLEKAD PUSKOMLEKAD
    </div>

    <div class="content">
        <ol class="list-numbered">
            <li>
                <strong>Umum.</strong> Bengpuskomlekad Puskomlekad merupakan salah satu unsur pelaksana Puskomlekad yang memiliki tugas pokok menyelenggarakan dan melaksanakan pemeliharaan dan perbaikan Alkom tingkat pusat serta produksi Alkomlek secara terbatas; Pada TA {{ $tahunAnggaran }} Bengpuskomlekad Puskomlekad menyelenggarakan kegiatan pemeliharaan Alkom DART TA {{ $tahunAnggaran }} dengan tujuan untuk mengoptimalkan fungsi Alkom DART untuk mendukung kegiatan Harkan produksi Alkom di Bengpuskomlekad Puskomlekad; dan Dalam rangka usaha peningkatan kemampuan sumber daya manusia dan alat perhubungan pada kegiatan pemeliharaan dan perbaikan Alkom tingkat pusat di Bengpuskomlekad Puskomlekad, maka perlu dibuat laporan pelaksanaan kegiatan pemeliharaan Alkom DART TA {{ $tahunAnggaran }} sebagai bahan pertanggungjawaban bagi satuan atas.
            </li>
            <li>
                <strong>Maksud dan Tujuan.</strong>
                <ol class="list-alpha">
                    <li><strong>Maksud.</strong> Memberikan gambaran tentang hasil pelaksanaan kegiatan pemeliharaan Alkom DART TA {{ $tahunAnggaran }} Bnegpuskomlekad Puskomlekad.</li>
                    <li><strong>Tujuan.</strong> Sebagai bahan pertanggungjawaban Kabengpuskomlekad Puskomlekad dalam pelaksanaan kegiatan pemeliharaan Alkom DART TA {{ $tahunAnggaran }} Bengpuskomlekad Puskomlekad.</li>
                </ol>
            </li>
            <li>
                <strong>Waktu dan Tempat.</strong>
                <ol class="list-alpha">
                    <li><strong>Waktu.</strong> Kegiatan pemeliharaan Alkom DART TA {{ $tahunAnggaran }} Bnegpuskomlekad Puskomlekad ini dilaksanakan dalam kurun waktu mulai tanggal {{ $tanggalMulaiText }} sampai dengan tanggal {{ $tanggalSelesaiText }} dari tahap perencanaan, persiapan, pelaksanaan sampai dengan pengakhiran.</li>
                    <li><strong>Tempat.</strong> Mabengpuskomlekad Puskomlekad, Jl. PSM No.50, Sukapura, Kec. Kiaracondong, Kota Bandung, Jawa Barat 40285.</li>
                </ol>
            </li>
            <li>
                <strong>Teknisi yang Memperbaiki.</strong>
                <ol class="list-alpha">
                    <li><strong>Nama teknisi.</strong> {{ $report->teknisi->nama_lengkap ?? '-' }}</li>
                </ol>
            </li>
            <li>
                <strong>Hasil yang Dicapai.</strong>
                <ol class="list-alpha">
                    <li><strong>Kuantitas.</strong> Terpeliharanya Alkom DART TA {{ $tahunAnggaran }} Bengpuskomlekad Puskomlekad sebanyak 1 unit. Dengan data berikut:
                        <div class="list-numeric-sub">1) Nomor seri: {{ $report->unit->nomor_seri ?? '-' }}</div>
                    </li>
                    <li><strong>Kualitas.</strong> Terpeliharanya Alkom DART TA {{ $tahunAnggaran }} Bnegpuskomlekad Puskomlekad kegiatan perbaikan statik DART {{ $report->unit->jenis ?? 'DART' }} dengan hasil baik dan berfungsi.</li>
                </ol>
            </li>
            <li>
                <strong>Kesimpulan dan Saran.</strong>
                <ol class="list-alpha">
                    <li><strong>Kesimpulan.</strong> Bengpuskomlekad puskomlekad telah melaksanakan pemeliharaan Alkom DART TA {{ $tahunAnggaran }} tepat sasaran dan waktu.</li>
                    <li><strong>Saran.</strong> {{ $report->catatan_teknisi ?? '-' }}</li>
                </ol>
            </li>
            <li>
                <strong>Penutup.</strong> Demikian laporan pelaksanaan kegiatan pemeliharaan Alkom DART TA {{ $tahunAnggaran }} Bengpuskomlekad Puskomlekad sebagai bahan laporan dan mohon petunjuk lebih lanjut.
            </li>
        </ol>
    </div>

    <div class="ttd-section">
        <div class="ttd-box">
            Bandung, {{ $tanggalTTD }}<br>
            Kepala Bengkel Pusat Komunikasi dan Elektronika selaku<br>
            Pejabat Pembuat Komitmen,
            <div class="ttd-name">Setyo Budi Nugroho S. Sos.</div>
            <div>Kolonel Cke NRP</div>
        </div>
    </div>

    @if(count($images) > 0)
    <div class="page-break"></div>
    <div class="lampiran-title">Lampiran : Dokumentasi kegiatan / Dokumentasi komponen</div>
    
    @foreach($images as $image)
        <div class="img-container">
            <img src="{{ $image }}" alt="Dokumentasi">
        </div>
    @endforeach
    @endif

</body>
</html>
