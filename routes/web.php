<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TicketController;

Route::get('/', function () {
    return Inertia::render('Helpdesk/Landing');
});

Route::get('/login', function () {
    return Inertia::render('Helpdesk/Login');
})->name('login');

Route::get('/admin', [DashboardController::class, 'admin']);
Route::get('/pelapor', [DashboardController::class, 'pelapor']);
Route::get('/staf', [DashboardController::class, 'staf']);
Route::get('/teknisi', [DashboardController::class, 'teknisi']);

// Tickets Actions
Route::post('/tickets', [TicketController::class, 'store'])->name('tickets.store');

// require __DIR__.'/auth.php'; // Dinonaktifkan sementara karena menggunakan Zustand auth
