<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
        'case_id', 'user_id', 'status', 'barang_rusak', 'lokasi', 'deskripsi', 'dokumentasi_path',
        'technician_id', 'tanggal_penanganan', 'tindakan', 'suku_cadang', 'status_perbaikan'
    ];

    protected $casts = [
        'tanggal_penanganan' => 'datetime',
    ];

    public function pelapor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function teknisi()
    {
        return $this->belongsTo(User::class, 'technician_id');
    }
}
