<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Anyone can attempt to register
    }

    public function rules(): array
    {
        return [
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
        ];
    }

    public function messages(): array
    {
        return [
            'username.min' => 'Username minimal 4 karakter.',
            'email.email' => 'Format email tidak valid.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'password.regex' => 'Kata sandi harus mengandung kombinasi huruf dan angka.',
            'nrp_nip.regex' => 'NRP/NIP hanya boleh berisi angka.',
            'nrp_nip.min' => 'NRP/NIP minimal 8 digit.',
            'no_wa.regex' => 'Nomor WhatsApp harus diawali 62. Contoh: 6281234567890.',
        ];
    }
}
