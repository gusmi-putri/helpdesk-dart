<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserMutation;

use App\Models\Report;
use App\Models\SystemLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;

use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:read-users', only: ['index', 'show']),
            new Middleware('permission:create-users', only: ['create', 'store']),
            new Middleware('permission:update-users', only: ['edit', 'update']),
            new Middleware('permission:delete-users', only: ['destroy']),
        ];
    }

    public function store(StoreUserRequest $request)
    {
        DB::transaction(function () use ($request) {
            $isAdmin = auth()->user()->hasRole('Admin');
            $currentUser = auth()->user();
            
            $userData = [
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'email' => $request->email,
                'nama_lengkap' => $request->nama_lengkap,
                'nrp_nip' => $request->nrp_nip,
                'asal_satuan' => $request->asal_satuan,
                'satuan_id' => $request->satuan_id,
                'no_wa' => $request->no_wa,
                'spesialisasi' => $request->spesialisasi,
                'is_approved' => $isAdmin,
            ];

            if ($isAdmin) {
                $user = User::create($userData);

                if ($request->has('roles')) {
                    $user->syncRoles($request->roles);
                }
                if ($request->has('permissions')) {
                    $user->syncPermissions($request->permissions);
                }

                // Log mutasi tanpa password
                $userDataForLog = array_diff_key($userData, ['password' => '']);

                UserMutation::create([
                    'target_user_id' => $user->id,
                    'type' => 'approved_add',
                    'requested_by' => $currentUser->id,
                    'approved_by' => $currentUser->id,
                    'status' => 'approved',
                    'user_data' => $userDataForLog,
                ]);

                SystemLog::log('SUCCESS', $currentUser->id, "Menambahkan personel baru secara langsung: {$request->nama_lengkap} ({$request->username})");
            } else {
                // Request mutasi tanpa password
                $userDataForMutation = array_diff_key($userData, ['password' => '']);

                UserMutation::create([
                    'target_user_id' => null,
                    'type' => 'request_add',
                    'requested_by' => $currentUser->id,
                    'status' => 'pending',
                    'user_data' => $userDataForMutation,
                    'roles' => $request->roles ?? [],
                    'permissions' => $request->permissions ?? [],
                ]);

                SystemLog::log('INFO', $currentUser->id, "Mendaftarkan personel baru: {$request->nama_lengkap} ({$request->username}) (Menunggu Persetujuan)");
            }
        });

        if (auth()->user()->hasRole('Admin')) {
            return redirect()->back()->with('message', 'Personel baru berhasil ditambahkan.');
        }

        return redirect()->back()->with('message', 'Pengajuan penambahan personel telah dikirim dan sedang menunggu persetujuan Admin.');
    }

    public function update(UpdateUserRequest $request, User $user)
    {

        $currentUser = auth()->user();
        $isSelfEdit = $user->id === $currentUser->id;

        $updateData = $request->only('email', 'nama_lengkap', 'nrp_nip', 'asal_satuan', 'satuan_id', 'no_wa', 'spesialisasi');
        
        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }
        
        if ($isSelfEdit) {
            unset($updateData['asal_satuan'], $updateData['satuan_id']);
        }

        $changedData = [];
        foreach ($updateData as $key => $value) {
            if ($user->{$key} != $value) {
                $changedData[$key] = $value;
            }
        }

        $rolesChanged = false;
        $permissionsChanged = false;
        
        if (!$isSelfEdit && !$user->hasRole('Admin')) {
            if ($request->has('roles')) {
                $currentRoles = $user->roles->pluck('name')->toArray();
                $newRoles = $request->roles;
                sort($currentRoles);
                sort($newRoles);
                if ($currentRoles != $newRoles) {
                    $rolesChanged = true;
                }
            }
            if ($request->has('permissions')) {
                $currentPermissions = $user->getAllPermissions()->pluck('name')->toArray();
                $newPermissions = $request->permissions;
                sort($currentPermissions);
                sort($newPermissions);
                if ($currentPermissions != $newPermissions) {
                    $permissionsChanged = true;
                }
            }
        }

        if (empty($changedData) && !$rolesChanged && !$permissionsChanged) {
            return redirect()->back()->with('error', 'Tidak ada perubahan data yang diajukan.');
        }

        $isAdmin = $currentUser->hasRole('Admin');

        DB::transaction(function () use ($user, $changedData, $isAdmin, $isSelfEdit, $currentUser, $request, $rolesChanged, $permissionsChanged) {
            if ($isAdmin || $isSelfEdit) {
                if (!empty($changedData)) {
                    $user->update($changedData);
                }

                if (!$isSelfEdit && !$user->hasRole('Admin')) {
                    if ($rolesChanged) {
                        $user->syncRoles($request->roles);
                    }
                    if ($permissionsChanged) {
                        $user->syncPermissions($request->permissions);
                    }
                }

                $logData = $changedData;
                if (isset($logData['password'])) {
                    unset($logData['password']);
                }
                if ($rolesChanged) $logData['roles'] = $request->roles;
                if ($permissionsChanged) $logData['permissions'] = $request->permissions;

                UserMutation::create([
                    'target_user_id' => $user->id,
                    'type' => 'approved_edit',
                    'requested_by' => $currentUser->id,
                    'approved_by' => $currentUser->id,
                    'status' => 'approved',
                    'user_data' => $logData,
                ]);

                if ($isSelfEdit && !$isAdmin) {
                    SystemLog::log('SUCCESS', $currentUser->id, "Mengubah data profil secara mandiri");
                } else {
                    SystemLog::log('SUCCESS', $currentUser->id, "Mengubah data personel secara langsung: {$user->nama_lengkap}");
                    if ($request->filled('password')) {
                        SystemLog::log('WARN', $currentUser->id, "Mereset password personel secara manual: {$user->nama_lengkap}");
                    }
                }
            } else {
                UserMutation::create([
                    'target_user_id' => $user->id,
                    'type' => 'request_edit',
                    'requested_by' => $currentUser->id,
                    'status' => 'pending',
                    'user_data' => $changedData,
                    'roles' => $request->roles ?? [],
                    'permissions' => $request->permissions ?? [],
                ]);

                SystemLog::log('INFO', $currentUser->id, "Mengajukan edit data personel: {$user->nama_lengkap}");
            }
        });

        if ($isAdmin || $isSelfEdit) {
            return redirect()->back()->with('message', 'Data personel berhasil diubah.');
        }
        return redirect()->back()->with('message', 'Pengajuan edit data personel telah dikirim ke Admin untuk disetujui.');
    }

    public function destroy(User $user)
    {

        $currentUser = auth()->user();

        // Cegah admin hapus diri sendiri
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        if ($user->hasRole('Admin') && !$currentUser->hasRole('Admin')) {
            return redirect()->back()->with('error', 'Akses ditolak: Staf tidak diizinkan menghapus akun Admin.');
        }

        $ongoingReportsCount = Report::where(function ($query) use ($user) {
            $query->where('user_id', $user->id)
                  ->orWhere('teknisi_id', $user->id);
        })->whereNotIn('status_laporan', ['Selesai', 'Ditolak'])->count();

        if ($ongoingReportsCount > 0) {
            return redirect()->back()->with('error', 'Gagal: Personel masih memiliki laporan yang sedang berjalan (on going).');
        }

        DB::transaction(function () use ($user, $currentUser) {
            if ($currentUser->hasRole('Admin')) {
                $userName = $user->nama_lengkap;
                
                UserMutation::create([
                    'target_user_id' => $user->id,
                    'type' => 'approved_delete',
                    'requested_by' => $currentUser->id,
                    'approved_by' => $currentUser->id,
                    'status' => 'approved',
                    'user_data' => [
                        'username' => $user->username,
                        'nama_lengkap' => $user->nama_lengkap
                    ]
                ]);

                $user->delete();
                SystemLog::log('ALERT', $currentUser->id, "Menghapus personel secara langsung: {$userName}");
            } else {
                UserMutation::create([
                    'target_user_id' => $user->id,
                    'type' => 'request_delete',
                    'requested_by' => $currentUser->id,
                    'status' => 'pending',
                    'user_data' => [
                        'username' => $user->username,
                        'nama_lengkap' => $user->nama_lengkap
                    ]
                ]);

                SystemLog::log('INFO', $currentUser->id, "Mengajukan penghapusan personel: {$user->nama_lengkap}");
            }
        });

        if ($currentUser->hasRole('Admin')) {
            return redirect()->back()->with('message', 'Personel berhasil dihapus.');
        }
        return redirect()->back()->with('message', 'Pengajuan hapus personel telah dikirim ke Admin untuk disetujui.');
    }

    public function toggleStatus(string $id)
    {
        $user = User::findOrFail($id);
        // Cegah admin nonaktifkan diri sendiri
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Anda tidak dapat mengubah status akun Anda sendiri.');
        }

        $user->is_active = !$user->is_active;
        $user->save();

        $statusStr = $user->is_active ? 'AKTIF' : 'NONAKTIF';
        $admin = auth()->user();
        SystemLog::log('WARN', $admin->id, "Mengubah status personel {$user->nama_lengkap} menjadi {$statusStr}");

        return redirect()->back()->with('message', "Status personel berhasil diubah menjadi {$statusStr}.");
    }

    public function approve(string $id)
    {
        $mutation = UserMutation::findOrFail($id);
        
        if ($mutation->status !== 'pending') {
            return redirect()->back()->with('error', 'Pengajuan ini sudah diproses.');
        }

        $admin = auth()->user();

        DB::transaction(function () use ($mutation, $admin, &$msg) {
            if ($mutation->type === 'request_edit') {
                $user = User::findOrFail($mutation->target_user_id);
                $updateData = $mutation->user_data ?? [];
                $user->update($updateData);

                $mutation->update([
                    'status' => 'approved',
                    'approved_by' => $admin->id,
                    'type' => 'approved_edit',
                ]);

                if (isset($mutation->roles)) {
                    $user->syncRoles($mutation->roles);
                }
                if (isset($mutation->permissions)) {
                    $user->syncPermissions($mutation->permissions);
                }

                SystemLog::log('SUCCESS', $admin->id, "Menyetujui perubahan data personel: {$user->nama_lengkap}");
                $msg = 'Perubahan profil personel telah disetujui.';
            } elseif ($mutation->type === 'request_delete') {
                $user = User::findOrFail($mutation->target_user_id);
                $userName = $user->nama_lengkap;
                
                $mutation->update([
                    'status' => 'approved',
                    'approved_by' => $admin->id,
                    'type' => 'approved_delete',
                ]);

                $user->delete();
                SystemLog::log('ALERT', $admin->id, "Menyetujui penghapusan personel: {$userName}");
                $msg = 'Penghapusan personel telah disetujui.';
            } elseif ($mutation->type === 'request_add') {
                $userData = $mutation->user_data ?? [];
                $userData['is_approved'] = true;

                // Hapus password lama untuk keamanan
                // Buat password sementara, reset via forgot-password
                if (!isset($userData['password'])) {
                    $userData['password'] = bcrypt(\Illuminate\Support\Str::random(16));
                }

                $user = User::create($userData);

                $mutation->update([
                    'status' => 'approved',
                    'approved_by' => $admin->id,
                    'target_user_id' => $user->id,
                    'type' => 'approved_add',
                ]);

                if (isset($mutation->roles)) {
                    $user->syncRoles($mutation->roles);
                }
                if (isset($mutation->permissions)) {
                    $user->syncPermissions($mutation->permissions);
                }

                SystemLog::log('SUCCESS', $admin->id, "Menyetujui pendaftaran personel baru: {$user->nama_lengkap}");
                $msg = 'Personel telah disetujui dan sekarang dapat login.';
            }
        });

        return redirect()->back()->with('message', $msg);
    }

    public function reject(Request $request, string $id)
    {
        $mutation = UserMutation::findOrFail($id);
        
        if ($mutation->status !== 'pending') {
            return redirect()->back()->with('error', 'Pengajuan ini sudah diproses.');
        }

        $admin = auth()->user();
        $adminNotes = substr(strip_tags($request->input('admin_notes', 'Ditolak oleh Admin.')), 0, 500);

        DB::transaction(function () use ($mutation, $admin, $adminNotes, &$msg) {
            $typeMapping = [
                'request_add' => 'rejected_add',
                'request_edit' => 'rejected_edit',
                'request_delete' => 'rejected_delete',
            ];

            $newType = $typeMapping[$mutation->type] ?? $mutation->type;

            $mutation->update([
                'status' => 'rejected',
                'approved_by' => $admin->id,
                'admin_notes' => $adminNotes,
                'type' => $newType,
            ]);

            $userName = $mutation->user_data['nama_lengkap'] ?? ($mutation->targetUser->nama_lengkap ?? 'Unknown');
            $action = str_replace('request_', '', $mutation->type);

            SystemLog::log('WARN', $admin->id, "Menolak pengajuan {$action} personel: {$userName}");
            $msg = "Pengajuan {$action} personel telah ditolak.";
        });

        return redirect()->back()->with('message', $msg);
    }
}

