<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Ticket;
use App\Models\User;
use App\Models\SystemLog;

class DashboardController extends Controller
{
    private function formatTickets($query)
    {
        return $query->with(['pelapor', 'teknisi'])->get()->map(function ($ticket) {
            return [
                'caseId' => $ticket->case_id,
                'status' => $ticket->status,
                'kerusakan' => [
                    'tanggal' => $ticket->created_at->format('d F Y, H:i'),
                    'pelapor' => $ticket->pelapor ? $ticket->pelapor->name : 'Unknown',
                    'lokasi' => $ticket->lokasi,
                    'barangRusak' => $ticket->barang_rusak,
                    'deskripsi' => $ticket->deskripsi,
                ],
                'perbaikan' => [
                    'teknisi' => $ticket->teknisi ? $ticket->teknisi->name : null,
                    'tanggalPenanganan' => $ticket->tanggal_penanganan ? $ticket->tanggal_penanganan->format('d F Y, H:i') : null,
                    'tindakan' => $ticket->tindakan,
                    'sukuCadang' => $ticket->suku_cadang,
                    'statusPerbaikan' => $ticket->status_perbaikan,
                ]
            ];
        });
    }

    public function admin()
    {
        $cases = $this->formatTickets(Ticket::query());
        $users = User::all()->map(function($u) {
            return [
                'db_id' => $u->id,
                'id' => 'USR-'.str_pad($u->id, 3, '0', STR_PAD_LEFT),
                'name' => $u->name,
                'role' => $u->role,
                'status' => $u->status,
                'lastLogin' => 'Baru saja' // placeholder fallback
            ];
        });
        $logs = SystemLog::with('user')->get()->map(function($l) {
            return [
                'id' => $l->id,
                'time' => $l->created_at->format('Y-m-d H:i:s'),
                'level' => $l->level,
                'user' => $l->user ? $l->user->name : 'SYSTEM',
                'activity' => $l->activity_payload
            ];
        });

        return Inertia::render('Helpdesk/DashboardAdmin', [
            'dbCases' => $cases,
            'dbUsers' => $users,
            'dbLogs' => $logs
        ]);
    }

    public function pelapor()
    {
        // Dummy pelapor login -> ID 5 (Pos Pantau Alpha)
        $cases = $this->formatTickets(Ticket::where('user_id', 5));
        
        return Inertia::render('Helpdesk/DashboardPelapor', [
            'dbCases' => $cases
        ]);
    }

    public function teknisi()
    {
        $cases = $this->formatTickets(Ticket::query());
        return Inertia::render('Helpdesk/DashboardTeknisi', [
            'dbCases' => $cases
        ]);
    }

    public function staf()
    {
        $cases = $this->formatTickets(Ticket::query());
        return Inertia::render('Helpdesk/DashboardStaf', [
            'dbCases' => $cases
        ]);
    }
}
