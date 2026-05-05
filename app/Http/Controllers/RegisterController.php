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
            'username' => 'required|string|unique:users,username|max:255',
            'password' => 'required|string|min:6',
            'nama_lengkap' => 'required|string|max:255',
            'nrp_nip' => 'required|string|max:255',
            'asal_satuan' => 'required|string|max:255',
            'no_wa' => 'required|string|max:20',
        ]);

        User::create([
            'username' => $request->username,
            'password' => $request->password, // Will be hashed by model cast if set up, but let's check
            'nama_lengkap' => $request->nama_lengkap,
            'nrp_nip' => $request->nrp_nip,
            'asal_satuan' => $request->asal_satuan,
            'no_wa' => $request->no_wa,
            'role_id' => 4, // Pelapor
            'is_approved' => false,
        ]);

        return redirect('/login')->with('message', 'Pendaftaran berhasil. Silakan tunggu persetujuan Admin.');
    }
}
