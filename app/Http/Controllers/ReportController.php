<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\Unit;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'unit_id' => 'required|exists:units,id',
            'deskripsi' => 'required|string',
            'tingkat_kerusakan' => 'required|in:Ringan,Sedang,Parah',
            'urgensi' => 'required|in:Sangat Mendesak,Bisa Menunggu,Pemeliharaan Rutin',
            'klasifikasi' => 'nullable|in:RINGAN,SEDANG,DARURAT',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:20480',
            'file_bukti.*' => 'nullable|file|mimes:jpg,jpeg,png,gif,mp4,mov,avi,webm|max:20480',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $file = $request->file('foto');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('reports', $filename, 'public');
            $fotoPath = $filename;
        }

        // Handle file uploads (max 5 files)
        $filePaths = [];
        if ($request->hasFile('file_bukti')) {
            $files = array_slice($request->file('file_bukti'), 0, 5);
            foreach ($files as $file) {
                $path = $file->store('bukti', 'public');
                $filePaths[] = $path;
            }
        }

        Report::create([
            'unit_id' => $request->unit_id,
            'user_id' => $request->user()->id,
            'lokasi_laporan' => $request->user()->asal_satuan,
            'klasifikasi' => $request->klasifikasi ?? strtoupper($request->tingkat_kerusakan),
            'file_bukti' => !empty($filePaths) ? json_encode($filePaths) : $fotoPath,
            'tanggal_lapor' => now(),
            'deskripsi_kerusakan' => $request->deskripsi,
            'tingkat_kerusakan' => $request->tingkat_kerusakan,
            'urgensi' => $request->urgensi,
            'status_laporan' => 'Pending'
        ]);

        Unit::find($request->unit_id)->syncStatus();

        \App\Models\SystemLog::log('WARN', $request->user()->id, "Mengirimkan laporan kerusakan baru di lokasi: {$request->user()->asal_satuan}");

        return redirect()->back()->with('message', 'Laporan anda telah berhasil terkirim');
    }

    public function handle(Request $request, $id)
    {
        $report = Report::findOrFail($id);
        
        $teknisi = null;
        if ($request->has('teknisi_id')) {
            $teknisi = User::find($request->teknisi_id);
        } elseif ($request->has('teknisi_username')) {
            $teknisi = User::where('username', $request->teknisi_username)->first();
        }
        
        // Fallback jika tidak ditemukan
        if (!$teknisi) {
            $teknisi = User::whereHas('role', function($q) { $q->where('nama_role', 'Teknisi'); })->first();
        }

        $report->update([
            'status_laporan' => 'Diverifikasi',
            'staff_id' => $request->user()->id,
            'teknisi_id' => $teknisi->id,
            'tgl_ditunjuk' => now()
        ]);

        $report->unit->syncStatus();

        \App\Models\SystemLog::log('INFO', $request->user()->id, "Menugaskan teknisi {$teknisi->nama_lengkap} untuk menangani kasus: LPR-" . str_pad($report->id, 5, '0', STR_PAD_LEFT));

        return redirect()->back()->with('message', 'Teknisi berhasil ditugaskan!');
    }

    public function complete(Request $request, $id)
    {
        $report = Report::findOrFail($id);
        $request->validate([
            'catatan' => 'required|string',
            'metode' => 'required|in:Online,Offline',
            'foto_selesai' => 'required|image|mimes:jpeg,png,jpg|max:20480',
            'video_selesai' => 'nullable|file|mimes:mp4,mov,avi,webm|max:51200',
        ]);

        $fotoSelesai = $report->file_bukti_selesai;
        if ($request->hasFile('foto_selesai')) {
            $file = $request->file('foto_selesai');
            $filename = 'done_' . time() . '_' . $file->getClientOriginalName();
            $file->storeAs('reports', $filename, 'public');
            $fotoSelesai = $filename;
        }

        $videoSelesai = $report->file_bukti_selesai_video;
        if ($request->hasFile('video_selesai')) {
            $file = $request->file('video_selesai');
            $filename = 'video_done_' . time() . '_' . $file->getClientOriginalName();
            $file->storeAs('reports', $filename, 'public');
            $videoSelesai = $filename;
        }

        $report->catatan_teknisi = $request->catatan;
        $report->metode_perbaikan = $request->metode;
        $report->file_bukti_selesai = $fotoSelesai;
        $report->file_bukti_selesai_video = $videoSelesai;
        $report->tgl_selesai = now();
        $report->status_laporan = 'Selesai'; // transitions immediately to Selesai!

        if ($report->save()) {
            \App\Models\SystemLog::log('SUCCESS', $request->user()->id, "Menyelesaikan penanganan laporan LPR-" . str_pad($report->id, 5, '0', STR_PAD_LEFT));
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

        \App\Models\SystemLog::log('INFO', auth()->id(), "Memverifikasi laporan kerusakan: LPR-" . str_pad($report->id, 5, '0', STR_PAD_LEFT));

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

        \App\Models\SystemLog::log('WARN', auth()->id(), "Menolak laporan kerusakan: LPR-" . str_pad($report->id, 5, '0', STR_PAD_LEFT) . " dengan alasan: {$request->alasan}");

        return redirect()->back()->with('message', 'Laporan telah ditolak!');
    }

    public function acceptTask($id)
    {
        $report = Report::findOrFail($id);
        $report->update(['status_laporan' => 'Diterima Teknisi']);
        $report->unit->syncStatus();

        \App\Models\SystemLog::log('INFO', auth()->id(), "Teknisi menerima tugas penanganan: LPR-" . str_pad($report->id, 5, '0', STR_PAD_LEFT));

        return redirect()->back()->with('message', 'Tugas berhasil diterima!');
    }

    public function startProgress($id)
    {
        $report = Report::findOrFail($id);
        $report->update(['status_laporan' => 'Diproses']);
        $report->unit->syncStatus();

        \App\Models\SystemLog::log('INFO', auth()->id(), "Mulai melakukan tindakan perbaikan kasus: LPR-" . str_pad($report->id, 5, '0', STR_PAD_LEFT));

        return redirect()->back()->with('message', 'Perbaikan mulai diproses!');
    }
}
