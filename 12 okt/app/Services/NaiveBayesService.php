<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class NaiveBayesService
{
    /**
     * Kata kunci kritis yang selalu dianggap tingkat kerusakan "Parah",
     * terlepas dari hasil prediksi statistik — demi keselamatan, kasus ini
     * tidak boleh tergantung pada kualitas/jumlah data latih yang ada.
     */
    protected array $criticalOverrideKeywords = [
        'api', 'asap', 'terbakar', 'kebakaran', 'konslet', 'korsleting',
        'meledak', 'ledakan', 'hangus', 'percikan api', 'bau terbakar',
        'short circuit', 'menyala sendiri',
    ];

    /**
     * Cek apakah teks mengandung kata kunci kritis yang wajib override ke "Parah".
     */
    protected function matchCriticalOverride(string $text): bool
    {
        $textLower = mb_strtolower($text);
        foreach ($this->criticalOverrideKeywords as $keyword) {
            if (str_contains($textLower, $keyword)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Clean and tokenize the text into an array of words.
     */
    protected function tokenize(string $text): array
    {
        // Convert to lowercase
        $text = mb_strtolower($text);
        // Remove punctuation and special characters
        $text = preg_replace('/[^\p{L}\p{N}\s]/u', ' ', $text);
        // Split by whitespace
        $words = preg_split('/\s+/', $text, -1, PREG_SPLIT_NO_EMPTY);
        
        return $words ?: [];
    }

    /**
     * Train the model with a new document.
     */
    public function train(string $text, string $categoryName): void
    {
        $words = $this->tokenize($text);
        if (empty($words)) {
            return;
        }

        DB::transaction(function () use ($words, $categoryName) {
            // Get or create category
            $category = DB::table('ai_nb_categories')->where('name', $categoryName)->first();
            
            if (!$category) {
                $categoryId = DB::table('ai_nb_categories')->insertGetId([
                    'name' => $categoryName,
                    'document_count' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                $categoryId = $category->id;
                DB::table('ai_nb_categories')->where('id', $categoryId)->increment('document_count');
            }

            // Count frequencies in this document
            $wordCounts = array_count_values($words);

            foreach ($wordCounts as $word => $count) {
                $existing = DB::table('ai_nb_words')
                    ->where('category_id', $categoryId)
                    ->where('word', $word)
                    ->first();

                if ($existing) {
                    DB::table('ai_nb_words')->where('id', $existing->id)->increment('frequency', $count);
                } else {
                    DB::table('ai_nb_words')->insert([
                        'category_id' => $categoryId,
                        'word' => $word,
                        'frequency' => $count,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        });
    }

    /**
     * Predict the category of a document.
     *
     * Mengembalikan array ['level' => string, 'confidence' => float (0-1), 'overridden' => bool]
     * 'overridden' bernilai true jika hasil dipaksa oleh aturan kata kunci kritis,
     * bukan oleh model statistik — ini penting ditampilkan ke pengguna agar transparan.
     */
    public function predict(string $text): array
    {
        if ($this->matchCriticalOverride($text)) {
            return ['level' => 'Parah', 'confidence' => 1.0, 'overridden' => true];
        }

        $words = $this->tokenize($text);

        $categories = DB::table('ai_nb_categories')->get();
        if ($categories->isEmpty()) {
            return ['level' => 'Sedang', 'confidence' => 0.0, 'overridden' => false]; // Default fallback if no training data
        }

        $totalDocuments = $categories->sum('document_count');

        // Get vocabulary size (total unique words across all categories)
        $vocabularySize = DB::table('ai_nb_words')->distinct('word')->count('word');

        $logProbs = [];

        foreach ($categories as $category) {
            // P(Category)
            $probCategory = log($category->document_count / $totalDocuments);

            // Total words in this category
            $totalWordsInCategory = DB::table('ai_nb_words')
                ->where('category_id', $category->id)
                ->sum('frequency');

            $logProbDoc = $probCategory;

            // Compute P(Word|Category) with Laplace Smoothing
            foreach ($words as $word) {
                $wordRecord = DB::table('ai_nb_words')
                    ->where('category_id', $category->id)
                    ->where('word', $word)
                    ->first();

                $wordFrequency = $wordRecord ? $wordRecord->frequency : 0;

                // Laplace smoothing: (count(word_in_category) + 1) / (total_words_in_category + vocab_size)
                $probWordGivenCategory = ($wordFrequency + 1) / ($totalWordsInCategory + $vocabularySize + 1); // added 1 to vocab size to prevent division by zero edge case

                $logProbDoc += log($probWordGivenCategory);
            }

            $logProbs[$category->name] = $logProbDoc;
        }

        if (empty($logProbs)) {
            return ['level' => 'Sedang', 'confidence' => 0.0, 'overridden' => false];
        }

        $bestCategory = array_keys($logProbs, max($logProbs))[0];
        $confidence = $this->logProbsToConfidence($logProbs, $bestCategory);

        return ['level' => $bestCategory, 'confidence' => $confidence, 'overridden' => false];
    }

    /**
     * Ubah kumpulan log-probability antar kategori menjadi confidence (0-1)
     * untuk kategori terbaik, menggunakan normalisasi softmax.
     */
    protected function logProbsToConfidence(array $logProbs, string $bestCategory): float
    {
        $maxLogProb = max($logProbs);

        // Geser semua log-prob relatif ke yang terbesar agar exp() tidak overflow,
        // lalu normalisasi (ini setara dengan softmax pada log-probability asli).
        $sumExp = 0.0;
        foreach ($logProbs as $logProb) {
            $sumExp += exp($logProb - $maxLogProb);
        }

        $bestExp = exp($logProbs[$bestCategory] - $maxLogProb);

        return $sumExp > 0 ? $bestExp / $sumExp : 0.0;
    }
}
