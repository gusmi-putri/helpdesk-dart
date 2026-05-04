<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemLog extends Model
{
    protected $fillable = [
        'level', 'user_id', 'activity_payload'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function log($level, $userId, $activity)
    {
        return self::create([
            'level' => $level,
            'user_id' => $userId,
            'activity_payload' => $activity
        ]);
    }
}
