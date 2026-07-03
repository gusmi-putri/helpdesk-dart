<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $apiKey;
    protected string $apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key', '');
    }

    /**
     * Get diagnostic advice from Gemini based on the report description.
     *
     * @param string $description The issue description from the user
     * @param string $level The severity level (Ringan, Sedang, Parah)
     * @param string $unitName The unit/dart name
     * @return string|null The markdown response from Gemini, or null if failed
     */
    public function getDiagnosticAdvice(string $description, string $level, string $unitName): ?string
    {
        if (empty($this->apiKey)) {
            Log::error('Gemini API Key is missing.');
            return "Sistem AI sedang tidak aktif. Tim Teknisi akan segera menganalisis laporan Anda secara manual.";
        }

        // Membaca file buku panduan (knowledge base) jika ada
        $knowledgeBase = '';
        $kbPath = storage_path('app/knowledge_base_dart.md');
        if (file_exists($kbPath)) {
            $knowledgeBase = "\n\n=== BUKU PANDUAN RESMI DART ===\nGunakan referensi di bawah ini sebagai pedoman utama Anda dalam memberikan solusi perbaikan:\n\n" . file_get_contents($kbPath) . "\n=================================\n";
        }

        $systemInstruction = "Anda adalah Asisten AI Taktis untuk sistem SISFO DART (Sistem Latihan Menembak Militer BENGPUSKOMLEKAD). " .
            "Tugas Anda adalah memberikan kemungkinan penyebab dan 2-3 langkah pengecekan awal yang AMAN dilakukan pelapor (bukan teknisi) " .
            "berdasarkan deskripsi kendala yang diberikan. " .
            "Gunakan bahasa yang profesional, ringkas, dan taktis ala militer. Format menggunakan Markdown (*bold*, *bullet points*). " .
            "Peringatkan jika kendala parah untuk tidak melakukan tindakan yang membahayakan." . $knowledgeBase;

        $userMessage = "Target/Unit DART: {$unitName}\nTingkat Kerusakan: {$level}\nDeskripsi Kendala yang dilaporkan: {$description}\n\nTolong berikan analisis singkat dan saran langkah awal.";

        try {
            $response = Http::withoutVerifying()->withHeaders([
                'Content-Type' => 'application/json',
                'x-goog-api-key' => $this->apiKey,
            ])->post($this->apiUrl, [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [
                            ['text' => $systemInstruction . "\n\n" . $userMessage]
                        ]
                    ]
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                    return $data['candidates'][0]['content']['parts'][0]['text'];
                }
            }

            Log::error('Gemini API Error: ' . $response->body());
            return "Sistem AI sedang sibuk atau mengalami gangguan saat menganalisis. Laporan Anda telah aman diterima dan akan diperiksa oleh Teknisi.";

        } catch (\Exception $e) {
            Log::error('Gemini Exception: ' . $e->getMessage());
            return "Sistem AI gagal memproses permintaan. Laporan Anda tetap aman terkirim.";
        }
    }
}
