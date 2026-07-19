<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Carbon;
use App\Models\User;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $throttleKey = 'login:' . $request->input('username') . '|' . $request->ip();

        // 1. Cek Rate Limiter
        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $sisaDetik = RateLimiter::availableIn($throttleKey);
            session(['lockout_until' => now()->addSeconds($sisaDetik)->timestamp]);
            return back()->withErrors([
                'auth' => "Terlalu banyak percobaan login. Silakan tunggu sebelum mencoba lagi.",
                'sisa_detik' => (string) $sisaDetik,
            ])->onlyInput('username');
        }

        // 2. Cek apakah akun terkunci di DB (hanya untuk pengguna yang ada)
        $user = User::where('username', $request->input('username'))->first();
        if ($user && $user->locked_until && Carbon::parse($user->locked_until)->isFuture()) {
            $sisaDetik = (int) now()->diffInSeconds(Carbon::parse($user->locked_until));
            session(['lockout_until' => now()->addSeconds($sisaDetik)->timestamp]);
            return back()->withErrors([
                'auth' => "Akun Anda terkunci karena terlalu banyak percobaan login yang gagal.",
                'locked_until' => Carbon::parse($user->locked_until)->toIso8601String(),
                'sisa_detik' => (string) $sisaDetik,
            ])->onlyInput('username');
        }

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            $user = Auth::user();

            // Reset lock dan rate limiter setelah berhasil login
            if ($user->locked_until) {
                $user->locked_until = null;
                $user->save();
            }
            RateLimiter::clear($throttleKey);
            session()->forget('lockout_until');
            
            if (!$user->is_approved) {
                Auth::logout();
                return back()->withErrors([
                    'auth' => 'Akun Anda sedang menunggu persetujuan Admin. Mohon bersabar.',
                ]);
            }

            if (!$user->is_active) {
                Auth::logout();
                return back()->withErrors([
                    'auth' => 'Akun Anda telah dinonaktifkan oleh Admin. Silakan hubungi pusat bantuan.',
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

            return redirect()->intended($redirectPath);
        }

        // Login gagal - catat percobaan
        RateLimiter::hit($throttleKey, 300); // 300 detik = 5 menit

        $attemptsLeft = 5 - RateLimiter::attempts($throttleKey);

        // Jika sudah 5x gagal, kunci akun selama 5 menit
        if ($attemptsLeft <= 0) {
            if ($user) {
                $user->locked_until = Carbon::now()->addMinutes(5);
                $user->save();
            }

            $sisaDetik = RateLimiter::availableIn($throttleKey);
            $sisaDetik = $sisaDetik > 0 ? $sisaDetik : 300;
            session(['lockout_until' => now()->addSeconds($sisaDetik)->timestamp]);
            
            return back()->withErrors([
                'auth' => "Akun Anda terkunci selama 5 menit karena terlalu banyak percobaan login yang gagal.",
                'locked_until' => Carbon::now()->addMinutes(5)->toIso8601String(),
                'sisa_detik' => (string) $sisaDetik,
            ])->onlyInput('username');
        }

        $pesanSisa = $attemptsLeft > 0
            ? " Sisa percobaan: {$attemptsLeft} dari 5."
            : "";

        return back()->withErrors([
            'auth' => "Akses Ditolak. Kredensial tidak valid.{$pesanSisa}",
            'sisa_percobaan' => max($attemptsLeft, 0),
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
