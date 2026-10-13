<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Validation\Rule;
use App\Models\SystemLog;
use App\Models\User;

class RoleController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        // Hanya Admin yang bisa mengakses role management
        return [
            new Middleware('role:Admin'),
        ];
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name'
        ]);

        $role = Role::create(['name' => $request->name]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        SystemLog::log('SUCCESS', auth()->id(), "Membuat role baru: {$role->name}");

        return redirect()->back()->with('message', 'Role berhasil dibuat.');
    }

    public function update(Request $request, string $id)
    {
        $role = Role::findOrFail($id);
        $currentUser = auth()->user();

        if ($role->name === 'Admin' && $request->name !== 'Admin') {
            return redirect()->back()->with('error', 'Nama role Admin tidak boleh diubah.');
        }

        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles', 'name')->ignore($role->id)
            ],
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,name'
        ]);

        $oldName = $role->name;
        $role->update(['name' => $request->name]);

        if ($request->has('permissions')) {
            $permissions = $request->permissions;
            if ($role->name === 'Admin') {
                if (!in_array('view-dashboard-admin', $permissions)) {
                    $permissions[] = 'view-dashboard-admin';
                }
            }
            $role->syncPermissions($permissions);
        } else {
            if ($role->name !== 'Admin') {
                $role->syncPermissions([]);
            }
        }

        SystemLog::log('SUCCESS', $currentUser->id, "Mengubah role {$oldName}");

        return redirect()->back()->with('message', 'Role berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $role = Role::findOrFail($id);
        $currentUser = auth()->user();

        // Proteksi role inti
        $protectedRoles = ['Admin', 'Staf', 'Teknisi', 'Pelapor', 'Supervisor'];
        if (in_array($role->name, $protectedRoles)) {
            return redirect()->back()->with('error', "Gagal: Role bawaan '{$role->name}' tidak boleh dihapus.");
        }

        $usersCount = User::role($role->name)->count();
        if ($usersCount > 0) {
            return redirect()->back()->with('error', "Gagal: Role ini masih digunakan oleh {$usersCount} pengguna.");
        }

        $roleName = $role->name;
        $role->delete();

        SystemLog::log('ALERT', $currentUser->id, "Menghapus role: {$roleName}");

        return redirect()->back()->with('message', 'Role berhasil dihapus.');
    }
}
