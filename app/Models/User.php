<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Illuminate\Database\Eloquent\SoftDeletes;

#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'username', 'email', 'password', 'nama_lengkap', 'nrp_nip', 
        'asal_satuan', 'satuan_id', 'no_wa', 'spesialisasi', 'role_id', 'is_active', 'is_approved'
    ];/**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
             'password' => 'hashed',
             'is_active' => 'boolean',
             'is_approved' => 'boolean',
             'pending_changes' => 'array',
         ];
     }

     public function role()
     {
         return $this->belongsTo(Role::class);
     }

     public function reportsDilaporkan()
     {
         return $this->hasMany(Report::class, 'user_id');
     }

     public function reportsDitangani()
     {
         return $this->hasMany(Report::class, 'teknisi_id');
     }

     public function satuan()
     {
         return $this->belongsTo(Satuan::class);
     }
 }
