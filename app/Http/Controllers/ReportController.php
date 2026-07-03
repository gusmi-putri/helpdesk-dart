<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\Unit;
use App\Models\User;
use App\Models\SystemLog;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreReportRequest;
use App\Services\FileUploadService;

class ReportController extends Controller
{
    protected FileUploadService $fileService;

    public function __construct(FileUploadService $fileService)
    {
        $this->fileService = $fileService;
    }

    public function store(StoreReportRequest $request)
    {
        $fotoPath = $this->fileService->uploadSingleFile($request->file('foto'), 'reports');
        $filePaths = $this->fileService->uploadMultipleFiles($request->file('file_bukti'), 'bukti', 5);
        $dokumenAnggaranPaths = $this->fileService->uploadMultipleFiles($request->file('dokumen_anggaran'), 'dokumen-anggaran', 10);

        DB::transaction(function () use ($request, $fotoPath, $filePaths, $dokumenAnggaranPaths) {
            Report::create([
                'unit_id' => $request->unit_id,
                'user_id' => $request->user()->id,
                'lokasi_laporan' => $request->user()->asal_satuan,
                'klasifikasi' => $request->klasifikasi ?? strtoupper($request->tingkat_kerusakan),
                'file_bukti' => !empty($filePaths) ? json_encode($filePaths) : $fotoPath,
                'tautan_video' => $request->tautan_video,
                'jenis_perbaikan' => $request->jenis_perbaikan,
                'dokumen_anggaran' => !empty($dokumenAnggaranPaths) ? json_encode($dokumenAnggaranPaths) : null,
                'keterangan_anggaran' => $request->keterangan_anggaran,
                'tanggal_lapor' => now(),
                'deskripsi_kerusakan' => $request->deskripsi,
                'tingkat_kerusakan' => $request->tingkat_kerusakan,
                'urgensi' => $request->urgensi,
                'status_laporan' => 'Pending'
            ]);

            $unit = Unit::find($request->unit_id);
            if ($unit) {
                $unit->syncStatus();
            }

            SystemLog::log('WARN', $request->user()->id, "Mengirimkan laporan kerusakan baru di lokasi: {$request->user()->asal_satuan}");
        });

        return redirect()->back()->with('message', 'Laporan anda telah berhasil terkirim');
    }

    public function handle(Request $request, $id)
    {
        $report = Report::findOrFail($id);
        
        $request->validate([
            'teknisi_id' => 'nullable|exists:users,id',
            'teknisi_username' => 'nullable|exists:users,username',
        ]);

        $candidate = null;
        if ($request->filled('teknisi_id')) {
            $candidate = User::find($request->teknisi_id);
        } elseif ($request->filled('teknisi_username')) {
            $candidate = User::where('username', $request->teknisi_username)->first();
        }

        if ($candidate) {
            if (!$candidate->role || $candidate->role->nama_role !== 'Teknisi') {
                return redirect()->back()->with('error', 'Personel yang dipilih bukan seorang Teknisi.');
            }
            $teknisi = $candidate;
        } else {
            // Fallback jika tidak ditemukan
            $teknisi = User::whereHas('role', function ($q) {
                $q->where('nama_role', 'Teknisi');
            })->first();
        }

        if (!$teknisi) {
            return redirect()->back()->with('error', 'Tidak ada Teknisi terdaftar dalam sistem untuk ditugaskan.');
        }

        $report->update([
            'status_laporan' => 'Diverifikasi',
            'staff_id' => $request->user()->id,
            'teknisi_id' => $teknisi->id,
            'tgl_ditunjuk' => now()
        ]);

        $report->unit->syncStatus();

        SystemLog::log('INFO', $request->user()->id, "Menugaskan teknisi {$teknisi->nama_lengkap} untuk menangani kasus: LPR-" . str_pad($report->id, 5, '0', STR_PAD_LEFT));

        return redirect()->back()->with('message', 'Teknisi berhasil ditugaskan!');
    }

