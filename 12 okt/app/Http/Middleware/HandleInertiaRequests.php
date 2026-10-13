<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'db_id' => $request->user()->id,
                    'id' => 'USR-' . str_pad($request->user()->id, 3, '0', STR_PAD_LEFT),
                    'username' => $request->user()->username,
                    'name' => $request->user()->nama_lengkap,
                    'roles' => $request->user()->roles->pluck('name'),
                    'permissions' => $request->user()->getAllPermissions()->pluck('name'),
                    'satuan' => $request->user()->satuan?->nama_satuan ?? $request->user()->asal_satuan ?? 'SATUAN TIDAK DIKETAHUI',
                ] : null,
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'error' => fn () => $request->session()->get('error'),
                'success' => fn () => $request->session()->get('success'),
                'import_result' => fn () => $request->session()->get('import_result'),
            ],
        ];
    }
}
