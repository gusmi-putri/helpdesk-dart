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
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'file_bukti.*' => 'nullable|file|mimes:jpg,jpeg,png,gif,mp4,mov,avi,webm|max:102400',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $file = $request->file('foto');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('public/reports', $filename);
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

        \App\Models\SystemLog::log('WARN', $request->user()->id, "Mengirimkan laporan kerusakan baru di lokasi: {$request->user()->asal_satuan}");

        return redirect()->back()->with('message', 'Laporan berhasil ditransmisikan ke Pusat Komando!');
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
            'status_laporan' => 'Proses',
            'staff_id' => $request->user()->id,
            'teknisi_id' => $teknisi->id,
            'tgl_ditunjuk' => now()
        ]);

        \App\Models\SystemLog::log('INFO', $request->user()->id, "Menugaskan teknisi {$teknisi->nama_lengkap} untuk menangani kasus: LPR-" . str_pad($report->id, 5, '0', STR_PAD_LEFT));

        return redirect()->back()->with('message', 'Teknisi berhasil ditugaskan!');
    }

    public function complete(Request $request, $id)
    {
        $report = Report::findOrFail($id);
        $request->validate([
            'catatan' => 'required|string',
            'metode' => 'required|in:Online,Offline',
            'foto_selesai' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $fotoSelesai = $report->file_bukti_selesai;
        if ($request->hasFile('foto_selesai')) {
            $file = $request->file('foto_selesai');
            $filename = 'done_' . time() . '_' . $file->getClientOriginalName();
            $file->storeAs('public/reports', $filename);
            $fotoSelesai = $filename;
        }

        $report->status_laporan = 'Selesai';
        $report->catatan_teknisi = $request->catatan;
        $report->metode_perbaikan = $request->metode;
        $report->file_bukti_selesai = $fotoSelesai;
        $report->tgl_selesai = now();
        
        if ($report->save()) {
            \App\Models\SystemLog::log('SUCCESS', $request->user()->id, "Menyelesaikan penanganan laporan LPR-" . str_pad($report->id, 5, '0', STR_PAD_LEFT) . " dengan metode {$request->metode}");
            return redirect()->back()->with('message', 'Laporan perbaikan telah difinalisasi!');
        }

        return redirect()->back()->with('error', 'Gagal memfinalisasi laporan. Cek status sistem.');
    }
}
