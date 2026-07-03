<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        \App\Models\Role::firstOrCreate(['nama_role' => 'Admin']);
        \App\Models\Role::firstOrCreate(['nama_role' => 'Staf']);
        \App\Models\Role::firstOrCreate(['nama_role' => 'Teknisi']);
        \App\Models\Role::firstOrCreate(['nama_role' => 'Pelapor']);

        $response = $this->post('/register', [
            'username' => 'testuser',
            'email' => 'testuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'nama_lengkap' => 'Test User',
            'nrp_nip' => '12345678',
            'asal_satuan' => 'KOPASSUS',
            'no_wa' => '6281234567890',
        ]);

        $this->assertGuest();
        $response->assertRedirect('/login');
    }
}
