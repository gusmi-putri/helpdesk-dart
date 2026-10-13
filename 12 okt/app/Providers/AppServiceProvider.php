<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        \Illuminate\Http\Resources\Json\JsonResource::withoutWrapping();
        \App\Models\Report::observe(\App\Observers\ReportObserver::class);
        \App\Models\UnitMutation::observe(\App\Observers\UnitMutationObserver::class);

        // Rate limiter untuk login: 5 percobaan per menit per IP
        RateLimiter::for('login', function ($request) {
            return Limit::perMinute(5)->by($request->ip());
        });
    }
}
