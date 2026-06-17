<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $adminRoleId = \App\Models\Role::where('nama_role', 'Admin')->first()?->id;

        $request->validate([
            'username' => 'required|string|max:50|unique:users',
            'password' => 'required|string|min:8',
            'nama_lengkap' => 'required|string|max:100',
            'nrp_nip' => 'required|string|min:8|max:50',
            'role_id' => ['required', 'exists:roles,id', 'not_in:' . $adminRoleId],
            'asal_satuan' => 'nullable|string|max:100',
            'no_wa' => 'nullable|string|max:20',
            'spesialisasi' => 'nullable|string|max:100',
        ]);

        User::create([
            'username' => $request->username,
            'password' => bcrypt($request->password),
            'nama_lengkap' => $request->nama_lengkap,
            'nrp_nip' => $request->nrp_nip,
            'role_id' => $request->role_id,
            'asal_satuan' => $request->asal_satuan,
            'no_wa' => $request->no_wa,
            'spesialisasi' => $request->spesialisasi,
            'is_approved' => false, // Requires admin approval
        ]);

        $admin = auth()->user();
        \App\Models\SystemLog::log('INFO', $admin->id, "Mendaftarkan personel baru: {$request->nama_lengkap} ({$request->username}) (Menunggu Persetujuan)");

        return redirect()->back()->with('message', 'Personel baru berhasil didaftarkan dan sedang menunggu persetujuan Admin.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $adminRoleId = \App\Models\Role::where('nama_role', 'Admin')->first()?->id;

        $rules = [
            'nama_lengkap' => 'required|string|max:100',
            'nrp_nip' => 'required|string|min:8|max:50',
            'asal_satuan' => 'nullable|string|max:100',
            'no_wa' => 'nullable|string|max:20',
            'spesialisasi' => 'nullable|string|max:100',
        ];

        if ($user->role_id !== $adminRoleId) {
            $rules['role_id'] = ['required', 'exists:roles,id', 'not_in:' . $adminRoleId];
        }

        $request->validate($rules);

        $updateData = $request->only('nama_lengkap', 'nrp_nip', 'asal_satuan', 'no_wa', 'spesialisasi');
        if ($user->role_id !== $adminRoleId) {
            $updateData['role_id'] = $request->role_id;
        }

        $user->update([
            'pending_action' => 'edit',
            'pending_changes' => $updateData
        ]);

        $admin = auth()->user();
        \App\Models\SystemLog::log('INFO', $admin->id, "Mengajukan edit data personel: {$user->nama_lengkap}");

        return redirect()->back()->with('message', 'Pengajuan edit data personel telah dikirim ke Admin untuk disetujui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->update([
            'pending_action' => 'delete'
        ]);

        $admin = auth()->user();
        \App\Models\SystemLog::log('INFO', $admin->id, "Mengajukan penghapusan personel: {$user->nama_lengkap}");

        return redirect()->back()->with('message', 'Pengajuan hapus personel telah dikirim ke Admin untuk disetujui.');
    }

    public function toggleStatus(string $id)
    {
        $user = User::findOrFail($id);
        $user->is_active = !$user->is_active;
        $user->save();

        $statusStr = $user->is_active ? 'AKTIF' : 'NONAKTIF';
        $admin = auth()->user();
        \App\Models\SystemLog::log('WARN', $admin->id, "Mengubah status personel {$user->nama_lengkap} menjadi {$statusStr}");

        return redirect()->back()->with('message', "Status personel berhasil diubah menjadi {$statusStr}.");
    }

    public function approve(string $id)
    {
        $user = User::findOrFail($id);
        $admin = auth()->user();

        if ($user->pending_action === 'edit') {
            $updateData = $user->pending_changes ?? [];
            $updateData['pending_action'] = null;
            $updateData['pending_changes'] = null;
            $user->update($updateData);
            \App\Models\SystemLog::log('SUCCESS', $admin->id, "Menyetujui perubahan data personel: {$user->nama_lengkap}");
            $msg = 'Perubahan profil personel telah disetujui.';
        } elseif ($user->pending_action === 'delete') {
            $userName = $user->nama_lengkap;
            $user->delete();
            \App\Models\SystemLog::log('ALERT', $admin->id, "Menyetujui penghapusan personel: {$userName}");
            $msg = 'Penghapusan personel telah disetujui.';
        } else {
            $user->update(['is_approved' => true]);
            \App\Models\SystemLog::log('SUCCESS', $admin->id, "Menyetujui pendaftaran personel baru: {$user->nama_lengkap}");
            $msg = 'Personel telah disetujui dan sekarang dapat login.';
        }

        return redirect()->back()->with('message', $msg);
    }

    public function reject(string $id)
    {
        $user = User::findOrFail($id);
        $admin = auth()->user();

        if ($user->pending_action === 'edit' || $user->pending_action === 'delete') {
            $action = $user->pending_action;
            $user->update([
                'pending_action' => null,
                'pending_changes' => null
            ]);
            \App\Models\SystemLog::log('WARN', $admin->id, "Menolak pengajuan {$action} personel: {$user->nama_lengkap}");
            $msg = "Pengajuan {$action} personel telah ditolak.";
        } else {
            $userName = $user->nama_lengkap;
            $user->delete();
            \App\Models\SystemLog::log('WARN', $admin->id, "Menolak pendaftaran personel baru: {$userName}");
            $msg = 'Pendaftaran personel telah ditolak.';
        }

        return redirect()->back()->with('message', $msg);
    }
}
