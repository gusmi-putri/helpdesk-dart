<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Tambahkan HTTP security headers pada setiap response.
     * Mencegah XSS, clickjacking, MIME sniffing, dan information leakage.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Sembunyikan informasi teknologi server
        $response->headers->remove('X-Powered-By');
        $response->headers->remove('Server');

        // Cegah browser menebak MIME type (MIME sniffing attack)
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Cegah halaman ditampilkan dalam iframe dari domain lain (clickjacking)
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Batasi informasi Referer yang dikirim ke server lain
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Matikan fitur browser yang tidak diperlukan
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        // Paksa HTTPS di production (Strict-Transport-Security)
        if (app()->environment('production')) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        return $response;
    }
}
