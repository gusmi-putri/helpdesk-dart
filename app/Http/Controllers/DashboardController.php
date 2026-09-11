<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Report;
use App\Models\User;
use App\Models\Unit;
use App\Models\SystemLog;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\UnitMutation;
use App\Models\Satuan;
use App\Models\UserMutation;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Resources\ReportResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\UnitResource;
use App\Http\Resources\UnitMutationResource;
use App\Http\Resources\UserMutationResource;

class DashboardController extends Controller
{
    public function exportPdf($id)
    {
        $report = Report::with(['unit', 'pelapor', 'teknisi'])->findOrFail($id);

        $user = auth()->user();
        $roleName = $user->roles->first() ? $user->roles->first()->name : '';

        if ($roleName === 'Pelapor') {
            if ($report->pelapor && $report->pelapor->satuan_id !== $user->satuan_id) {
                abort(403, 'Akses Ditolak: Laporan ini bukan milik Satuan Kerja Anda.');
            }
        } elseif ($roleName === 'Teknisi') {
            if ($report->teknisi_id !== $user->id) {
                abort(403, 'Akses Ditolak: Anda tidak ditugaskan untuk laporan ini.');
            }
        }

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
            $tanggalSelesai = Carbon::parse($report->tanggal_selesai_perbaikan);
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
                    $type = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
                    if (in_array($type, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                        $data = file_get_contents($fullPath);
                        $images[] = 'data:image/' . $type . ';base64,' . base64_encode($data);
                    }
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
        return Inertia::render('Helpdesk/DashboardAdmin', [
            'dbCases' => Inertia::defer(fn () => ReportResource::collection(Report::with(['unit.satuan', 'pelapor.satuan', 'teknisi'])->orderBy('created_at', 'desc')->take(2000)->get())),
            'dbUsers' => Inertia::defer(fn () => UserResource::collection(User::with(['roles', 'permissions', 'satuan'])->take(2000)->get())),
            'dbLogs' => Inertia::defer(fn () => SystemLog::with('user')->orderBy('created_at', 'desc')->take(1000)->get()->map(function($l) {
                return [
                    'id' => $l->id,
                    'time' => $l->created_at->format('Y-m-d H:i:s'),
                    'level' => $l->level,
                    'user' => $l->user ? $l->user->nama_lengkap : 'SYSTEM',
                    'activity' => $l->activity_payload
                ];
            })),
            'dbRoles' => Inertia::defer(fn () => Role::with('permissions')->withCount('users')->get()->map(function($r) {
                return [
                    'id' => $r->id,
                    'name' => $r->name,
                    'permissions' => $r->permissions->pluck('name'),
                    'users_count' => $r->users_count
                ];
            })),
            'dbPermissions' => Inertia::defer(fn () => Permission::all()->map(function($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name
                ];
            })),
            'dbUnits' => Inertia::defer(fn () => UnitResource::collection(Unit::with('satuan')->orderBy('created_at', 'desc')->take(3000)->get())),
            'dbSatuans' => Inertia::defer(fn () => Satuan::all()),
            'dbMutations' => Inertia::defer(fn () => UnitMutationResource::collection(
                UnitMutation::with(['unit', 'requester', 'approver'])
                    ->orderBy('created_at', 'desc')
                    ->take(500)
                    ->get()
            )),
            'dbUserMutations' => Inertia::defer(fn () => UserMutationResource::collection(
                UserMutation::with(['targetUser', 'requester', 'approver'])
                    ->orderBy('created_at', 'desc')
                    ->take(500)
                    ->get()
            )),
            'dbArchivedUnits' => Inertia::defer(fn () => UnitResource::collection(Unit::with('satuan')->onlyTrashed()->orderBy('deleted_at', 'desc')->take(1000)->get())),
        ]);
    }

    public function pelapor()
    {
        $auth = auth()->user();

        // Kirim data profil user yang sedang login untuk auto-fill form (Tidak perlu di-defer karena sangat ringan)
        $authUser = $auth ? [
            'id' => $auth->id,
            'username' => $auth->username,
            'nama_lengkap' => $auth->nama_lengkap,
            'nrp_nip' => $auth->nrp_nip ?? '',
            'asal_satuan' => $auth->asal_satuan ?? '',
            'satuan_id' => $auth->satuan_id,
            'satuan' => $auth->satuan,
            'no_wa' => $auth->no_wa ?? '',
        ] : null;
        
        return Inertia::render('Helpdesk/DashboardPelapor', [
            'dbCases' => Inertia::defer(fn () => ReportResource::collection(Report::with(['unit.satuan', 'pelapor', 'teknisi'])
                ->whereHas('unit', function($q) use ($auth) {
                    if ($auth->satuan_id) {
                        $q->where('satuan_id', $auth->satuan_id);
                    }
                })->orderBy('created_at', 'desc')->take(2000)->get())),
            'dbUnits' => Inertia::defer(fn () => UnitResource::collection(Unit::with('satuan')
                ->orderBy('created_at', 'desc')->take(2000)->get())),
            'dbUsers' => Inertia::defer(fn () => UserResource::collection(User::with('satuan')
                ->where(function($q) use ($auth) {
                    if ($auth->satuan_id) {
                        $q->where('satuan_id', $auth->satuan_id);
                    }
                })->take(1000)->get())),
            'authUser' => $authUser,
        ]);
    }

    public function teknisi()
    {
        // Teknisi hanya melihat tugas yang diberikan kepadanya
        return Inertia::render('Helpdesk/DashboardTeknisi', [
            'dbCases' => Inertia::defer(fn () => ReportResource::collection(Report::with(['unit.satuan', 'pelapor', 'teknisi'])->where('teknisi_id', auth()->id())->orderBy('created_at', 'desc')->take(2000)->get()))
        ]);
    }

    public function staf()
    {
        return Inertia::render('Helpdesk/DashboardStaf', [
            'dbCases' => Inertia::defer(fn () => ReportResource::collection(Report::with(['unit.satuan', 'pelapor', 'teknisi'])->orderBy('created_at', 'desc')->take(2000)->get())),
            'technicians' => Inertia::defer(fn () => UserResource::collection(User::role('Teknisi')->with('reportsDitangani')->take(500)->get())),
            'dbUsers' => Inertia::defer(fn () => UserResource::collection(User::with(['roles', 'permissions', 'satuan'])->take(2000)->get())),
            'dbUnits' => Inertia::defer(fn () => UnitResource::collection(Unit::with('satuan')->orderBy('created_at', 'desc')->take(3000)->get())),
            'dbMutations' => Inertia::defer(fn () => UnitMutationResource::collection(
                UnitMutation::with(['unit', 'requester', 'approver'])
                    ->orderBy('created_at', 'desc')
                    ->take(500)
                    ->get()
            )),
            'dbRoles' => Inertia::defer(fn () => Role::withCount('users')->get()->map(function($r) {
                return [
                    'id' => $r->id,
                    'name' => $r->name,
                    'users_count' => $r->users_count
                ];
            })),
            'dbPermissions' => Inertia::defer(fn () => Permission::all()->map(function($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name
                ];
            })),
            'dbSatuans' => Inertia::defer(fn () => Satuan::all()),
            'dbUserMutations' => Inertia::defer(fn () => UserMutationResource::collection(
                UserMutation::with(['targetUser', 'requester', 'approver'])
                    ->orderBy('created_at', 'desc')
                    ->take(500)
                    ->get()
            )),
        ]);
    }
}
