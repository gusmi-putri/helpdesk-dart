<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\LocalDiagnosticService;
use App\Models\Unit;

class AiDiagnosticController extends Controller
{
    protected LocalDiagnosticService $diagnosticService;
    protected \App\Services\NaiveBayesService $aiService;

    public function __construct(LocalDiagnosticService $diagnosticService, \App\Services\NaiveBayesService $aiService)
    {
        $this->diagnosticService = $diagnosticService;
        $this->aiService = $aiService;
    }

    /**
     * Handle the incoming request to analyze a report locally.
     * Menggunakan analisis lokal berbasis aturan — tidak memerlukan API eksternal.
     */
    public function diagnose(Request $request)
    {
        // Validate incoming data
        $validated = $request->validate([
            'deskripsi'         => 'required|string|max:1000',
            // 'tingkat_kerusakan' is no longer required, AI will predict it
            'unit_id'           => 'required|exists:units,id',
        ]);

        // Sanitasi input untuk mencegah injeksi
        $deskripsi = strip_tags($validated['deskripsi']);

        // Find the unit name
        $unitName = "Unit DART ID: " . $validated['unit_id'];
        $unit = Unit::find($validated['unit_id']);
        if ($unit) {
            $unitName = $unit->nomor_seri;
        }

        // PREDICT TINGKAT KERUSAKAN MENGGUNAKAN SELF-LEARNING AI
        $predictedLevel = $this->aiService->predict($deskripsi);

        // Jalankan analisis lokal
        $diagnosis = $this->diagnosticService->getDiagnosticAdvice(
            $deskripsi,
            $predictedLevel,
            $unitName
        );

        return response()->json([
            'success'   => true,
            'predicted_level' => $predictedLevel,
            'diagnosis' => $diagnosis
        ]);
    }
}

