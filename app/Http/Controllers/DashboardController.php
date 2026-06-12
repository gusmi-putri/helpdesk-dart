<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Report;
use App\Models\User;
use App\Models\Unit;
use App\Models\SystemLog;
use Barryvdh\DomPDF\Facade\Pdf;

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

        $pdf = Pdf::loadView('pdf.bap_template', compact('report'));
        
        return $pdf->download('BAP_' . $report->case_id . '.pdf');
    }
    private function formatReports($query)
    {
        return $query->with(['unit', 'pelapor', 'teknisi'])->get()->map(function ($report) {
            $dokumenAnggaran = $report->dokumen_anggaran
                ? collect(json_decode($report->dokumen_anggaran, true) ?? [$report->dokumen_anggaran])
                    ->map(fn($path) => asset('storage/' . $path))
                    ->toArray()
                : [];

            return [
                'caseId' => 'LPR-' . str_pad($report->id, 5, '0', STR_PAD_LEFT),
                'db_id' => $report->id,
                'unit_id' => $report->unit_id,
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
                    'jenisPerbaikan' => $report->jenis_perbaikan ?? 'Swadaya',
                    'dokumenAnggaran' => $dokumenAnggaran,
                    'keteranganAnggaran' => $report->keterangan_anggaran,
                    'foto_bukti' => $report->file_bukti && !json_decode($report->file_bukti) ? asset('storage/reports/' . $report->file_bukti) : null,
                    'fileBukti' => $report->file_bukti ? collect(json_decode($report->file_bukti, true) ?? [])->map(fn($path) => asset('storage/' . $path))->toArray() : [],
                ],
                'perbaikan' => [
                    'teknisi_id' => $report->teknisi_id,
                    'teknisi' => $report->teknisi ? $report->teknisi->nama_lengkap : null,
                    'teknisi_wa' => $report->teknisi ? $report->teknisi->no_wa : null,
                    'tanggalPenanganan' => $report->tgl_ditunjuk ? $report->tgl_ditunjuk->format('d F Y, H:i') : null,
                    'tanggalSelesai' => $report->tgl_selesai ? $report->tgl_selesai->format('d F Y, H:i') : null,
                    'tindakan' => $report->catatan_teknisi,
                    'metodePerbaikan' => $report->metode_perbaikan, 
                    'foto_bukti_selesai' => $report->file_bukti_selesai ? asset('storage/reports/' . $report->file_bukti_selesai) : null,
                    'video_bukti_selesai' => $report->file_bukti_selesai_video ? asset('storage/reports/' . $report->file_bukti_selesai_video) : null,
                    'alasanPenolakan' => $report->alasan_penolakan,
                    'statusPerbaikan' => strtoupper($report->status_laporan),
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
                'email' => $u->email,
                'nrp_nip' => $u->nrp_nip,
                'no_wa' => $u->no_wa,
                'asal_satuan' => $u->asal_satuan,
                'spesialisasi' => $u->spesialisasi,
                'is_approved' => $u->is_approved,
                'role' => $u->role ? $u->role->nama_role : 'No Role',
                'role_id' => $u->role_id,
                'is_active' => $u->is_active,
                'status' => !$u->is_approved ? 'Menunggu' : ($u->is_active ? 'Aktif' : 'Nonaktif'),
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

        $units = \App\Models\Unit::all()->map(function($u) {
            return [
                'db_id' => $u->id,
                'nomor_seri' => $u->nomor_seri,
                'nama_dart' => $u->nama_dart,
                'jenis_dart' => $u->jenis_dart,
                'asal_satuan' => $u->asal_satuan,
                'status_unit' => $u->status_unit,
                'last_maintenance' => $u->updated_at->format('d M Y')
            ];
        });
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

        $mutations = \App\Models\UnitMutation::with(['unit', 'requester', 'approver'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($m) {
                return [
                    'id' => $m->id,
                    'unit_id' => $m->unit_id,
                    'type' => $m->type,
                    'reason' => $m->reason,
                    'document_path' => $m->document_path ? asset('storage/' . $m->document_path) : null,
                    'requested_by' => $m->requester ? $m->requester->nama_lengkap : 'Unknown',
                    'requested_by_id' => $m->requested_by,
                    'approved_by' => $m->approver ? $m->approver->nama_lengkap : null,
                    'status' => $m->status,
                    'admin_notes' => $m->admin_notes,
                    'unit_data' => $m->unit_data,
                    'created_at' => $m->created_at->format('d M Y, H:i'),
                    'updated_at' => $m->updated_at->format('d M Y, H:i'),
                ];
            });

        $archivedUnits = Unit::onlyTrashed()->get()->map(function($u) {
            return [
                'db_id' => $u->id,
                'nomor_seri' => $u->nomor_seri,
                'nama_dart' => $u->nama_dart,
                'jenis_dart' => $u->jenis_dart,
                'asal_satuan' => $u->asal_satuan,
                'status_unit' => $u->status_unit,
                'deleted_at' => $u->deleted_at->format('d M Y, H:i'),
            ];
        });

        return Inertia::render('Helpdesk/DashboardAdmin', [
            'dbCases' => $cases,
            'dbUsers' => $users,
            'dbLogs' => $logs,
            'dbRoles' => $roles,
            'dbUnits' => $units,
            'dbFeedbacks' => $feedbacks,
            'dbMutations' => $mutations,
            'dbArchivedUnits' => $archivedUnits,
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
                'email' => $u->email,
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
        
        // Ambil semua teknisi untuk ditugaskan (tetap diperlukan untuk AssignTechnicianModal)
        $technicians = User::whereHas('role', function($q) {
            $q->where('nama_role', 'Teknisi');
        })->with('reportsDitangani')->get()->map(function($u) {
            return [
                'id' => $u->id,
                'name' => $u->nama_lengkap,
                'username' => $u->username,
                'spesialisasi' => $u->spesialisasi,
                'tasksReceived' => $u->reportsDitangani->count(),
                'tasksInProgress' => $u->reportsDitangani->whereIn('status_laporan', ['Diterima Teknisi', 'Diproses'])->count()
            ];
        });

        // Ambil semua users untuk data personel
        $allUsers = User::with('role')->get()->map(function($u) {
            return [
                'db_id' => $u->id,
                'id' => 'USR-'.str_pad($u->id, 3, '0', STR_PAD_LEFT),
                'name' => $u->nama_lengkap,
                'username' => $u->username,
                'email' => $u->email,
                'nrp_nip' => $u->nrp_nip,
                'no_wa' => $u->no_wa,
                'asal_satuan' => $u->asal_satuan,
                'spesialisasi' => $u->spesialisasi,
                'is_approved' => $u->is_approved,
                'role' => $u->role ? $u->role->nama_role : 'No Role',
                'role_id' => $u->role_id,
                'is_active' => $u->is_active,
                'status' => !$u->is_approved ? 'Menunggu' : ($u->is_active ? 'Aktif' : 'Nonaktif'),
                'lastLogin' => 'Baru saja'
            ];
        });

        $units = Unit::all()->map(function($u) {
            return [
                'db_id' => $u->id,
                'nomor_seri' => $u->nomor_seri,
                'nama_dart' => $u->nama_dart,
                'jenis_dart' => $u->jenis_dart,
                'asal_satuan' => $u->asal_satuan,
                'status_unit' => $u->status_unit,
                'last_maintenance' => $u->updated_at->format('d/m/Y'),
            ];
        });

        $mutations = \App\Models\UnitMutation::with(['unit', 'requester', 'approver'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($m) {
                return [
                    'id' => $m->id,
                    'unit_id' => $m->unit_id,
                    'type' => $m->type,
                    'reason' => $m->reason,
                    'document_path' => $m->document_path ? asset('storage/' . $m->document_path) : null,
                    'requested_by' => $m->requester ? $m->requester->nama_lengkap : 'Unknown',
                    'requested_by_id' => $m->requested_by,
                    'approved_by' => $m->approver ? $m->approver->nama_lengkap : null,
                    'status' => $m->status,
                    'admin_notes' => $m->admin_notes,
                    'unit_data' => $m->unit_data,
                    'created_at' => $m->created_at->format('d M Y, H:i'),
                    'updated_at' => $m->updated_at->format('d M Y, H:i'),
                ];
            });

        $roles = \App\Models\Role::where('nama_role', '!=', 'Admin')->get()->map(function($r) {
            return [
                'id' => $r->id,
                'name' => $r->nama_role
            ];
        });

        return Inertia::render('Helpdesk/DashboardStaf', [
            'dbCases' => $cases,
            'dbUsers' => $technicians,
            'dbAllUsers' => $allUsers,
            'dbUnits' => $units,
            'dbMutations' => $mutations,
            'dbRoles' => $roles,
        ]);
    }
}
