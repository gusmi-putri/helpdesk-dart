<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['username', 'password', 'nama_lengkap', 'asal_satuan', 'no_wa', 'spesialisasi', 'role_id'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
             'password' => 'hashed',
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
 }
