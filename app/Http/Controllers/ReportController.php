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
        ]);

        $pelapor = User::whereHas('role', function($q) { $q->where('nama_role', 'Pelapor'); })->first();

        Report::create([
            'unit_id' => $request->unit_id,
            'user_id' => $pelapor->id,
            'tanggal_lapor' => now(),
            'deskripsi_kerusakan' => $request->deskripsi,
            'status_laporan' => 'Pending'
        ]);

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
            'teknisi_id' => $teknisi->id,
            'tgl_ditunjuk' => now()
        ]);

        return redirect()->back()->with('message', 'Teknisi berhasil ditugaskan!');
    }

    public function complete(Request $request, $id)
    {
        $report = Report::findOrFail($id);
        $request->validate([
            'catatan' => 'required|string',
            'metode' => 'required|in:Online,Offline'
        ]);

        $report->update([
            'status_laporan' => 'Selesai',
            'catatan_teknisi' => $request->catatan,
            'metode_perbaikan' => $request->metode,
            'tgl_selesai' => now()
        ]);

        return redirect()->back()->with('message', 'Laporan perbaikan telah difinalisasi!');
    }
}
