<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Helpdesk/Landing');
});

Route::get('/login', function () {
    return Inertia::render('Helpdesk/Login');
})->name('login');

Route::get('/admin', function () {
    return Inertia::render('Helpdesk/DashboardAdmin');
});

Route::get('/pelapor', function () {
    return Inertia::render('Helpdesk/DashboardPelapor');
});

Route::get('/staf', function () {
    return Inertia::render('Helpdesk/DashboardStaf');
});

Route::get('/teknisi', function () {
    return Inertia::render('Helpdesk/DashboardTeknisi');
});

// require __DIR__.'/auth.php'; // Dinonaktifkan sementara karena menggunakan Zustand auth

