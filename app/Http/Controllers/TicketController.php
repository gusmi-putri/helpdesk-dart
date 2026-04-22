<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ticket;
use Carbon\Carbon;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'barangRusak' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'deskripsi' => 'required|string',
        ]);

        $dateCode = Carbon::now()->format('y-m');
        $count = Ticket::whereYear('created_at', Carbon::now()->year)
                       ->whereMonth('created_at', Carbon::now()->month)->count() + 1;
        $caseId = 'CASE-' . $dateCode . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        Ticket::create([
            'case_id' => $caseId,
            'user_id' => 5, // Placeholder (sementara state Auth belum beres)
            'barang_rusak' => $request->barangRusak,
            'lokasi' => $request->lokasi,
            'deskripsi' => $request->deskripsi,
            'status' => 'PENDING',
            'status_perbaikan' => 'MENUNGGU'
        ]);

        return redirect()->back()->with('message', 'Laporan berhasil ditransmisikan!');
    }
}
