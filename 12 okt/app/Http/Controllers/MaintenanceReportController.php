<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MaintenanceReport;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

use App\Services\FileUploadService;

class MaintenanceReportController extends Controller
{
    protected FileUploadService $fileService;

    public function __construct(FileUploadService $fileService)
    {
        $this->fileService = $fileService;
    }

    /**
     * Store a newly created maintenance report.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_giat' => 'required|string|max:255',
            'waktu_pemeliharaan' => 'required|string|max:255',
            'anggaran_pendukung' => 'required|string|max:255',
            'jumlah_anggaran' => 'required|numeric',
            'dokumen_anggaran_pemeliharaan' => 'required|array',
            'dokumen_anggaran_pemeliharaan.*' => 'file|max:10240',
            'dokumen_laporan_pemeliharaan' => 'required|array',
            'dokumen_laporan_pemeliharaan.*' => 'file|max:10240',
        ]);

        try {
            $user = auth()->user();
            if (!$user || !$user->satuan_id) {
                return redirect()->back()->with('error', 'User tidak valid atau tidak memiliki satuan.');
            }

            $waktuParts = explode(' - ', $request->waktu_pemeliharaan);
            $periode = $waktuParts[0] ?? '';
            $tahun = $waktuParts[1] ?? date('Y');

            // Handle file uploads
            $dokumenAnggaranPaths = $this->fileService->uploadMultipleFiles($request->file('dokumen_anggaran_pemeliharaan'), 'maintenance/anggaran', 5);
            $dokumenLpjPaths = $this->fileService->uploadMultipleFiles($request->file('dokumen_laporan_pemeliharaan'), 'maintenance/lpj', 5);

            MaintenanceReport::create([
                'satuan_id' => $user->satuan_id,
                'user_id' => $user->id,
                'nama_giat' => $request->nama_giat,
                'periode' => $periode,
                'tahun' => $tahun,
                'anggaran_pendukung' => $request->anggaran_pendukung,
                'jumlah_anggaran' => $request->jumlah_anggaran,
                'dokumen_anggaran' => !empty($dokumenAnggaranPaths) ? json_encode($dokumenAnggaranPaths) : null,
                'dokumen_lpj' => !empty($dokumenLpjPaths) ? json_encode($dokumenLpjPaths) : null,
            ]);

            return redirect()->back()->with('message', 'Laporan pemeliharaan berhasil dikirim.');
        } catch (\Exception $e) {
            Log::error('Maintenance Report Creation Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal mengirim laporan pemeliharaan. Silakan coba lagi.');
        }
    }
}
