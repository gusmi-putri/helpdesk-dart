<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;

use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;

Route::get('/', function () {
    return Inertia::render('Helpdesk/Landing');
});

Route::get('/login', function () {
    return Inertia::render('Helpdesk/Login');
})->name('login');

Route::post('/login', [LoginController::class, 'login']);
Route::get('/register', [RegisterController::class, 'index'])->name('register');
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

Route::middleware(['auth'])->group(function () {
    Route::get('/admin', [DashboardController::class, 'admin'])->middleware('role:Admin');
    Route::get('/pelapor', [DashboardController::class, 'pelapor'])->middleware('role:Pelapor');
    Route::get('/staf', [DashboardController::class, 'staf'])->middleware('role:Staf');
    Route::get('/teknisi', [DashboardController::class, 'teknisi'])->middleware('role:Teknisi');
    Route::resource('users', \App\Http\Controllers\UserController::class)->middleware('role:Admin');
    Route::post('/users/{id}/toggle-status', [\App\Http\Controllers\UserController::class, 'toggleStatus'])->middleware('role:Admin')->name('users.toggle-status');
    Route::post('/users/{id}/approve', [\App\Http\Controllers\UserController::class, 'approve'])->middleware('role:Admin')->name('users.approve');
    Route::resource('units', \App\Http\Controllers\UnitController::class)->middleware('role:Admin');
});

// Reports Actions
Route::post('/reports', [ReportController::class, 'store'])->name('reports.store');
// Route handle is for Staf assigning technician
Route::post('/reports/{id}/handle', [ReportController::class, 'handle'])->name('reports.handle');
// Route complete is for Technician finishing task
Route::post('/reports/{id}/complete', [ReportController::class, 'complete'])->name('reports.complete');
Route::get('/reports/{id}/pdf', [DashboardController::class, 'exportPdf'])->name('reports.pdf');

// Export Routes
Route::get('/admin/recap/export', [\App\Http\Controllers\RecapController::class, 'export'])->middleware(['auth', 'role:Admin'])->name('admin.recap.export');
Route::get('/staf/recap/export', [\App\Http\Controllers\RecapController::class, 'export'])->middleware(['auth', 'role:Staf'])->name('staf.recap.export');
