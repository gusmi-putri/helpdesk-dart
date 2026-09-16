<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceReport extends Model
{
    protected $fillable = [
        'satuan_id',
        'user_id',
        'nama_giat',
        'periode',
        'tahun',
        'anggaran_pendukung',
        'jumlah_anggaran',
        'dokumen_anggaran',
        'dokumen_lpj',
    ];

    public function satuan()
    {
        return $this->belongsTo(Satuan::class, 'satuan_id');
    }

    public function pelapor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
