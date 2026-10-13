<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\User;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {

        $routeUser = $this->route('user');
        $userId = $routeUser instanceof User ? $routeUser->id : $routeUser;
        $user = $routeUser instanceof User ? $routeUser : User::find($userId);

        $rules = [
            'email' => 'required|email|unique:users,email,' . $userId,
            'nama_lengkap' => 'required|string|max:100',
            'nrp_nip' => ['required', 'string', 'min:8', 'max:20', 'regex:/^[0-9]+$/', 'unique:users,nrp_nip,' . $userId],
            'asal_satuan' => 'nullable|string|max:100',
            'satuan_id' => 'nullable|exists:satuans,id',
            'no_wa' => ['nullable', 'string', 'regex:/^62[0-9]{8,13}$/'],
            'spesialisasi' => 'nullable|string|max:100',
            'password' => 'nullable|string|min:8|confirmed',
        ];

        if ($user && !$user->hasRole('Admin')) {
            $rules['roles'] = ['required', 'array'];
            $rules['roles.*'] = array_filter([
                'exists:roles,name', 
                auth()->user()->hasRole('Admin') ? null : 'not_in:Admin'
            ]);
            $rules['permissions'] = ['nullable', 'array'];
            $rules['permissions.*'] = ['exists:permissions,name'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'nrp_nip.regex' => 'NRP/NIP hanya boleh berisi angka.',
            'nrp_nip.min' => 'NRP/NIP minimal 8 digit.',
            'nrp_nip.max' => 'NRP/NIP maksimal 20 digit.',
            'nrp_nip.unique' => 'NRP/NIP sudah terdaftar.',
            'no_wa.regex' => 'Nomor WhatsApp harus diawali 62 dan hanya angka (10-15 digit). Contoh: 6281234567890.',
        ];
    }
}
