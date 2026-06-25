<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $adminRoleId = \App\Models\Role::where('nama_role', 'Admin')->first()?->id;

        return [
            'username' => 'required|string|min:4|max:50|unique:users',
            'password' => ['required', 'string', 'min:8', 'regex:/[a-z]/', 'regex:/[0-9]/'],
            'email' => 'required|email|unique:users,email',
            'nama_lengkap' => 'required|string|max:100',
            'nrp_nip' => ['required', 'string', 'min:8', 'max:20', 'regex:/^[0-9]+$/'],
            'role_id' => ['required', 'exists:roles,id', 'not_in:' . $adminRoleId],
            'asal_satuan' => 'nullable|string|max:100',
            'no_wa' => ['nullable', 'string', 'regex:/^62[0-9]{8,13}$/'],
            'spesialisasi' => 'nullable|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'username.min' => 'Username minimal 4 karakter.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'password.regex' => 'Kata sandi harus mengandung kombinasi huruf dan angka.',
            'nrp_nip.regex' => 'NRP/NIP hanya boleh berisi angka.',
            'nrp_nip.min' => 'NRP/NIP minimal 8 digit.',
            'nrp_nip.max' => 'NRP/NIP maksimal 20 digit.',
            'no_wa.regex' => 'Nomor WhatsApp harus diawali 62 dan hanya angka (10-15 digit). Contoh: 6281234567890.',
        ];
    }
}
