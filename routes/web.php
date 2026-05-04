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
    Route::get('/admin', [DashboardController::class, 'admin'])->middleware('role:Admin');
    Route::get('/pelapor', [DashboardController::class, 'pelapor'])->middleware('role:Pelapor');
    Route::get('/staf', [DashboardController::class, 'staf'])->middleware('role:Staf');
    Route::get('/teknisi', [DashboardController::class, 'teknisi'])->middleware('role:Teknisi');
    Route::resource('users', \App\Http\Controllers\UserController::class)->middleware('role:Admin');
});

// Reports Actions
Route::post('/reports', [ReportController::class, 'store'])->name('reports.store');
Route::post('/reports/{id}/handle', [ReportController::class, 'handle'])->name('reports.handle');
Route::post('/reports/{id}/complete', [ReportController::class, 'complete'])->name('reports.complete');
Route::get('/reports/{id}/pdf', [DashboardController::class, 'exportPdf'])->name('reports.pdf');


