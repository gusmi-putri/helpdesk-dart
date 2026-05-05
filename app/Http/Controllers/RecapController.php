<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class RecapController extends Controller
{
    public function export(Request $request)
    {
        $period = $request->query('period', 'monthly');
        $query = Report::with(['unit', 'pelapor', 'teknisi']);

        if ($period === 'weekly') {
            $query->where('tanggal_lapor', '>=', now()->subDays(7));
            $title = "REKAPITULASI MINGGUAN (" . now()->subDays(7)->format('d/m/Y') . " - " . now()->format('d/m/Y') . ")";
        } elseif ($period === 'yearly') {
            $query->whereYear('tanggal_lapor', now()->year);
            $title = "REKAPITULASI TAHUNAN (" . now()->year . ")";
        } else {
            // Default Monthly
            $query->whereMonth('tanggal_lapor', now()->month)
                  ->whereYear('tanggal_lapor', now()->year);
            $title = "REKAPITULASI BULANAN (" . now()->format('F Y') . ")";
        }

        $reports = $query->orderBy('tanggal_lapor', 'desc')->get()->map(function($report) {
            // Apply EYD formatting (simple capitalization and trimming)
            $report->deskripsi_kerusakan = ucfirst(trim($report->deskripsi_kerusakan));
            $report->catatan_teknisi = $report->catatan_teknisi ? ucfirst(trim($report->catatan_teknisi)) : null;
            return $report;
        });
        
        $stats = [
            'total' => $reports->count(),
            'selesai' => $reports->where('status_laporan', 'Selesai')->count(),
            'proses' => $reports->where('status_laporan', 'Proses')->count(),
            'pending' => $reports->where('status_laporan', 'Pending')->count(),
        ];

        $pdf = Pdf::loadView('pdf.recap', compact('reports', 'title', 'stats', 'period'));
        $pdf->setPaper('a4', 'landscape');

        $filename = "REKAP_" . strtoupper($period) . "_" . now()->format('Ymd_His') . ".pdf";
        return $pdf->download($filename);
    }
}
