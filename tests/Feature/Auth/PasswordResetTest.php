<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordCodeMail;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_reset_password_link_screen_can_be_rendered(): void
    {
        $response = $this->get('/forgot-password');

        $response->assertStatus(200);
    }

    public function test_reset_password_code_can_be_requested(): void
    {
        Mail::fake();

        $user = User::factory()->create();

        $response = $this->post('/forgot-password/send-code', [
            'identifier' => $user->email,
        ]);

        $response->assertSessionHas('success');
        
        // Assert that the token is stored in the database
        $this->assertDatabaseHas('password_reset_tokens', [
            'email' => $user->email,
        ]);

        Mail::assertSent(ResetPasswordCodeMail::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }

    public function test_password_can_be_reset_with_valid_otp(): void
    {
        $user = User::factory()->create();
        $code = '123456';

        // Seed the token table
        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => Hash::make($code),
            'created_at' => now(),
        ]);

        $response = $this->post('/forgot-password/verify-reset', [
            'identifier' => $user->email,
            'code' => $code,
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect('/login');

        // Assert database token is deleted
        $this->assertDatabaseMissing('password_reset_tokens', [
            'email' => $user->email,
        ]);

        // Assert user password is changed
        $this->assertTrue(Hash::check('newpassword123', $user->refresh()->password));
    }
}
