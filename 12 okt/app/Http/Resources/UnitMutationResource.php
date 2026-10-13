<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UnitMutationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'unit_id' => $this->unit_id,
            'type' => $this->type,
            'reason' => $this->reason,
            'document_path' => $this->document_path ? asset('storage/' . $this->document_path) : null,
            'requested_by' => $this->requester ? $this->requester->nama_lengkap : 'Unknown',
            'requested_by_id' => $this->requested_by,
            'approved_by' => $this->approver ? $this->approver->nama_lengkap : null,
            'status' => $this->status,
            'admin_notes' => $this->admin_notes,
            'unit_data' => $this->unit_data,
            'created_at' => $this->created_at->format('d M Y, H:i'),
            'updated_at' => $this->updated_at->format('d M Y, H:i'),
        ];
    }
}
