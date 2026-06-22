<?php

namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Http\Requests\RegisterUserRequest;
 
class RegisterController extends Controller
{
    public function index()
    {
        return Inertia::render('Helpdesk/Register');
    }

    public function register(RegisterUserRequest $request)
    {
        DB::transaction(function () use ($request) {
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
        });

        return redirect('/login')->with('message', 'Pendaftaran berhasil. Silakan tunggu persetujuan Admin.');
    }
}
