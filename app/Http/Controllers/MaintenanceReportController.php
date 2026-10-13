<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MaintenanceReport;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

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
     *
     * Endpoint ini dipakai oleh dua form berbeda yang kirim bentuk field berbeda:
     * - Form Pelapor: 'waktu_pemeliharaan' (gabungan "Periode - Tahun") + dokumen berupa array file.
     * - Modal Staf: 'periode'/'tahun' terpisah + dokumen berupa file tunggal.
     * Kedua bentuk diterima di sini agar keduanya tetap berfungsi.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_giat' => 'required|string|max:255',
            'anggaran_pendukung' => 'required|string|max:255',
            'jumlah_anggaran' => 'required|numeric',
        ]);

        $user = auth()->user();
        if (!$user || !$user->satuan_id) {
            return redirect()->back()->with('error', 'User tidak valid atau tidak memiliki satuan.');
        }

        // Resolve periode & tahun dari salah satu bentuk pengiriman
        if ($request->filled('waktu_pemeliharaan')) {
            $waktuParts = explode(' - ', $request->input('waktu_pemeliharaan'));
            $periode = trim($waktuParts[0] ?? '');
            $tahun = trim($waktuParts[1] ?? '');
        } else {
            $periode = trim((string) $request->input('periode'));
            $tahun = trim((string) $request->input('tahun'));
        }

        // Resolve dokumen dari salah satu bentuk pengiriman (array pertama atau file tunggal)
        $dokumenAnggaranFile = $request->file('dokumen_anggaran_pemeliharaan.0') ?? $request->file('dokumen_anggaran');
        $dokumenLpjFile = $request->file('dokumen_laporan_pemeliharaan.0') ?? $request->file('dokumen_lpj');

        $validator = Validator::make([
            'periode' => $periode,
            'tahun' => $tahun,
            'dokumen_anggaran' => $dokumenAnggaranFile,
            'dokumen_lpj' => $dokumenLpjFile,
        ], [
            'periode' => 'required|string|max:255',
            'tahun' => 'required|digits:4',
            'dokumen_anggaran' => 'required|file|max:10240',
            'dokumen_lpj' => 'required|file|max:10240',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        try {
            // Handle file uploads
            $dokumenAnggaranPath = $this->fileService->uploadSingleFile($dokumenAnggaranFile, 'maintenance/anggaran');
            $dokumenLpjPath = $this->fileService->uploadSingleFile($dokumenLpjFile, 'maintenance/lpj');

            MaintenanceReport::create([
                'satuan_id' => $user->satuan_id,
                'user_id' => $user->id,
                'nama_giat' => $request->nama_giat,
                'periode' => $periode,
                'tahun' => $tahun,
                'anggaran_pendukung' => $request->anggaran_pendukung,
                'jumlah_anggaran' => $request->jumlah_anggaran,
                'dokumen_anggaran' => $dokumenAnggaranPath,
                'dokumen_lpj' => $dokumenLpjPath,
            ]);

            return redirect()->back()->with('message', 'Laporan pemeliharaan berhasil dikirim.');
        } catch (\Exception $e) {
            Log::error('Maintenance Report Creation Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal mengirim laporan pemeliharaan. Silakan coba lagi.');
        }
    }
}
