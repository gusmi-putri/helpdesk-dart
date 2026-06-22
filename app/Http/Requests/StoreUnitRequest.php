<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUnitRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nomor_seri' => 'required|string|max:50|unique:units',
            'jenis' => 'required|in:DART STD,DART STK,DART Portabel - Swing,DART Portabel - Pop,DART Portabel - Flip,DART Marathon Target,Moving Target',
            'asal_satuan' => 'required|string|max:100',
            'status_unit' => 'required|in:Beroperasi,Rusak,Perbaikan,Nonaktif',
            'document' => 'required|file|mimes:pdf,png,jpg,jpeg|max:10240',
        ];
    }
}
