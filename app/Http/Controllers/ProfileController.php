<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\SystemLog;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Helpdesk/Profile', [
            'currentUser' => $request->user()->load('role', 'satuan'),
        ]);
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'current_password.current_password' => 'Kata sandi saat ini tidak cocok.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
            'password.min' => 'Kata sandi baru minimal 8 karakter.',
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        SystemLog::log('SUCCESS', $request->user()->id, "Mengubah kata sandi secara mandiri");

        return back()->with('message', 'Kata sandi berhasil diubah.');
    }
    public function updateProfile(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'email' => 'required|email|max:100|unique:users,email,' . $user->id,
            'nama_lengkap' => 'required|string|max:100',
            'nrp_nip' => 'nullable|string|max:50',
            'no_wa' => 'nullable|string|max:20',
            'spesialisasi' => 'nullable|string|max:100',
        ]);

        $changedData = [];
        foreach ($validated as $key => $value) {
            if ($user->{$key} != $value) {
                $changedData[$key] = $value;
            }
        }

        if (empty($changedData)) {
            return back()->with('error', 'Tidak ada perubahan data.');
        }

        $user->update($changedData);

        SystemLog::log('SUCCESS', $user->id, "Mengubah data profil secara mandiri");

        return back()->with('message', 'Data profil berhasil diperbarui.');
    }
}
