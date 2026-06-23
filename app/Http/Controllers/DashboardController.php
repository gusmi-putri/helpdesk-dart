<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Report;
use App\Models\User;
use App\Models\Unit;
use App\Models\SystemLog;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Resources\ReportResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\UnitResource;
use App\Http\Resources\UnitMutationResource;

class DashboardController extends Controller
{
    public function exportPdf($id)
    {
        $report = Report::with(['unit', 'pelapor', 'teknisi'])->findOrFail($id);

        // Tambahkan atribut case_id secara manual untuk template
        $report->case_id = 'LPR-' . str_pad($report->id, 5, '0', STR_PAD_LEFT);

        // EYD Formatting
        $report->deskripsi_kerusakan = ucfirst(mb_strtolower(trim($report->deskripsi_kerusakan)));
        $report->catatan_teknisi = $report->catatan_teknisi ? ucfirst(mb_strtolower(trim($report->catatan_teknisi))) : null;

        // Formal Date Formatting
        $tahunAnggaran = $report->created_at->format('Y');
        $bulanList = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];
        
        $bulanMulai = $bulanList[(int)$report->created_at->format('n')];
        $tanggalMulaiText = $report->created_at->format('d') . ' ' . $bulanMulai . ' ' . $report->created_at->format('Y');
        
        if ($report->tanggal_selesai_perbaikan) {
            $tanggalSelesai = \Carbon\Carbon::parse($report->tanggal_selesai_perbaikan);
            $bulanSelesai = $bulanList[(int)$tanggalSelesai->format('n')];
            $tanggalSelesaiText = $tanggalSelesai->format('d') . ' ' . $bulanSelesai . ' ' . $tanggalSelesai->format('Y');
        } else {
            $tanggalSelesaiText = date('d') . ' ' . $bulanList[(int)date('n')] . ' ' . date('Y');
        }
        
        $tanggalTTD = date('d') . ' ' . $bulanList[(int)date('n')] . ' ' . date('Y');

        // Extract Images for Lampiran
        $images = [];
        if ($report->dokumen_anggaran) {
            $paths = json_decode($report->dokumen_anggaran, true);
            if (!is_array($paths)) $paths = [$report->dokumen_anggaran];
            
            foreach ($paths as $path) {
                $fullPath = storage_path('app/public/' . $path);
                if (file_exists($fullPath)) {
                    $type = pathinfo($fullPath, PATHINFO_EXTENSION);
                    $data = file_get_contents($fullPath);
                    $images[] = 'data:image/' . $type . ';base64,' . base64_encode($data);
                }
            }
        }

        $pdf = Pdf::loadView('pdf.bap_template', compact(
            'report', 'tahunAnggaran', 'tanggalMulaiText', 'tanggalSelesaiText', 'tanggalTTD', 'images'
        ));
        
        return $pdf->download('BAP_' . $report->case_id . '.pdf');
    }


    public function admin()
    {
        $cases = ReportResource::collection(Report::with(['unit', 'pelapor', 'teknisi'])->get());
        $users = UserResource::collection(User::with('role')->get());
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

        $units = UnitResource::collection(\App\Models\Unit::all());
        $feedbacks = \App\Models\Feedback::orderBy('created_at', 'desc')->get()->map(function($f) {
            return [
                'id' => $f->id,
                'nama_pengirim' => $f->nama_pengirim,
                'rating' => $f->rating,
                'kategori' => $f->kategori,
                'pesan' => $f->pesan,
                'status_baca' => $f->status_baca,
                'tanggal' => $f->created_at->format('d M Y, H:i')
            ];
        });

        $mutations = UnitMutationResource::collection(
            \App\Models\UnitMutation::with(['unit', 'requester', 'approver'])
                ->orderBy('created_at', 'desc')
                ->get()
        );

        $archivedUnits = UnitResource::collection(Unit::onlyTrashed()->get());

        $satuans = \App\Models\Satuan::all();

        return Inertia::render('Helpdesk/DashboardAdmin', [
            'dbCases' => $cases,
            'dbUsers' => $users,
            'dbLogs' => $logs,
            'dbRoles' => $roles,
            'dbUnits' => $units,
            'dbSatuans' => $satuans,
            'dbFeedbacks' => $feedbacks,
            'dbMutations' => $mutations,
            'dbArchivedUnits' => $archivedUnits,
        ]);
    }

    public function pelapor()
    {
        $cases = ReportResource::collection(Report::with(['unit', 'pelapor', 'teknisi'])->get());
        $units = UnitResource::collection(\App\Models\Unit::all());
        $users = UserResource::collection(User::all());

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
        $cases = ReportResource::collection(Report::with(['unit', 'pelapor', 'teknisi'])->where('teknisi_id', auth()->id())->get());
        
        return Inertia::render('Helpdesk/DashboardTeknisi', [
            'dbCases' => $cases
        ]);
    }

    public function staf()
    {
        $cases = ReportResource::collection(Report::with(['unit', 'pelapor', 'teknisi'])->get());
        
        // Ambil semua teknisi untuk ditugaskan (tetap diperlukan untuk AssignTechnicianModal)
        $technicians = UserResource::collection(User::whereHas('role', function($q) {
            $q->where('nama_role', 'Teknisi');
        })->with('reportsDitangani')->get());

        // Ambil semua users untuk data personel
        $allUsers = UserResource::collection(User::with('role')->get());

        $units = UnitResource::collection(Unit::all());

        $mutations = UnitMutationResource::collection(
            \App\Models\UnitMutation::with(['unit', 'requester', 'approver'])
                ->orderBy('created_at', 'desc')
                ->get()
        );

        $roles = \App\Models\Role::where('nama_role', '!=', 'Admin')->get()->map(function($r) {
            return [
                'id' => $r->id,
                'name' => $r->nama_role
            ];
        });

        $satuans = \App\Models\Satuan::all();

        return Inertia::render('Helpdesk/DashboardStaf', [
            'dbCases' => $cases,
            'dbUsers' => $technicians,
            'dbAllUsers' => $allUsers,
            'dbUnits' => $units,
            'dbSatuans' => $satuans,
            'dbMutations' => $mutations,
            'dbRoles' => $roles,
        ]);
    }
}
