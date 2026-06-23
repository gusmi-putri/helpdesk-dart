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

Route::post('/feedback', [\App\Http\Controllers\FeedbackController::class, 'store'])->name('feedback.store');

Route::get('/login', function () {
    return Inertia::render('Helpdesk/Login');
})->name('login');

Route::post('/login', [LoginController::class, 'login']);
Route::get('/register', [RegisterController::class, 'index'])->name('register');
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Forgot Password Routes
Route::get('/forgot-password', [\App\Http\Controllers\ForgotPasswordController::class, 'index'])->name('password.request');
Route::post('/forgot-password/send-code', [\App\Http\Controllers\ForgotPasswordController::class, 'sendCode'])->name('password.email');
Route::post('/forgot-password/verify-reset', [\App\Http\Controllers\ForgotPasswordController::class, 'verifyAndReset'])->name('password.update');

// Satuan API (Guest can access for registration) - Added Throttling for security
Route::get('/api/satuans', [\App\Http\Controllers\SatuanController::class, 'index'])->middleware('throttle:30,1');
Route::post('/api/satuans', [\App\Http\Controllers\SatuanController::class, 'store'])->middleware('throttle:5,1');
Route::middleware(['auth'])->group(function () {
    Route::get('/admin', [DashboardController::class, 'admin'])->middleware('role:Admin');
    Route::get('/pelapor', [DashboardController::class, 'pelapor'])->middleware('role:Pelapor');
    Route::get('/staf', [DashboardController::class, 'staf'])->middleware('role:Staf');
    Route::get('/teknisi', [DashboardController::class, 'teknisi'])->middleware('role:Teknisi');

    // Satuans: Admin & Staf (Staf creates pending)
    Route::post('/satuans', [\App\Http\Controllers\SatuanController::class, 'store'])->middleware('role:Admin,Staf');
    Route::put('/satuans/{satuan}', [\App\Http\Controllers\SatuanController::class, 'update'])->middleware('role:Admin,Staf');
    Route::delete('/satuans/{satuan}', [\App\Http\Controllers\SatuanController::class, 'destroy'])->middleware('role:Admin,Staf');
    Route::post('/satuans/{satuan}/approve', [\App\Http\Controllers\SatuanController::class, 'approve'])->middleware('role:Admin')->name('satuans.approve');
    Route::post('/satuans/{satuan}/reject', [\App\Http\Controllers\SatuanController::class, 'reject'])->middleware('role:Admin')->name('satuans.reject');

    // Users: Admin & Staf (Staf creates pending)
    Route::resource('users', \App\Http\Controllers\UserController::class)->middleware('role:Admin,Staf');
    Route::post('/users/{id}/toggle-status', [\App\Http\Controllers\UserController::class, 'toggleStatus'])->middleware('role:Admin')->name('users.toggle-status');
    Route::post('/users/{id}/approve', [\App\Http\Controllers\UserController::class, 'approve'])->middleware('role:Admin')->name('users.approve');
    Route::post('/users/{id}/reject', [\App\Http\Controllers\UserController::class, 'reject'])->middleware('role:Admin')->name('users.reject');

    // Units: Admin & Staf (Staf creates pending)
    Route::post('units/import', [\App\Http\Controllers\UnitController::class, 'import'])->middleware('role:Admin,Staf')->name('units.import');
    Route::resource('units', \App\Http\Controllers\UnitController::class)->middleware('role:Admin,Staf');

    // Unit Mutations: request delete (Staf), approve/reject (Admin), restore (Admin)
    Route::post('/units/request-add-batch', [\App\Http\Controllers\UnitController::class, 'requestAddBatch'])->middleware('role:Staf')->name('units.request-add-batch');
    Route::post('/units/request-delete-batch', [\App\Http\Controllers\UnitController::class, 'requestDeleteBatch'])->middleware('role:Staf')->name('units.request-delete-batch');
    Route::post('/units/{unit}/request-delete', [\App\Http\Controllers\UnitController::class, 'requestDelete'])->middleware('role:Staf')->name('units.request-delete');
    Route::post('/mutations/{mutation}/approve', [\App\Http\Controllers\UnitController::class, 'approveMutation'])->middleware('role:Admin')->name('mutations.approve');
    Route::post('/mutations/{mutation}/reject', [\App\Http\Controllers\UnitController::class, 'rejectMutation'])->middleware('role:Admin')->name('mutations.reject');
    Route::post('/units/{unit}/restore', [\App\Http\Controllers\UnitController::class, 'restoreUnit'])->middleware('role:Admin')->name('units.restore');
});

// Reports Actions
Route::post('/reports', [ReportController::class, 'store'])->name('reports.store');
// Route handle is for Staf assigning technician
Route::post('/reports/{id}/handle', [ReportController::class, 'handle'])->name('reports.handle');
// Route complete is for Technician finishing task
Route::post('/reports/{id}/complete', [ReportController::class, 'complete'])->name('reports.complete');
Route::post('/reports/{id}/verify', [ReportController::class, 'verify'])->name('reports.verify');
Route::post('/reports/{id}/reject', [ReportController::class, 'reject'])->name('reports.reject');
Route::post('/reports/{id}/accept-task', [ReportController::class, 'acceptTask'])->name('reports.accept-task');
Route::post('/reports/{id}/start-progress', [ReportController::class, 'startProgress'])->name('reports.start-progress');
Route::get('/reports/{id}/pdf', [DashboardController::class, 'exportPdf'])->name('reports.pdf');

// AI Diagnostic Route
Route::post('/api/diagnose', [\App\Http\Controllers\AiDiagnosticController::class, 'diagnose'])->name('api.diagnose');

// Export Routes
Route::get('/admin/recap/export', [\App\Http\Controllers\RecapController::class, 'export'])->middleware(['auth', 'role:Admin'])->name('admin.recap.export');
Route::get('/staf/recap/export', [\App\Http\Controllers\RecapController::class, 'export'])->middleware(['auth', 'role:Staf'])->name('staf.recap.export');
