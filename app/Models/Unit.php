<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $fillable = ['nomor_seri', 'nama_dart', 'jenis_dart', 'asal_satuan', 'status_unit'];

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function syncStatus()
    {
        $hasPending = $this->reports()->where('status_laporan', 'Pending')->exists();
        $hasProses = $this->reports()->where('status_laporan', 'Proses')->exists();

        if ($hasPending) {
            $this->status_unit = 'Rusak';
        } elseif ($hasProses) {
            $this->status_unit = 'Perbaikan';
        } else {
            $this->status_unit = 'Siap Ops';
        }

        $this->save();
    }
}
