<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Satuan extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_satuan',
        'nama_satuan',
        'kotama',
        'alamat',
        'is_verified',
        'is_active',
        'latitude',
        'longitude',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function units()
    {
        return $this->hasMany(Unit::class);
    }
}
