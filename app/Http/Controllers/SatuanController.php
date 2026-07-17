<?php

namespace App\Http\Controllers;

use App\Models\Satuan;
use App\Models\SystemLog;
use Illuminate\Http\Request;

class SatuanController extends Controller
{
    public function index()
    {
        // Only return verified satuans for the dropdown list (API)
        return response()->json(Satuan::where('is_verified', true)->orderBy('nama_satuan', 'asc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'kode_satuan' => 'nullable|string|max:50',
            'nama_satuan' => 'required|string|max:100|unique:satuans,nama_satuan',
            'alamat' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $user = auth()->user();

        if (!$user) {
            $satuan = Satuan::create([
                'nama_satuan' => strtoupper($request->nama_satuan),
                'is_verified' => false,
                'pending_action' => 'create',
                'latitude' => null,
                'longitude' => null,
            ]);
            return response()->json($satuan, 201);
        }

        $isAdmin = $user->role?->nama_role === 'Admin';
        $isStaf = $user->role?->nama_role === 'Staf';

        if (!$isAdmin && !$isStaf) {
            abort(403, 'Akses ditolak: Hanya Admin atau Staf yang dapat mengajukan Satuan Kerja baru.');
        }

        if ($isAdmin) {
            $satuan = Satuan::create([
                'kode_satuan' => $request->kode_satuan,
                'nama_satuan' => strtoupper($request->nama_satuan),
                'alamat' => $request->alamat,
                'is_verified' => true,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
            ]);
            SystemLog::log('INFO', $user->id, "Admin menambahkan Satuan Kerja: {$request->nama_satuan}");
            return redirect()->back()->with('message', 'Satuan Kerja berhasil ditambahkan.');
        } else {
            // Staf
            $satuan = Satuan::create([
                'kode_satuan' => $request->kode_satuan,
                'nama_satuan' => strtoupper($request->nama_satuan),
                'alamat' => $request->alamat,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'is_verified' => false,
                'pending_action' => 'create',
                'pending_changes' => [
                    'kode_satuan' => $request->kode_satuan,
                    'alamat' => $request->alamat,
                    'latitude' => $request->latitude,
                    'longitude' => $request->longitude,
                ]
            ]);
            SystemLog::log('INFO', $user->id, "Staf mengajukan penambahan Satuan Kerja: {$request->nama_satuan}");
            return redirect()->back()->with('message', 'Pengajuan Satuan Kerja berhasil dikirim. Menunggu persetujuan Admin.');
        }
    }

    public function update(Request $request, Satuan $satuan)
    {
        $request->validate([
            'kode_satuan' => 'nullable|string|max:50',
            'nama_satuan' => 'sometimes|string|max:100|unique:satuans,nama_satuan,' . $satuan->id,
            'alamat' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $user = auth()->user();
        $isAdmin = $user->role?->nama_role === 'Admin';

        $updateData = [
            'kode_satuan' => $request->input('kode_satuan'),
            'nama_satuan' => strtoupper($request->input('nama_satuan')),
            'alamat' => $request->input('alamat'),
            'latitude' => $request->input('latitude'),
            'longitude' => $request->input('longitude'),
        ];

        if ($isAdmin) {
            $updateData['is_verified'] = true;
            $updateData['pending_action'] = null;
            $updateData['pending_changes'] = null;
            $satuan->update($updateData);
            SystemLog::log('INFO', $user->id, "Admin memperbarui Satuan Kerja: {$satuan->nama_satuan}");
            return redirect()->back()->with('message', 'Satuan Kerja berhasil diperbarui.');
        } else {
            $satuan->update([
                'pending_action' => 'edit',
                'pending_changes' => $updateData
            ]);
            SystemLog::log('INFO', $user->id, "Staf mengajukan pembaruan Satuan Kerja: {$satuan->nama_satuan}");
            return redirect()->back()->with('message', 'Pengajuan pembaruan Satuan Kerja berhasil dikirim.');
        }
    }

    public function destroy(Satuan $satuan)
    {
        $user = auth()->user();
        $isAdmin = $user->role?->nama_role === 'Admin';

        if ($isAdmin) {
            $info = $satuan->nama_satuan;
            $satuan->delete();
            SystemLog::log('ALERT', $user->id, "Admin menghapus Satuan Kerja: {$info}");
            return redirect()->back()->with('message', 'Satuan Kerja berhasil dihapus.');
        } else {
            $satuan->update([
                'pending_action' => 'delete'
            ]);
            SystemLog::log('INFO', $user->id, "Staf mengajukan penghapusan Satuan Kerja: {$satuan->nama_satuan}");
            return redirect()->back()->with('message', 'Pengajuan penghapusan Satuan Kerja berhasil dikirim.');
        }
    }

    public function approve(Satuan $satuan)
    {
        $user = auth()->user();
        if ($satuan->pending_action === 'create') {
            $changes = $satuan->pending_changes ?? [];
            $satuan->update([
                'is_verified' => true,
                'pending_action' => null,
                'pending_changes' => null,
                'latitude' => $changes['latitude'] ?? $satuan->latitude,
                'longitude' => $changes['longitude'] ?? $satuan->longitude,
            ]);
            SystemLog::log('INFO', $user->id, "Admin menyetujui penambahan Satuan Kerja: {$satuan->nama_satuan}");
        } elseif ($satuan->pending_action === 'edit') {
            $changes = $satuan->pending_changes ?? [];
            $satuan->update(array_merge($changes, [
                'is_verified' => true,
                'pending_action' => null,
                'pending_changes' => null
            ]));
            SystemLog::log('INFO', $user->id, "Admin menyetujui pembaruan Satuan Kerja: {$satuan->nama_satuan}");
        } elseif ($satuan->pending_action === 'delete') {
            $info = $satuan->nama_satuan;
            $satuan->delete();
            SystemLog::log('ALERT', $user->id, "Admin menyetujui penghapusan Satuan Kerja: {$info}");
        }

        return redirect()->back()->with('message', 'Pengajuan Satuan Kerja disetujui.');
    }

    public function reject(Satuan $satuan)
    {
        $user = auth()->user();
        if ($satuan->pending_action === 'create') {
            $info = $satuan->nama_satuan;
            
            // Cascading Reject: Tolak pendaftaran pengguna yang terkait dengan satuan ini
            $pendingUsers = \App\Models\User::where('satuan_id', $satuan->id)->where('is_approved', false)->get();
            foreach ($pendingUsers as $pUser) {
                SystemLog::log('WARN', $user->id, "Sistem otomatis menolak pendaftaran personel baru: {$pUser->nama_lengkap} (karena Satuan ditolak)");
                $pUser->delete();
            }

            $satuan->delete();
            SystemLog::log('INFO', $user->id, "Admin menolak penambahan Satuan Kerja: {$info}");
        } else {
            $satuan->update([
                'pending_action' => null,
                'pending_changes' => null
            ]);
            SystemLog::log('INFO', $user->id, "Admin menolak pengajuan perubahan Satuan Kerja: {$satuan->nama_satuan}");
        }
        return redirect()->back()->with('message', 'Pengajuan Satuan Kerja ditolak.');
    }
}
