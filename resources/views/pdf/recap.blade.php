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
        .status-pending { background-color: #c81e1e; }
        .status-proses { background-color: #3b82f6; }
        .status-selesai { background-color: #16a34a; }

        .footer { position: fixed; bottom: -20px; left: 0; right: 0; height: 30px; text-align: center; font-size: 8px; color: #999; border-top: 1px solid #eee; padding-top: 5px; }
        .watermark { position: fixed; top: 45%; left: 25%; font-size: 60px; color: rgba(75, 83, 32, 0.05); transform: rotate(-45deg); z-index: -1000; font-weight: bold; }
        
        .page-break { page-break-after: always; }
        .text-center { text-align: center; }
        .font-mono { font-family: 'Courier', monospace; }
    </style>
</head>
<body>
    <div class="watermark">HELPDESK DART</div>

    <div class="header">
        <img src="{{ public_path('logo.png') }}" style="height: 50px; margin-bottom: 5px;" alt="LOGO">
        <h1>COMMAND CENTER HELPDESK DART</h1>
        <p>{{ $title }}</p>
    </div>

    <div class="summary">
        <table class="summary-table">
            <tr>
                <td class="label">TOTAL LAPORAN</td>
                <td class="val">{{ $stats['total'] }}</td>
            </tr>
            <tr>
                <td class="label">STATUS SELESAI</td>
                <td class="val" style="color: #16a34a;">{{ $stats['selesai'] }}</td>
            </tr>
            <tr>
                <td class="label">DALAM PROSES</td>
                <td class="val" style="color: #3b82f6;">{{ $stats['proses'] }}</td>
            </tr>
            <tr>
                <td class="label">PENDING / BARU</td>
                <td class="val" style="color: #c81e1e;">{{ $stats['pending'] }}</td>
            </tr>
        </table>
    </div>

    <table class="main-table">
        <thead>
            <tr>
                <th width="12%">KODE / TANGGAL</th>
                <th width="15%">UNIT & LOKASI</th>
                <th width="25%">DESKRIPSI KERUSAKAN</th>
                <th width="15%">TEKNISI</th>
                <th width="20%">TINDAKAN PERBAIKAN</th>
                <th width="13%">STATUS</th>
            </tr>
        </thead>
        <tbody>
            @forelse($reports as $report)
            <tr>
                <td class="text-center font-mono">
                    <strong>LPR-{{ str_pad($report->id, 5, '0', STR_PAD_LEFT) }}</strong><br>
                    <small>{{ $report->tanggal_lapor ? $report->tanggal_lapor->format('d/m/Y H:i') : '-' }}</small>
                </td>
                <td>
                    <strong>{{ $report->unit->nama_dart ?? '-' }}</strong><br>
                    <small>{{ $report->unit->nomor_seri ?? '-' }}</small><br>
                    <small>SATUAN: {{ $report->lokasi_laporan }}</small>
                </td>
                <td>
                    <strong>{{ $report->tingkat_kerusakan }}</strong><br>
                    {{ $report->deskripsi_kerusakan }}
                </td>
                <td>
                    @if($report->teknisi)
                        {{ $report->teknisi->nama_lengkap }}<br>
                        <small>DIAMBIL: {{ $report->tgl_ditunjuk ? $report->tgl_ditunjuk->format('d/m/Y H:i') : '-' }}</small>
                    @else
                        <span style="color: #999; font-style: italic;">Belum Ditugaskan</span>
                    @endif
                </td>
                <td>
                    @if($report->status_laporan === 'Selesai')
                        <strong>METODE: {{ $report->metode_perbaikan }}</strong><br>
                        {{ $report->catatan_teknisi }}<br>
                        <small>SELESAI: {{ $report->tgl_selesai ? $report->tgl_selesai->format('d/m/Y H:i') : '-' }}</small>
                    @else
                        -
                    @endif
                </td>
                <td class="text-center">
                    <span class="status-badge status-{{ strtolower($report->status_laporan) }}">
                        {{ $report->status_laporan }}
                    </span>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="6" class="text-center" style="padding: 30px;">TIDAK ADA DATA LAPORAN PADA PERIODE INI.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Diterbitkan secara otomatis oleh Sistem Helpdesk DART Command Center pada {{ now()->format('d/m/Y H:i:s') }}
    </div>
</body>
</html>
