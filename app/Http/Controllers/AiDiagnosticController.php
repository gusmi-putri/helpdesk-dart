<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\GeminiService;
use App\Models\Unit;

class AiDiagnosticController extends Controller
{
    protected GeminiService $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * Handle the incoming request from the frontend to analyze a report.
     */
    public function diagnose(Request $request)
    {
        // Validate incoming data
        $validated = $request->validate([
            'deskripsi' => 'required|string',
            'tingkat_kerusakan' => 'required|string',
            'unit_id' => 'required'
        ]);

        // Find the unit name (optional, for better prompt context)
        $unitName = "Unit DART ID: " . $validated['unit_id'];
        $unit = Unit::find($validated['unit_id']);
        if ($unit) {
            $unitName = $unit->nomor_seri;
        }

        // Call the Gemini Service
        $diagnosis = $this->geminiService->getDiagnosticAdvice(
            $validated['deskripsi'],
            $validated['tingkat_kerusakan'],
            $unitName
        );

        return response()->json([
            'success' => true,
            'diagnosis' => $diagnosis
        ]);
    }
}
