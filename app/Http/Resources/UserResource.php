<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'id' => 'USR-'.str_pad($this->id, 3, '0', STR_PAD_LEFT),
            'name' => $this->nama_lengkap,
            'username' => $this->username,
            'email' => $this->email,
            'nrp_nip' => $this->nrp_nip,
            'no_wa' => $this->no_wa,
            'asal_satuan' => $this->asal_satuan,
            'satuan_id' => $this->satuan_id,
            'satuan' => $this->whenLoaded('satuan'),
            'spesialisasi' => $this->spesialisasi,
            'is_approved' => $this->is_approved,
            'role' => $this->role ? $this->role->nama_role : 'No Role',
            'role_id' => $this->role_id,
            'is_active' => $this->is_active,
            'status' => !$this->is_approved ? 'Menunggu' : ($this->is_active ? 'Aktif' : 'Nonaktif'),
            'lastLogin' => 'Baru saja',
            'pending_action' => $this->pending_action,
            'pending_changes' => $this->pending_changes,
            // Specifically for technicians
            'tasksReceived' => $this->whenLoaded('reportsDitangani', function () {
                return $this->reportsDitangani->count();
            }),
            'tasksInProgress' => $this->whenLoaded('reportsDitangani', function () {
                return $this->reportsDitangani->whereIn('status_laporan', ['Diterima Teknisi', 'Diproses'])->count();
            }),
            'has_ongoing_reports' => $this->reportsDilaporkan()->whereNotIn('status_laporan', ['Selesai', 'Ditolak'])->exists() 
                                  || $this->reportsDitangani()->whereNotIn('status_laporan', ['Selesai', 'Ditolak'])->exists(),
        ];
    }
}
