<!DOCTYPE html>
<html>
<head>
    <title>{{ $title }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 10px; color: #333; margin: 0; padding: 0; }
        .header { text-align: center; border-bottom: 2px solid #4b5320; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 18px; color: #4b5320; letter-spacing: 2px; }
        .header p { margin: 5px 0 0; font-size: 10px; text-transform: uppercase; color: #666; }
        
        .summary { width: 100%; margin-bottom: 20px; }
        .summary-table { width: 40%; border-collapse: collapse; }
        .summary-table td { padding: 4px 8px; border: 1px solid #ddd; }
        .summary-table .label { background-color: #f4f4f4; font-weight: bold; width: 150px; }
        .summary-table .val { text-align: right; font-weight: bold; }

        table.main-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table.main-table th { background-color: #4b5320; color: white; padding: 8px; text-transform: uppercase; font-size: 9px; border: 1px solid #333; }
        table.main-table td { padding: 6px; border: 1px solid #ccc; vertical-align: top; }
        
        .status-badge { padding: 2px 5px; border-radius: 3px; font-weight: bold; font-size: 8px; text-transform: uppercase; color: white; }
        .status-selesai { background-color: #10b981; }

        .footer { position: fixed; bottom: -20px; left: 0; right: 0; height: 30px; text-align: center; font-size: 8px; color: #999; border-top: 1px solid #eee; padding-top: 5px; }
        .watermark { position: fixed; top: 45%; left: 25%; font-size: 60px; color: rgba(75, 83, 32, 0.05); transform: rotate(-45deg); z-index: -1000; font-weight: bold; }
        
        .page-break { page-break-after: always; }
        .text-center { text-align: center; }
        .font-mono { font-family: 'Courier', monospace; }
    </style>
</head>
<body>
    <div class="watermark">SISFO DART</div>

    <div class="header">
        <img src="{{ public_path('logo.png') }}" style="height: 50px; margin-bottom: 5px;" alt="LOGO">
        <h1>COMMAND CENTER SISFO DART</h1>
        <p>{{ $title }}</p>
    </div>

    <div class="summary">
        <table class="summary-table">
            <tr>
                <td class="label">TOTAL LAPORAN PEMELIHARAAN</td>
                <td class="val">{{ $stats['total'] }}</td>
            </tr>
        </table>
    </div>

    <table class="main-table">
        <thead>
            <tr>
                <th width="12%">KODE / TANGGAL</th>
                <th width="20%">SATUAN & PELAPOR</th>
                <th width="30%">DESKRIPSI PEMELIHARAAN</th>
                <th width="25%">ANGGARAN</th>
                <th width="13%">STATUS</th>
            </tr>
        </thead>
        <tbody>
            @forelse($reports as $report)
            <tr>
                <td class="text-center font-mono">
                    <strong>PMH-{{ str_pad($report->id, 5, '0', STR_PAD_LEFT) }}</strong><br>
                    <small>{{ $report->created_at ? $report->created_at->format('d/m/Y H:i') : '-' }}</small>
                </td>
                <td>
                    <strong>{{ $report->satuan->nama_satuan ?? '-' }}</strong><br>
                    <small>PELAPOR: {{ $report->pelapor->nama_lengkap ?? '-' }}</small><br>
                    <small>NRP/NIP: {{ $report->pelapor->nrp_nip ?? '-' }}</small>
                </td>
                <td>
                    <strong>{{ strtoupper($report->nama_giat) }}</strong><br>
                    <small>PERIODE: {{ $report->periode }} - {{ $report->tahun }}</small><br>
                    {{ $report->anggaran_pendukung }}
                </td>
                <td>
                    <strong>Rp {{ number_format($report->jumlah_anggaran, 0, ',', '.') }}</strong><br>
                    <small>Dok. Anggaran: {{ $report->dokumen_anggaran ? 'Ada' : 'Tidak' }}</small><br>
                    <small>Dok. LPJ: {{ $report->dokumen_lpj ? 'Ada' : 'Tidak' }}</small>
                </td>
                <td class="text-center">
                    <span class="status-badge status-selesai">
                        SELESAI
                    </span>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="5" class="text-center" style="padding: 30px;">TIDAK ADA DATA LAPORAN PEMELIHARAAN PADA PERIODE INI.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Diterbitkan secara otomatis oleh Sistem SISFO DART Command Center pada {{ now()->format('d/m/Y H:i:s') }}
    </div>
</body>
</html>
