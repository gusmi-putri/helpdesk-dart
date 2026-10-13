<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UnitResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'db_id' => $this->id,
            'nomor_seri' => $this->nomor_seri,
            'jenis' => $this->jenis,
            'asal_satuan' => $this->asal_satuan,
            'satuan_id' => $this->satuan_id,
            'satuan' => $this->whenLoaded('satuan'),
            'status_unit' => $this->status_unit,
            'last_maintenance' => clone $this->updated_at ? $this->updated_at->format('d M Y') : null,
            'deleted_at' => $this->when($this->deleted_at, function () {
                return $this->deleted_at->format('d M Y, H:i');
            }),
        ];
    }
}
