<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnitMutation extends Model
{
    protected $fillable = [
        'unit_id',
        'type',
        'reason',
        'document_path',
        'requested_by',
        'approved_by',
        'status',
        'admin_notes',
        'unit_data',
    ];

    protected $casts = [
        'unit_data' => 'array',
    ];

    public function unit()
    {
        return $this->belongsTo(Unit::class)->withTrashed();
    }

    public function requester()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
