<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

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
    public function store(StoreUserRequest $request)
    {
        DB::transaction(function () use ($request) {
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
        });

        return redirect()->back()->with('message', 'Personel baru berhasil didaftarkan dan sedang menunggu persetujuan Admin.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, string $id)
    {
        $user = User::findOrFail($id);

        $adminRoleId = \App\Models\Role::where('nama_role', 'Admin')->first()?->id;

        $updateData = $request->only('nama_lengkap', 'nrp_nip', 'asal_satuan', 'no_wa', 'spesialisasi');
        if ($user->role_id !== $adminRoleId) {
            $updateData['role_id'] = $request->role_id;
        }

        DB::transaction(function () use ($user, $updateData) {
            $user->update([
                'pending_action' => 'edit',
                'pending_changes' => $updateData
            ]);

            $admin = auth()->user();
            \App\Models\SystemLog::log('INFO', $admin->id, "Mengajukan edit data personel: {$user->nama_lengkap}");
        });

        return redirect()->back()->with('message', 'Pengajuan edit data personel telah dikirim ke Admin untuk disetujui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $adminRoleId = \App\Models\Role::where('nama_role', 'Admin')->first()?->id;
        $currentUser = auth()->user();

        if ($user->role_id === $adminRoleId && $currentUser->role_id !== $adminRoleId) {
            return redirect()->back()->with('error', 'Akses ditolak: Staf tidak diizinkan menghapus akun Admin.');
        }

        DB::transaction(function () use ($user, $currentUser) {
            $user->update([
                'pending_action' => 'delete'
            ]);
            \App\Models\SystemLog::log('INFO', $currentUser->id, "Mengajukan penghapusan personel: {$user->nama_lengkap}");
        });

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

        DB::transaction(function () use ($user, $admin, &$msg) {
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
        });

        return redirect()->back()->with('message', $msg);
    }

    public function reject(string $id)
    {
        $user = User::findOrFail($id);
        $admin = auth()->user();

        DB::transaction(function () use ($user, $admin, &$msg) {
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
        });

        return redirect()->back()->with('message', $msg);
    }
}
