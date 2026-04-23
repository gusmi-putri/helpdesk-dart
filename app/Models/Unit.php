<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $fillable = ['nomor_seri', 'nama_dart', 'asal_satuan', 'status_unit'];

    public function reports()
    {
        return $this->hasMany(Report::class);
    }
}
