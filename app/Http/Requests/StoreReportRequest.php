<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Unit;

class StoreReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Pastikan hanya user yang login yang bisa melapor
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $dokumenAnggaranRules = $this->jenis_perbaikan === 'Non-Swadaya'
            ? 'required|array|min:1|max:10'
            : 'nullable|array|max:10';

        return [
            'unit_id' => [
                'required',
                'exists:units,id,deleted_at,NULL',
                function ($attribute, $value, $fail) {
                    $user = auth()->user();
                    if ($user && $user->role && $user->role->nama_role === 'Pelapor') {
                        $unit = Unit::find($value);
                        if ($unit && $unit->satuan_id !== $user->satuan_id) {
                            $fail('Unit yang dilaporkan tidak terdaftar di Satuan Kerja Anda.');
                        }
                    }
                }
            ],
            'deskripsi' => 'required|string',
            'tingkat_kerusakan' => 'required|in:Ringan,Sedang,Parah',
            'urgensi' => 'required|in:Sangat Mendesak,Bisa Menunggu,Pemeliharaan Rutin',
            'jenis_perbaikan' => 'required|in:Swadaya,Non-Swadaya',
            'keterangan_anggaran' => 'required_if:jenis_perbaikan,Non-Swadaya|nullable|string|max:2000',
            'dokumen_anggaran' => $dokumenAnggaranRules,
            'dokumen_anggaran.*' => 'file|mimes:pdf,doc,docx,jpg,jpeg,png|mimetypes:application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png|max:20480',
            'klasifikasi' => 'nullable|in:RINGAN,SEDANG,DARURAT',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|mimetypes:image/jpeg,image/png|max:20480',
            'file_bukti.*' => 'nullable|file|mimes:jpg,jpeg,png,gif|mimetypes:image/jpeg,image/png,image/gif|max:20480',
            'tautan_video' => 'required|url',
        ];
    }
}
