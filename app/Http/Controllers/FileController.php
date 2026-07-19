<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileController extends Controller
{
    /**
     * Download file dengan otorisasi berbasis role.
     *
     * Hanya user dengan role admin, staf, atau pelapor yang melaporkan
     * file tersebut yang dapat mengunduh.
     */
    public function download(Request $request, string $path): StreamedResponse
    {
        $user = $request->user();

        if (!$user || !$user->role) {
            abort(403, 'Akses ditolak.');
        }

        $userRole = strtolower($user->role->nama_role);

        // Admin dan Staf boleh download semua file
        if (in_array($userRole, ['admin', 'staf'])) {
            return $this->streamFile($path);
        }

        // Pelapor hanya boleh download file dari laporan miliknya sendiri
        if ($userRole === 'pelapor') {
            $isOwner = Report::where('user_id', $user->id)
                ->where(function ($query) use ($path) {
                    $query->where('file_bukti', 'LIKE', '%' . $path . '%')
                          ->orWhere('dokumen_anggaran', 'LIKE', '%' . $path . '%')
                          ->orWhere('file_bukti_selesai', 'LIKE', '%' . $path . '%');
                })
                ->exists();

            if ($isOwner) {
                return $this->streamFile($path);
            }
        }

        abort(403, 'Akses ditolak: Anda tidak memiliki izin untuk mengunduh file ini.');
    }

    /**
     * Stream file dari disk local (private).
     */
    private function streamFile(string $path): StreamedResponse
    {
        if (!Storage::disk('local')->exists($path)) {
            abort(404, 'File tidak ditemukan.');
        }

        return Storage::disk('local')->download($path);
    }
}
