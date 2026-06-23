<?php

namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
 
class RegisterController extends Controller
{
    public function index()
    {
        return Inertia::render('Helpdesk/Register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|min:4|unique:users,username|max:50',
            'email' => 'required|email|unique:users,email|max:255',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[a-z]/',      // must contain at least one lowercase letter
                'regex:/[0-9]/',      // must contain at least one digit
            ],
            'nama_lengkap' => 'required|string|max:100',
            'nrp_nip' => 'required|string|min:8|max:20|unique:users,nrp_nip|regex:/^[0-9]+$/', // strictly digits
            'asal_satuan' => 'required|string|max:100',
            'no_wa' => 'required|string|regex:/^62[0-9]{8,13}$/', // must start with 62
        ], [
            'username.min' => 'Username minimal 4 karakter.',
            'email.email' => 'Format email tidak valid.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'password.regex' => 'Kata sandi harus mengandung kombinasi huruf dan angka.',
            'nrp_nip.regex' => 'NRP/NIP hanya boleh berisi angka.',
            'nrp_nip.min' => 'NRP/NIP minimal 8 digit.',
            'no_wa.regex' => 'Nomor WhatsApp harus diawali 62. Contoh: 6281234567890.',
        ]);

        $satuanName = strtoupper($request->asal_satuan);
        \App\Models\Satuan::firstOrCreate(['nama_satuan' => $satuanName]);

        User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'nama_lengkap' => $request->nama_lengkap,
            'nrp_nip' => $request->nrp_nip,
            'asal_satuan' => strtoupper($request->asal_satuan),
            'no_wa' => $request->no_wa,
            'role_id' => 4, // Pelapor
            'is_approved' => false,
        ]);

        return redirect('/login')->with('message', 'Pendaftaran berhasil. Silakan tunggu persetujuan Admin.');
    }
}