    public function complete(Request $request, $id)
    {
        $report = Report::findOrFail($id);

        if ($report->teknisi_id !== auth()->id()) {
            return redirect()->back()->with('error', 'Akses Ditolak: Anda tidak ditugaskan untuk laporan ini.');
        }

        $request->validate([
            'catatan' => 'required|string',
            'metode' => 'required|in:Online,Offline',
            'foto_selesai' => 'required|image|mimes:jpeg,png,jpg|max:20480',
            'tautan_video_selesai' => 'required|url',
        ]);

        $fotoSelesai = $report->file_bukti_selesai;
        if ($request->hasFile('foto_selesai')) {
            $fotoSelesai = $this->fileService->uploadSingleFile($request->file('foto_selesai'), 'reports', 'done_');
        }

        $report->catatan_teknisi = $request->catatan;
        $report->metode_perbaikan = $request->metode;
        $report->file_bukti_selesai = $fotoSelesai;
        $report->tautan_video_selesai = $request->tautan_video_selesai;
        $report->tgl_selesai = now();
        $report->status_laporan = 'Selesai'; // transitions immediately to Selesai!

        if ($report->save()) {
            SystemLog::log('SUCCESS', $request->user()->id, "Menyelesaikan penanganan laporan LPR-" . str_pad($report->id, 5, '0', STR_PAD_LEFT));
            $report->unit->syncStatus();
            return redirect()->back()->with('message', 'Laporan perbaikan telah diselesaikan!');
        }

        return redirect()->back()->with('error', 'Gagal menyelesaikan laporan perbaikan.');
    }

    public function verify($id)
    {
        $report = Report::findOrFail($id);
        $report->update(['status_laporan' => 'Diverifikasi']);
        $report->unit->syncStatus();

        SystemLog::log('INFO', auth()->id(), "Memverifikasi laporan kerusakan: LPR-" . str_pad($report->id, 5, '0', STR_PAD_LEFT));

        return redirect()->back()->with('message', 'Laporan berhasil diverifikasi!');
    }

    public function reject(Request $request, $id)
    {
        $report = Report::findOrFail($id);
        $request->validate([
            'alasan' => 'required|string',
        ]);
        $report->update([
            'status_laporan' => 'Ditolak',
            'alasan_penolakan' => $request->alasan
        ]);
        $report->unit->syncStatus();

        SystemLog::log('WARN', auth()->id(), "Menolak laporan kerusakan: LPR-" . str_pad($report->id, 5, '0', STR_PAD_LEFT) . " dengan alasan: {$request->alasan}");

        return redirect()->back()->with('message', 'Laporan telah ditolak!');
    }

    public function acceptTask($id)
    {
        $report = Report::findOrFail($id);

        if ($report->teknisi_id !== auth()->id()) {
            return redirect()->back()->with('error', 'Akses Ditolak: Anda tidak ditugaskan untuk laporan ini.');
        }

        $report->update(['status_laporan' => 'Diterima Teknisi']);
        $report->unit->syncStatus();

        SystemLog::log('INFO', auth()->id(), "Teknisi menerima tugas penanganan: LPR-" . str_pad($report->id, 5, '0', STR_PAD_LEFT));

        return redirect()->back()->with('message', 'Tugas berhasil diterima!');
    }

    public function startProgress($id)
    {
        $report = Report::findOrFail($id);

        if ($report->teknisi_id !== auth()->id()) {
            return redirect()->back()->with('error', 'Akses Ditolak: Anda tidak ditugaskan untuk laporan ini.');
        }

        $report->update(['status_laporan' => 'Diproses']);
        $report->unit->syncStatus();

        SystemLog::log('INFO', auth()->id(), "Mulai melakukan tindakan perbaikan kasus: LPR-" . str_pad($report->id, 5, '0', STR_PAD_LEFT));

        return redirect()->back()->with('message', 'Perbaikan mulai diproses!');
    }
}
