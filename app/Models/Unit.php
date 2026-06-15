<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends Model
{
    use SoftDeletes;
    protected $fillable = ['nomor_seri',  'jenis', 'asal_satuan', 'status_unit'];

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function syncStatus()
    {
        $hasDiproses = $this->reports()->where('status_laporan', 'Diproses')->exists();
        $hasRusak = $this->reports()->whereIn('status_laporan', ['Pending', 'Diverifikasi', 'Diterima Teknisi'])->exists();

        if ($hasDiproses) {
            $this->status_unit = 'Perbaikan';
        } elseif ($hasRusak) {
            $this->status_unit = 'Rusak';
        } else {
            // Keep Nonaktif if it was Nonaktif, otherwise Beroperasi
            if ($this->status_unit !== 'Nonaktif') {
                $this->status_unit = 'Beroperasi';
            }
        }

        $this->save();
    }
}
