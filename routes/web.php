<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;

use App\Http\Controllers\LoginController;

Route::get('/', function () {
    return Inertia::render('Helpdesk/Landing');
});

Route::get('/login', function () {
    return Inertia::render('Helpdesk/Login');
})->name('login');

Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

Route::middleware(['auth'])->group(function () {
    Route::get('/admin', [DashboardController::class, 'admin']);
    Route::get('/pelapor', [DashboardController::class, 'pelapor']);
    Route::get('/staf', [DashboardController::class, 'staf']);
    Route::get('/teknisi', [DashboardController::class, 'teknisi']);
    Route::resource('users', \App\Http\Controllers\UserController::class);
});

// Reports Actions
Route::post('/reports', [ReportController::class, 'store'])->name('reports.store');
Route::post('/reports/{id}/handle', [ReportController::class, 'handle'])->name('reports.handle');
Route::post('/reports/{id}/complete', [ReportController::class, 'complete'])->name('reports.complete');

// require __DIR__.'/auth.php'; // Dinonaktifkan sementara karena menggunakan Zustand auth
