<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            $user = Auth::user();
            
            if (!$user->is_approved) {
                Auth::logout();
                return back()->withErrors([
                    'auth' => 'Akun Anda sedang menunggu persetujuan Admin. Mohon bersabar.',
                ]);
            }

            if (!$user->role) {
                Auth::logout();
                return back()->withErrors([
                    'auth' => 'Akun Anda tidak memiliki peran (role) yang valid. Hubungi Admin.',
                ]);
            }

            $role = $user->role->nama_role;
            $redirectPath = '/' . strtolower($role);

            // Redirect ke dashboard sesuai role
            return redirect()->intended($redirectPath);
        }

        return back()->withErrors([
            'auth' => 'Akses Ditolak. Kredensial tidak valid atau tidak diizinkan.',
        ])->onlyInput('username');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
