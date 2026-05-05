<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Report;
use App\Models\User;
use App\Models\SystemLog;
use Barryvdh\DomPDF\Facade\Pdf;

class DashboardController extends Controller
{
    public function exportPdf($id)
    {
        $report = Report::with(['unit', 'pelapor', 'teknisi'])->findOrFail($id);

        // Tambahkan atribut case_id secara manual untuk template
        $report->case_id = 'LPR-' . str_pad($report->id, 5, '0', STR_PAD_LEFT);

        $pdf = Pdf::loadView('pdf.bap_template', compact('report'));
        
        return $pdf->download('BAP_' . $report->case_id . '.pdf');
    }
    private function formatReports($query)
    {
        return $query->with(['unit', 'pelapor', 'teknisi'])->get()->map(function ($report) {
            return [
                'caseId' => 'LPR-' . str_pad($report->id, 5, '0', STR_PAD_LEFT),
                'db_id' => $report->id,
                'status' => strtoupper($report->status_laporan),
                'kerusakan' => [
                    'tanggal' => $report->tanggal_lapor ? $report->tanggal_lapor->format('d F Y, H:i') : '-',
                    'pelapor_id' => $report->user_id,
                    'pelapor' => $report->pelapor ? $report->pelapor->nama_lengkap : 'Unknown',
                    'lokasi' => $report->lokasi_laporan ?? ($report->unit ? $report->unit->asal_satuan : 'Unknown'),
                    'barangRusak' => $report->unit ? $report->unit->nama_dart : 'Hardware Anonim',
                    'deskripsi' => $report->deskripsi_kerusakan,
                    'klasifikasi' => $report->klasifikasi ?? ($report->tingkat_kerusakan ?? 'RINGAN'),
                    'tingkatKerusakan' => $report->tingkat_kerusakan ?? ($report->klasifikasi ?? '-'),
                    'urgensi' => $report->urgensi ?? '-',
                    'foto_bukti' => $report->file_bukti && !json_decode($report->file_bukti) ? asset('storage/reports/' . $report->file_bukti) : null,
                    'fileBukti' => $report->file_bukti ? collect(json_decode($report->file_bukti, true) ?? [])->map(fn($path) => asset('storage/' . $path))->toArray() : [],
                ],
                'perbaikan' => [
                    'teknisi_id' => $report->teknisi_id,
                    'teknisi' => $report->teknisi ? $report->teknisi->nama_lengkap : null,
                    'tanggalPenanganan' => $report->tgl_ditunjuk ? $report->tgl_ditunjuk->format('d F Y, H:i') : null,
                    'tanggalSelesai' => $report->tgl_selesai ? $report->tgl_selesai->format('d F Y, H:i') : null,
                    'tindakan' => $report->catatan_teknisi,
                    'metodePerbaikan' => $report->metode_perbaikan, 
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

        // Kirim data profil user yang sedang login untuk auto-fill form
        $auth = auth()->user();
        $authUser = $auth ? [
            'id' => $auth->id,
            'username' => $auth->username,
            'nama_lengkap' => $auth->nama_lengkap,
            'nrp_nip' => $auth->nrp_nip ?? '',
            'asal_satuan' => $auth->asal_satuan ?? '',
            'no_wa' => $auth->no_wa ?? '',
        ] : null;
        
        return Inertia::render('Helpdesk/DashboardPelapor', [
            'dbCases' => $cases,
            'dbUnits' => $units,
            'dbUsers' => $users,
            'authUser' => $authUser,
        ]);
    }

    public function teknisi()
    {
        // Teknisi hanya melihat tugas yang diberikan kepadanya
        $cases = $this->formatReports(Report::where('teknisi_id', auth()->id()));
        
        return Inertia::render('Helpdesk/DashboardTeknisi', [
            'dbCases' => $cases
        ]);
    }

    public function staf()
    {
        $cases = $this->formatReports(Report::query());
        
        // Hanya ambil teknisi yang tidak sedang memegang laporan status 'Proses'
        $technicians = User::whereHas('role', function($q) {
            $q->where('nama_role', 'Teknisi');
        })->whereDoesntHave('reportsDitangani', function($q) {
            $q->where('status_laporan', 'Proses');
        })->get()->map(function($u) {
            return [
                'id' => $u->id,
                'name' => $u->nama_lengkap,
                'username' => $u->username,
                'spesialisasi' => $u->spesialisasi
            ];
        });

        return Inertia::render('Helpdesk/DashboardStaf', [
            'dbCases' => $cases,
            'dbUsers' => $technicians
        ]);
    }
}
