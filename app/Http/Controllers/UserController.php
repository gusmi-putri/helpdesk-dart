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
        ]);

        $admin = auth()->user();
        \App\Models\SystemLog::log('INFO', $admin->id, "Mendaftarkan personel baru: {$request->nama_lengkap} ({$request->username})");

        return redirect()->back()->with('message', 'Personel baru berhasil didaftarkan ke sistem.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $adminRoleId = \App\Models\Role::where('nama_role', 'Admin')->first()?->id;

        $request->validate([
            'nama_lengkap' => 'required|string|max:100',
            'nrp_nip' => 'required|string|min:8|max:50',
            'role_id' => ['required', 'exists:roles,id', 'not_in:' . $adminRoleId],
            'asal_satuan' => 'nullable|string|max:100',
            'no_wa' => 'nullable|string|max:20',
            'spesialisasi' => 'nullable|string|max:100',
        ]);

        $user->update($request->only('nama_lengkap', 'nrp_nip', 'role_id', 'asal_satuan', 'no_wa', 'spesialisasi'));

        $admin = auth()->user();
        \App\Models\SystemLog::log('INFO', $admin->id, "Memperbarui data personel: {$user->nama_lengkap}");

        return redirect()->back()->with('message', 'Data personel telah diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $userName = $user->nama_lengkap;
        $user->delete();

        $admin = auth()->user();
        \App\Models\SystemLog::log('ALERT', $admin->id, "Menghapus akses personel dari sistem: {$userName}");

        return redirect()->back()->with('message', 'User deleted successfully.');
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
}
