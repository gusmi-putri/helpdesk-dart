<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Report;
use App\Models\User;
use App\Models\SystemLog;

class DashboardController extends Controller
{
    private function formatReports($query)
    {
        return $query->with(['unit', 'pelapor', 'teknisi'])->get()->map(function ($report) {
            return [
                'caseId' => 'DRT-' . str_pad($report->id, 5, '0', STR_PAD_LEFT),
                'db_id' => $report->id,
                'status' => strtoupper($report->status_laporan),
                'kerusakan' => [
                    'tanggal' => $report->tanggal_lapor ? $report->tanggal_lapor->format('d F Y, H:i') : '-',
                    'pelapor' => $report->pelapor ? $report->pelapor->nama_lengkap : 'Unknown',
                    'lokasi' => $report->unit ? $report->unit->asal_satuan : 'Unknown',
                    'barangRusak' => $report->unit ? $report->unit->nama_dart : 'Hardware Anonim',
                    'deskripsi' => $report->deskripsi_kerusakan,
                ],
                'perbaikan' => [
                    'teknisi_id' => $report->teknisi_id,
                    'teknisi' => $report->teknisi ? $report->teknisi->nama_lengkap : null,
                    'tanggalPenanganan' => $report->tgl_ditunjuk ? $report->tgl_ditunjuk->format('d F Y, H:i') : null,
                    'tindakan' => $report->catatan_teknisi,
                    'sukuCadang' => null, 
                    'statusPerbaikan' => $report->status_laporan === 'Selesai' ? 'TUNTAS' : ($report->status_laporan === 'Proses' ? 'DIKERJAKAN' : 'MENUNGGU'),
                ]
            ];
        });
    }

    public function admin()
    {
        $cases = $this->formatReports(Report::query());
        $users = User::with('role')->get()->map(function($u) {
            return [
                'db_id' => $u->id,
                'id' => 'USR-'.str_pad($u->id, 3, '0', STR_PAD_LEFT),
                'name' => $u->nama_lengkap,
                'username' => $u->username,
                'nrp_nip' => $u->nrp_nip,
                'no_wa' => $u->no_wa,
                'asal_satuan' => $u->asal_satuan,
                'spesialisasi' => $u->spesialisasi,
                'role' => $u->role ? $u->role->nama_role : 'No Role',
                'role_id' => $u->role_id,
                'status' => 'Aktif',
                'lastLogin' => 'Baru saja'
            ];
        });
        $logs = SystemLog::with('user')->get()->map(function($l) {
            return [
                'id' => $l->id,
                'time' => $l->created_at->format('Y-m-d H:i:s'),
                'level' => $l->level,
                'user' => $l->user ? $l->user->nama_lengkap : 'SYSTEM',
                'activity' => $l->activity_payload
            ];
        });

        $roles = \App\Models\Role::where('nama_role', '!=', 'Admin')->get()->map(function($r) {
            return [
                'id' => $r->id,
                'name' => $r->nama_role
            ];
        });

        return Inertia::render('Helpdesk/DashboardAdmin', [
            'dbCases' => $cases,
            'dbUsers' => $users,
            'dbLogs' => $logs,
            'dbRoles' => $roles
        ]);
    }

    public function pelapor()
    {
        $cases = $this->formatReports(Report::query());
        $units = \App\Models\Unit::all();
        $users = User::all()->map(function($u) {
            return [
                'db_id' => $u->id,
                'username' => $u->username,
                'name' => $u->nama_lengkap
            ];
        });
        
        return Inertia::render('Helpdesk/DashboardPelapor', [
            'dbCases' => $cases,
            'dbUnits' => $units,
            'dbUsers' => $users
        ]);
    }

    public function teknisi()
    {
        $cases = $this->formatReports(Report::query());
        return Inertia::render('Helpdesk/DashboardTeknisi', [
            'dbCases' => $cases
        ]);
    }

    public function staf()
    {
        $cases = $this->formatReports(Report::query());
        $technicians = User::whereHas('role', function($q) {
            $q->where('nama_role', 'Teknisi');
        })->get()->map(function($u) {
            return [
                'id' => $u->id,
                'name' => $u->nama_lengkap,
                'username' => $u->username
            ];
        });

        return Inertia::render('Helpdesk/DashboardStaf', [
            'dbCases' => $cases,
            'dbUsers' => $technicians
        ]);
    }
}
