<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\SatuanController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\AiDiagnosticController;
use App\Http\Controllers\RecapController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\NotificationController;
// ==========================================
// PUBLIC ROUTES (GUEST)
// ==========================================
Route::get('/', function () {
    return Inertia::render('Helpdesk/Landing');
});

Route::get('/login', function () {
    $lockoutUntil = session('lockout_until');
    $sisaDetik = $lockoutUntil ? max(0, $lockoutUntil - now()->timestamp) : 0;
    return Inertia::render('Helpdesk/Login', [
        'initialSisaDetik' => $sisaDetik
    ]);
})->name('login');

Route::post('/login', [LoginController::class, 'login'])->middleware('throttle:10,1');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Forgot Password Routes
Route::get('/forgot-password', [ForgotPasswordController::class, 'index'])->name('password.request');
Route::post('/forgot-password/send-code', [ForgotPasswordController::class, 'sendCode'])->middleware('throttle:3,1')->name('password.email');
Route::post('/forgot-password/verify-reset', [ForgotPasswordController::class, 'verifyAndReset'])->middleware('throttle:5,1')->name('password.update');

// Satuan API has been moved to authenticated routes

// ==========================================
// AUTHENTICATED ROUTES (WAJIB LOGIN)
// ==========================================
Route::middleware(['auth'])->group(function () {
    // --- API Routes ---
    Route::get('/api/satuans', [SatuanController::class, 'index'])->middleware('throttle:30,1');
    Route::get('/api/search', [SearchController::class, 'index'])->middleware('throttle:30,1');
    Route::get('/api/notifications', [NotificationController::class, 'index']);
    Route::post('/api/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::post('/api/notifications/{id}/read', [NotificationController::class, 'markAsRead']);    
    // --- Profile Routes ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'updateProfile'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    
    // --- Dashboard Routes ---
    Route::get('/admin', [DashboardController::class, 'admin'])->middleware('permission:view-dashboard-admin');
    Route::get('/pelapor', [DashboardController::class, 'pelapor'])->middleware('permission:view-dashboard-pelapor');
    Route::get('/staf', [DashboardController::class, 'staf'])->middleware('permission:view-dashboard-staf');
    Route::get('/teknisi', [DashboardController::class, 'teknisi'])->middleware('permission:view-dashboard-teknisi');

    Route::post('/maintenance-reports', [App\Http\Controllers\MaintenanceReportController::class, 'store'])->name('maintenance.store');

    // Satuan management (Admin & Staf Komando)
    Route::post('/satuans', [SatuanController::class, 'store'])->middleware('permission:create-satuans')->name('satuans.store');
    Route::put('/satuans/{satuan}', [SatuanController::class, 'update'])->middleware('permission:update-satuans');
    Route::delete('/satuans/{satuan}', [SatuanController::class, 'destroy'])->middleware('permission:delete-satuans');
    Route::post('/satuans/{satuan}/approve', [SatuanController::class, 'approve'])->middleware('permission:create-satuans')->name('satuans.approve');
    Route::post('/satuans/{satuan}/reject', [SatuanController::class, 'reject'])->middleware('permission:delete-satuans')->name('satuans.reject');

    // --- Roles ---
    Route::resource('roles', RoleController::class);

    // --- Users ---
    // Note: We use permission array on the resource controller directly or just allow read for the index, but let's secure the methods
    Route::resource('users', UserController::class);
    Route::post('/users/{id}/toggle-status', [UserController::class, 'toggleStatus'])->middleware('permission:update-users')->name('users.toggle-status');
    Route::post('/users/{id}/approve', [UserController::class, 'approve'])->middleware('permission:update-users')->name('users.approve');
    Route::post('/users/{id}/reject', [UserController::class, 'reject'])->middleware('permission:delete-users')->name('users.reject');

    // --- Units ---
    Route::post('units/import', [UnitController::class, 'import'])->middleware('permission:create-units')->name('units.import');
    Route::post('units/destroy-batch', [UnitController::class, 'destroyBatch'])->middleware('permission:delete-units')->name('units.destroy-batch');
    Route::resource('units', UnitController::class);

    // --- Unit Mutations ---
    Route::post('/units/request-add-batch', [UnitController::class, 'requestAddBatch'])->middleware('permission:create-mutations')->name('units.request-add-batch');
    Route::post('/units/request-delete-batch', [UnitController::class, 'requestDeleteBatch'])->middleware('permission:delete-mutations')->name('units.request-delete-batch');
    Route::post('/units/{unit}/request-delete', [UnitController::class, 'requestDelete'])->middleware('permission:delete-mutations')->name('units.request-delete');
    Route::post('/mutations/{mutation}/approve', [UnitController::class, 'approveMutation'])->middleware('permission:update-mutations')->name('mutations.approve');
    Route::post('/mutations/{mutation}/reject', [UnitController::class, 'rejectMutation'])->middleware('permission:update-mutations')->name('mutations.reject');
    Route::post('/units/{unit}/restore', [UnitController::class, 'restoreUnit'])->middleware('permission:update-units')->name('units.restore');

    // --- Reports Actions ---
    // Pelapor membuat laporan
    Route::post('/reports', [ReportController::class, 'store'])->middleware('permission:create-reports')->name('reports.store');
    
    // Staf menangani laporan (Assign teknisi)
    Route::post('/reports/{id}/handle', [ReportController::class, 'handle'])->middleware('permission:assign-reports')->name('reports.handle');
    
    // Teknisi mengerjakan laporan
    Route::post('/reports/{id}/accept-task', [ReportController::class, 'acceptTask'])->middleware('permission:process-reports')->name('reports.accept-task');
    Route::post('/reports/{id}/start-progress', [ReportController::class, 'startProgress'])->middleware('permission:process-reports')->name('reports.start-progress');
    Route::post('/reports/{id}/complete', [ReportController::class, 'complete'])->middleware('permission:process-reports')->name('reports.complete');
    
    // Admin / Staf memverifikasi hasil
    Route::post('/reports/{id}/verify', [ReportController::class, 'verify'])->middleware('permission:verify-reports')->name('reports.verify');
    Route::post('/reports/{id}/reject', [ReportController::class, 'reject'])->middleware('permission:verify-reports')->name('reports.reject');
    
    // Cetak PDF (Semua role yang login boleh mencetak/melihat dokumen PDF)
    Route::get('/reports/{id}/pdf', [DashboardController::class, 'exportPdf'])->middleware('role:Admin|Staf|Teknisi|Pelapor')->name('reports.pdf');

    Route::post('/api/diagnose', [AiDiagnosticController::class, 'diagnose'])
        ->middleware('throttle:10,1')
        ->name('api.diagnose');
    // --- Secure File Download ---
    // Hanya Admin, Staf, dan Pelapor (pemilik laporan) yang bisa download
    Route::get('/files/{path}', [FileController::class, 'download'])
        ->where('path', '.*')
        ->name('files.download');
});

// ==========================================
// EXPORT ROUTES
// ==========================================
Route::get('/admin/recap/export', [RecapController::class, 'export'])->middleware(['auth', 'permission:view-dashboard-admin|export-recap'])->name('admin.recap.export');
Route::get('/staf/recap/export', [RecapController::class, 'export'])->middleware(['auth', 'permission:view-dashboard-staf|export-recap'])->name('staf.recap.export');