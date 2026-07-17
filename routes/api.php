<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// Di routes/api.php
use App\Http\Controllers\SatuanController; // Tambahkan ini di bagian atas file
use App\Http\Controllers\AiDiagnosticController;
use App\Http\Controllers\RegisterController; // Pastikan controller-nya sesuai
// Tambahkan di bagian atas file
use App\Http\Controllers\ForgotPasswordController; // Pastikan path-nya benar

// Tambahkan di bawah
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendCode']);
Route::post('/register', [RegisterController::class, 'register']);
Route::get('/satuan', [SatuanController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/satuan', [SatuanController::class, 'store']);
    Route::put('/satuan/{id}', [SatuanController::class, 'update']);
    Route::delete('/satuan/{id}', [SatuanController::class, 'destroy']);
    Route::post('/ai/diagnose', [AiDiagnosticController::class, 'diagnose']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
