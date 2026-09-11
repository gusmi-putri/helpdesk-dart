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


        return [
            'username' => 'required|string|min:4|max:50|unique:users',
            'password' => ['required', 'string', 'min:8', 'confirmed', 'regex:/[a-z]/', 'regex:/[0-9]/'],
            'email' => 'required|email|unique:users,email',
            'nama_lengkap' => 'required|string|max:100',
            'nrp_nip' => ['required', 'string', 'min:8', 'max:20', 'regex:/^[0-9]+$/', 'unique:users,nrp_nip'],
            'roles' => ['required', 'array'],
            'roles.*' => array_filter([
                'exists:roles,name',
                auth()->user()->hasRole('Admin') ? null : 'not_in:Admin'
            ]),
            'permissions' => ['nullable', 'array'],
            'permissions.*' => ['exists:permissions,name'],
            'asal_satuan' => 'nullable|string|max:100',
            'satuan_id' => 'nullable|exists:satuans,id',
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
            'nrp_nip.unique' => 'NRP/NIP sudah terdaftar.',
            'no_wa.regex' => 'Nomor WhatsApp harus diawali 62 dan hanya angka (10-15 digit). Contoh: 6281234567890.',
        ];
    }
}
