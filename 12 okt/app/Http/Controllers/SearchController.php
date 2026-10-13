<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\User;
use App\Models\Unit;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('q');

        if (empty($query) || strlen($query) < 2) {
            return response()->json([
                'reports' => [],
                'users' => [],
                'units' => []
            ]);
        }

        $term = '%' . strtolower($query) . '%';

        // Search Reports
        $reports = Report::with(['unit', 'pelapor', 'teknisi'])
            ->where(function ($q) use ($term, $query) {
                // If it looks like a Case ID (e.g. LPR-00001)
                if (preg_match('/^LPR-(\d+)$/i', $query, $matches)) {
                    $q->where('id', (int)$matches[1]);
                } else {
                    $q->whereRaw('LOWER(deskripsi_kerusakan) LIKE ?', [$term])
                      ->orWhereRaw('LOWER(lokasi_laporan) LIKE ?', [$term])
                      ->orWhereHas('pelapor', function ($sub) use ($term) {
                          $sub->whereRaw('LOWER(nama_lengkap) LIKE ?', [$term]);
                      })
                      ->orWhereHas('unit', function ($sub) use ($term) {
                          $sub->whereRaw('LOWER(nomor_seri) LIKE ?', [$term]);
                      });
                }
            })
            ->take(5)
            ->get()
            ->map(function ($report) {
                return [
                    'id' => $report->id,
                    'caseId' => 'LPR-' . str_pad($report->id, 5, '0', STR_PAD_LEFT),
                    'title' => 'LPR-' . str_pad($report->id, 5, '0', STR_PAD_LEFT) . ' - ' . ($report->unit->jenis ?? 'Unknown'),
                    'subtitle' => substr($report->deskripsi_kerusakan, 0, 50) . '...',
                    'status' => $report->status_laporan,
                    'type' => 'report'
                ];
            });

        // Search Users
        $users = User::with('satuan')
            ->where(function ($q) use ($term) {
                $q->whereRaw('LOWER(nama_lengkap) LIKE ?', [$term])
                  ->orWhereRaw('LOWER(username) LIKE ?', [$term])
                  ->orWhereRaw('LOWER(nrp_nip) LIKE ?', [$term])
                  ->orWhereHas('satuan', function ($sub) use ($term) {
                      $sub->whereRaw('LOWER(nama_satuan) LIKE ?', [$term])
                          ->orWhereRaw('LOWER(kode_satuan) LIKE ?', [$term]);
                  });
            })
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'title' => $user->nama_lengkap,
                    'subtitle' => $user->nrp_nip . ' - ' . ($user->satuan->nama_satuan ?? $user->asal_satuan),
                    'type' => 'user'
                ];
            });

        // Search Units
        $units = Unit::with('satuan')
            ->where(function ($q) use ($term) {
                $q->whereRaw('LOWER(nomor_seri) LIKE ?', [$term])
                  ->orWhereRaw('LOWER(jenis) LIKE ?', [$term])
                  ->orWhereHas('satuan', function ($sub) use ($term) {
                      $sub->whereRaw('LOWER(nama_satuan) LIKE ?', [$term])
                          ->orWhereRaw('LOWER(kode_satuan) LIKE ?', [$term]);
                  });
            })
            ->take(5)
            ->get()
            ->map(function ($unit) {
                return [
                    'id' => $unit->id,
                    'title' => $unit->nomor_seri,
                    'subtitle' => $unit->jenis . ' ' . $unit->merk . ' - ' . ($unit->satuan->nama_satuan ?? 'Unknown'),
                    'type' => 'unit'
                ];
            });

        return response()->json([
            'reports' => $reports,
            'users' => $users,
            'units' => $units
        ]);
    }
}
