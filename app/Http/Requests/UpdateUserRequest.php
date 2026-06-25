<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $adminRoleId = \App\Models\Role::where('nama_role', 'Admin')->first()?->id;
        $userId = $this->route('user'); // Get ID from route params if bound
        $user = \App\Models\User::find($userId);

        $rules = [
            'email' => 'required|email|unique:users,email,' . $userId,
            'nama_lengkap' => 'required|string|max:100',
            'nrp_nip' => ['required', 'string', 'min:8', 'max:20', 'regex:/^[0-9]+$/'],
            'asal_satuan' => 'nullable|string|max:100',
            'no_wa' => ['nullable', 'string', 'regex:/^62[0-9]{8,13}$/'],
            'spesialisasi' => 'nullable|string|max:100',
        ];

        if ($user && $user->role_id !== $adminRoleId) {
            $rules['role_id'] = ['required', 'exists:roles,id', 'not_in:' . $adminRoleId];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'nrp_nip.regex' => 'NRP/NIP hanya boleh berisi angka.',
            'nrp_nip.min' => 'NRP/NIP minimal 8 digit.',
            'nrp_nip.max' => 'NRP/NIP maksimal 20 digit.',
            'no_wa.regex' => 'Nomor WhatsApp harus diawali 62 dan hanya angka (10-15 digit). Contoh: 6281234567890.',
        ];
    }
}
