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
            'klasifikasi' => 'required|in:RINGAN,SEDANG,DARURAT',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $file = $request->file('foto');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('public/reports', $filename);
            $fotoPath = $filename;
        }
        
        Report::create([
            'unit_id' => $request->unit_id,
            'user_id' => $request->user()->id,
            'lokasi_laporan' => $request->user()->asal_satuan,
            'klasifikasi' => $request->klasifikasi,
            'file_bukti' => $fotoPath,
            'tanggal_lapor' => now(),
            'deskripsi_kerusakan' => $request->deskripsi,
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

        \App\Models\SystemLog::log('INFO', $request->user()->id, "Menugaskan teknisi {$teknisi->nama_lengkap} untuk menangani kasus: DRT-" . str_pad($report->id, 5, '0', STR_PAD_LEFT));

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

        $report->update([
            'status_laporan' => 'Selesai',
            'catatan_teknisi' => $request->catatan,
            'metode_perbaikan' => $request->metode,
            'file_bukti_selesai' => $fotoSelesai,
            'tgl_selesai' => now()
        ]);

        \App\Models\SystemLog::log('SUCCESS', $request->user()->id, "Menyelesaikan penanganan laporan DRT-" . str_pad($report->id, 5, '0', STR_PAD_LEFT) . " dengan metode {$request->metode}");

        return redirect()->back()->with('message', 'Laporan perbaikan telah difinalisasi!');
    }
}
