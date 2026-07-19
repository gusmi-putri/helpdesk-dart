<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use App\Mail\ResetPasswordCodeMail;
use Carbon\Carbon;

class ForgotPasswordController extends Controller
{
    /**
     * Tampilkan halaman Lupa Password (Inertia)
     */
    public function index()
    {
        return Inertia::render('Helpdesk/ForgotPassword');
    }

    /**
     * Kirim kode OTP ke email
     */
    public function sendCode(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string'
        ]);

        $user = User::where('email', $request->identifier)
                    ->orWhere('username', $request->identifier)
                    ->first();

        // Pesan selalu sama terlepas dari apakah user ditemukan atau tidak
        // (mencegah user enumeration / account harvesting)
        $genericMessage = 'Jika akun dengan identitas tersebut terdaftar dan memiliki email valid, kode reset akan segera dikirimkan.';

        if (!$user || !$user->email) {
            // Kembalikan pesan generik tanpa mengungkapkan keberadaan akun
            return back()->with(['success' => $genericMessage, 'maskedEmail' => null]);
        }

        // Hasilkan kode 6-digit acak
        $code = random_int(100000, 999999);

        // Hapus kode lama jika ada
        DB::table('password_reset_tokens')->where('email', $user->email)->delete();

        // Simpan kode baru
        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => Hash::make((string) $code),
            'created_at' => Carbon::now()
        ]);

        // Kirim email
        Mail::to($user->email)->send(new ResetPasswordCodeMail($code));

        // Buat email tersensor untuk ditampilkan di UI (misal: a***@gmail.com)
        $emailParts = explode('@', $user->email);
        $maskedEmail = substr($emailParts[0], 0, 1) . str_repeat('*', max(1, strlen($emailParts[0]) - 1)) . '@' . $emailParts[1];

        return back()->with([
            'success' => $genericMessage,
            'maskedEmail' => $maskedEmail
        ]);
    }

    /**
     * Verifikasi kode OTP dan Reset Password
     */
    public function verifyAndReset(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string',
            'code' => 'required|digits:6',
            'password' => [
                'required',
                'min:8',
                'confirmed',
                'regex:/[a-zA-Z]/',
                'regex:/[0-9]/'
            ],
        ], [
            'password.regex' => 'Kata sandi harus mengandung minimal satu huruf dan satu angka.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.'
        ]);

        $user = User::where('email', $request->identifier)
                    ->orWhere('username', $request->identifier)
                    ->first();

        if (!$user || !$user->email) {
            return back()->withErrors(['identifier' => 'Pengguna tidak valid.']);
        }

        $tokenRecord = DB::table('password_reset_tokens')->where('email', $user->email)->first();

        if (!$tokenRecord) {
            return back()->withErrors(['code' => 'Kode tidak valid atau sudah kedaluwarsa.']);
        }

        // Cek kedaluwarsa (5 menit)
        if (Carbon::parse($tokenRecord->created_at)->addMinutes(5)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $user->email)->delete();
            return back()->withErrors(['code' => 'Kode telah kedaluwarsa (lebih dari 5 menit). Silakan minta kode baru.']);
        }

        // Cek kecocokan token
        if (!Hash::check((string) $request->code, $tokenRecord->token)) {
            $attempts = ($tokenRecord->attempts ?? 0) + 1;
            if ($attempts >= 3) {
                DB::table('password_reset_tokens')->where('email', $user->email)->delete();
                return back()->withErrors(['code' => 'Terlalu banyak percobaan gagal. Kode telah dihapus demi keamanan, silakan minta kode baru.']);
            }
            DB::table('password_reset_tokens')->where('email', $user->email)->update(['attempts' => $attempts]);
            return back()->withErrors(['code' => 'Kode yang dimasukkan salah. Sisa percobaan: ' . (3 - $attempts)]);
        }

        // Update password
        $user->password = Hash::make($request->password);
        $user->save();

        // Hapus token
        DB::table('password_reset_tokens')->where('email', $user->email)->delete();

        return redirect()->route('login')->with('success', 'Kata sandi berhasil direset! Silakan login dengan kata sandi baru.');
    }
}
