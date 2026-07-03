<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\SatuanController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\AiDiagnosticController;
use App\Http\Controllers\RecapController;

// ==========================================
// PUBLIC ROUTES (GUEST)
// ==========================================
Route::get('/', function () {
    return Inertia::render('Helpdesk/Landing');
});

Route::post('/feedback', [FeedbackController::class, 'store'])->name('feedback.store');

Route::get('/login', function () {
    return Inertia::render('Helpdesk/Login');
})->name('login');

Route::post('/login', [LoginController::class, 'login']);
Route::get('/register', [RegisterController::class, 'index'])->name('register');
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Forgot Password Routes
Route::get('/forgot-password', [ForgotPasswordController::class, 'index'])->name('password.request');
Route::post('/forgot-password/send-code', [ForgotPasswordController::class, 'sendCode'])->name('password.email');
Route::post('/forgot-password/verify-reset', [ForgotPasswordController::class, 'verifyAndReset'])->name('password.update');

// Satuan API (Guest can access for registration) - Added Throttling for security
Route::get('/api/satuans', [SatuanController::class, 'index'])->middleware('throttle:30,1');
Route::post('/api/satuans', [SatuanController::class, 'store'])->middleware('throttle:5,1');


// ==========================================
// AUTHENTICATED ROUTES (WAJIB LOGIN)
// ==========================================
Route::middleware(['auth'])->group(function () {
    
    // --- Dashboard Routes ---
    Route::get('/admin', [DashboardController::class, 'admin'])->middleware('role:Admin');
    Route::get('/pelapor', [DashboardController::class, 'pelapor'])->middleware('role:Pelapor');
    Route::get('/staf', [DashboardController::class, 'staf'])->middleware('role:Staf');
    Route::get('/teknisi', [DashboardController::class, 'teknisi'])->middleware('role:Teknisi');

    // --- Satuans ---
    Route::post('/satuans', [SatuanController::class, 'store'])->middleware('role:Admin,Staf');
    Route::put('/satuans/{satuan}', [SatuanController::class, 'update'])->middleware('role:Admin,Staf');
    Route::delete('/satuans/{satuan}', [SatuanController::class, 'destroy'])->middleware('role:Admin,Staf');
    Route::post('/satuans/{satuan}/approve', [SatuanController::class, 'approve'])->middleware('role:Admin')->name('satuans.approve');
    Route::post('/satuans/{satuan}/reject', [SatuanController::class, 'reject'])->middleware('role:Admin')->name('satuans.reject');

    // --- Users ---
    Route::resource('users', UserController::class)->middleware('role:Admin,Staf');
    Route::post('/users/{id}/toggle-status', [UserController::class, 'toggleStatus'])->middleware('role:Admin')->name('users.toggle-status');
    Route::post('/users/{id}/approve', [UserController::class, 'approve'])->middleware('role:Admin')->name('users.approve');
    Route::post('/users/{id}/reject', [UserController::class, 'reject'])->middleware('role:Admin')->name('users.reject');

    // --- Units ---
    Route::post('units/import', [UnitController::class, 'import'])->middleware('role:Admin,Staf')->name('units.import');
    Route::post('units/destroy-batch', [UnitController::class, 'destroyBatch'])->middleware('role:Admin')->name('units.destroy-batch');
    Route::resource('units', UnitController::class)->middleware('role:Admin,Staf');

    // --- Unit Mutations ---
    Route::post('/units/request-add-batch', [UnitController::class, 'requestAddBatch'])->middleware('role:Staf')->name('units.request-add-batch');
    Route::post('/units/request-delete-batch', [UnitController::class, 'requestDeleteBatch'])->middleware('role:Staf')->name('units.request-delete-batch');
    Route::post('/units/{unit}/request-delete', [UnitController::class, 'requestDelete'])->middleware('role:Staf')->name('units.request-delete');
    Route::post('/mutations/{mutation}/approve', [UnitController::class, 'approveMutation'])->middleware('role:Admin')->name('mutations.approve');
    Route::post('/mutations/{mutation}/reject', [UnitController::class, 'rejectMutation'])->middleware('role:Admin')->name('mutations.reject');
    Route::post('/units/{unit}/restore', [UnitController::class, 'restoreUnit'])->middleware('role:Admin')->name('units.restore');

    // --- Reports Actions (SEKARANG AMAN) ---
    // Pelapor membuat laporan
    Route::post('/reports', [ReportController::class, 'store'])->middleware('role:Pelapor,Admin,Staf')->name('reports.store');
    
    // Staf menangani laporan (Assign teknisi)
    Route::post('/reports/{id}/handle', [ReportController::class, 'handle'])->middleware('role:Staf,Admin')->name('reports.handle');
    
    // Teknisi mengerjakan laporan
    Route::post('/reports/{id}/accept-task', [ReportController::class, 'acceptTask'])->middleware('role:Teknisi')->name('reports.accept-task');
    Route::post('/reports/{id}/start-progress', [ReportController::class, 'startProgress'])->middleware('role:Teknisi')->name('reports.start-progress');
    Route::post('/reports/{id}/complete', [ReportController::class, 'complete'])->middleware('role:Teknisi')->name('reports.complete');
    
    // Admin / Staf memverifikasi hasil
    Route::post('/reports/{id}/verify', [ReportController::class, 'verify'])->middleware('role:Admin,Staf')->name('reports.verify');
    Route::post('/reports/{id}/reject', [ReportController::class, 'reject'])->middleware('role:Admin,Staf')->name('reports.reject');
    
    // Cetak PDF (Semua role yang login boleh mencetak/melihat dokumen PDF)
    Route::get('/reports/{id}/pdf', [DashboardController::class, 'exportPdf'])->middleware('role:Admin,Staf,Teknisi,Pelapor')->name('reports.pdf');

    // --- AI Diagnostic Route (SEKARANG AMAN) ---
    Route::post('/api/diagnose', [AiDiagnosticController::class, 'diagnose'])->name('api.diagnose');
});

// ==========================================
// EXPORT ROUTES
// (Sudah aman karena menggunakan array middleware eksplisit)
// ==========================================
Route::get('/admin/recap/export', [RecapController::class, 'export'])->middleware(['auth', 'role:Admin'])->name('admin.recap.export');
Route::get('/staf/recap/export', [RecapController::class, 'export'])->middleware(['auth', 'role:Staf'])->name('staf.recap.export');