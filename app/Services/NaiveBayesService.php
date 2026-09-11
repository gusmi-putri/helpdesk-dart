<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class NaiveBayesService
{
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
     */
    public function predict(string $text): string
    {
        $words = $this->tokenize($text);
        
        $categories = DB::table('ai_nb_categories')->get();
        if ($categories->isEmpty()) {
            return 'Sedang'; // Default fallback if no training data
        }

        $totalDocuments = $categories->sum('document_count');
        
        // Get vocabulary size (total unique words across all categories)
        $vocabularySize = DB::table('ai_nb_words')->distinct('word')->count('word');

        $bestCategory = null;
        $maxLogProb = -INF;

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

            if ($logProbDoc > $maxLogProb) {
                $maxLogProb = $logProbDoc;
                $bestCategory = $category->name;
            }
        }

        return $bestCategory ?? 'Sedang';
    }
}
