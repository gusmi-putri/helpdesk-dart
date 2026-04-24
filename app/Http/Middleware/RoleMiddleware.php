<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();
        
        if (!$user || !$user->role) {
            abort(403, 'Akses Ditolak: Anda tidak memiliki otoritas untuk area ini.');
        }

        $userRole = strtolower($user->role->nama_role);
        $allowedRoles = array_map('strtolower', $roles);

        // Superadmin (Admin) selalu diizinkan akses ke area manapun
        if ($userRole === 'admin' || in_array($userRole, $allowedRoles)) {
            return $next($request);
        }

        abort(403, 'Akses Ditolak: Anda tidak memiliki otoritas untuk area ini.');

        return $next($request);
    }
}
