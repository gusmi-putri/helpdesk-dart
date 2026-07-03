<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserMutationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'target_user_id' => $this->target_user_id,
            'target_user' => new UserResource($this->whenLoaded('targetUser')),
            'type' => $this->type,
            'reason' => $this->reason,
            'requested_by' => new UserResource($this->whenLoaded('requester')),
            'approved_by' => new UserResource($this->whenLoaded('approver')),
            'status' => $this->status,
            'admin_notes' => $this->admin_notes,
            'user_data' => $this->user_data,
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
        ];
    }
}

