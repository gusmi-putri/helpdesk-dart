<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'unit_id', 'user_id', 'staff_id', 'teknisi_id', 'tanggal_lapor',
        'deskripsi_kerusakan', 'file_bukti', 'file_bukti_selesai',
        'status_laporan', 'metode_perbaikan', 'tgl_ditunjuk', 'tgl_selesai', 'catatan_teknisi'
    ];

    public function unit() { return $this->belongsTo(Unit::class); }
    public function pelapor() { return $this->belongsTo(User::class, 'user_id'); }
    public function staf() { return $this->belongsTo(User::class, 'staff_id'); }
    public function teknisi() { return $this->belongsTo(User::class, 'teknisi_id'); }
}
