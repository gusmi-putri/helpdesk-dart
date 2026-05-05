<!DOCTYPE html>
<html>
<head>
    <title>BAP - {{ $report->case_id }}</title>
    <style>
        body { font-family: 'Courier', sans-serif; font-size: 12px; color: #333; line-height: 1.5; }
        .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 20px; letter-spacing: 2px; }
        .header p { margin: 0; font-size: 10px; text-transform: uppercase; }
        .doc-title { text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 30px; font-size: 16px; }
        .section { margin-bottom: 20px; }
        .section-title { font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #ccc; margin-bottom: 10px; padding-bottom: 2px; }
        .grid { width: 100%; border-collapse: collapse; }
        .grid td { padding: 5px 0; vertical-align: top; }
        .label { width: 180px; font-weight: bold; }
        .separator { width: 20px; text-align: center; }
        .footer { margin-top: 50px; }
        .sign-area { width: 100%; margin-top: 40px; }
        .sign-box { width: 33%; text-align: center; float: left; }
        .sign-label { height: 80px; }
        .sign-name { font-weight: bold; text-decoration: underline; }
        .watermark { position: fixed; top: 30%; left: 10%; font-size: 80px; color: rgba(200, 200, 200, 0.2); transform: rotate(-45deg); z-index: -1; pointer-events: none; }
    </style>
</head>
<body>
    <div class="watermark">DART - CONFIDENTIAL</div>

    <div class="header">
        <h1>COMMAND CENTER DART</h1>
        <p>BENGPUSKOMLEK PUSKOMLEKAD — SISTEM MANAJEMEN PEMELIHARAAN TERPADU</p>
        <p>Jl. PSM No.50, Sukapura, Kec. Kiaracondong, Kota Bandung, Jawa Barat 40285</p>
    </div>

    <div class="doc-title">BERITA ACARA PERBAIKAN (BAP) UNIT DART</div>

    <div class="section">
        <div class="section-title">I. IDENTIFIKASI TIKET</div>
        <table class="grid">
            <tr><td class="label">NOMOR TIKET</td><td class="separator">:</td><td><strong>{{ $report->case_id }}</strong></td></tr>
            <tr><td class="label">TANGGAL LAPOR</td><td class="separator">:</td><td>{{ $report->created_at->format('d F Y, H:i') }} WIB</td></tr>
            <tr><td class="label">UNIT DART</td><td class="separator">:</td><td>{{ $report->unit->nomor_seri }} — {{ $report->unit->nama_dart }}</td></tr>
            <tr><td class="label">LOKASI UNIT</td><td class="separator">:</td><td>{{ $report->unit->asal_satuan }}</td></tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">II. RINCIAN LAPORAN</div>
        <table class="grid">
            <tr><td class="label">NAMA PELAPOR</td><td class="separator">:</td><td>{{ strtoupper($report->pelapor->nama_lengkap) }}</td></tr>
            <tr><td class="label">KLASIFIKASI URGENSI</td><td class="separator">:</td><td>{{ strtoupper($report->urgensi) }}</td></tr>
            <tr><td class="label">TINGKAT KERUSAKAN</td><td class="separator">:</td><td>{{ strtoupper($report->tingkat_kerusakan) }}</td></tr>
            <tr><td class="label">DESKRIPSI KENDALA</td><td class="separator">:</td><td>{{ ucfirst(strtolower($report->deskripsi_kerusakan)) }}</td></tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">III. TINDAKAN PERBAIKAN</div>
        <table class="grid">
            <tr><td class="label">TEKNISI PELAKSANA</td><td class="separator">:</td><td>{{ strtoupper($report->teknisi->nama_lengkap ?? 'N/A') }}</td></tr>
            <tr><td class="label">WAKTU SELESAI</td><td class="separator">:</td><td>{{ $report->tgl_selesai ? $report->tgl_selesai->format('d F Y, H:i') : '-' }} WIB</td></tr>
            <tr><td class="label">TINDAKAN PERBAIKAN</td><td class="separator">:</td><td>{{ ucfirst(strtolower($report->catatan_teknisi ?? '-')) }}</td></tr>
            <tr><td class="label">METODE PERBAIKAN</td><td class="separator">:</td><td>{{ strtoupper($report->metode_perbaikan ?? 'TIDAK ADA') }}</td></tr>
        </table>
    </div>

    <div class="footer">
        <p>Demikian Berita Acara ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.</p>
        
        <div class="sign-area">
            <div class="sign-box">
                <p>Pelapor,</p>
                <div class="sign-label"></div>
                <p class="sign-name">{{ $report->pelapor->nama_lengkap }}</p>
                <p>NRP. {{ $report->pelapor->nrp_nip }}</p>
            </div>
            <div class="sign-box">
                <p>Teknisi,</p>
                <div class="sign-label"></div>
                <p class="sign-name">{{ $report->teknisi->nama_lengkap ?? '....................' }}</p>
                <p>NRP. {{ $report->teknisi->nrp_nip ?? '....................' }}</p>
            </div>
            <div class="sign-box">
                <p>Mengetahui,</p>
                <p>Staf Logistik</p>
                <div class="sign-label"></div>
                <p class="sign-name">..........................</p>
            </div>
        </div>
    </div>
</body>
</html>
