<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserMutation extends Model
{
    use HasFactory;

    protected $fillable = [
        'target_user_id',
        'type',
        'reason',
        'requested_by',
        'approved_by',
        'status',
        'admin_notes',
        'user_data',
    ];

    protected $casts = [
        'user_data' => 'array',
    ];

    public function targetUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'target_user_id');
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
