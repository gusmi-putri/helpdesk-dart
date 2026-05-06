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
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $year = $request->query('year');

        $query = Report::with(['unit', 'pelapor', 'teknisi']);

        if ($startDate && $endDate) {
            $query->whereBetween('tanggal_lapor', [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay()
            ]);
            $title = "REKAPITULASI PERIODE (" . Carbon::parse($startDate)->format('d/m/Y') . " - " . Carbon::parse($endDate)->format('d/m/Y') . ")";
        } elseif ($year) {
            $query->whereYear('tanggal_lapor', $year);
            $title = "REKAPITULASI TAHUNAN (" . $year . ")";
        } elseif ($period === 'weekly') {
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
            // Apply refined EYD formatting (lowercase first to handle full caps, then ucfirst)
            $report->deskripsi_kerusakan = ucfirst(mb_strtolower(trim($report->deskripsi_kerusakan)));
            $report->catatan_teknisi = $report->catatan_teknisi ? ucfirst(mb_strtolower(trim($report->catatan_teknisi))) : null;
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
