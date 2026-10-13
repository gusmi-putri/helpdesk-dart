<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('ai:train')]
#[Description('Train the Naive Bayes AI using completed reports')]
class TrainDiagnosticAI extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(\App\Services\NaiveBayesService $aiService)
    {
        $this->info('Starting AI training from historical reports...');

        // Clear existing training data to avoid duplication during full retrain
        \Illuminate\Support\Facades\DB::table('ai_nb_words')->truncate();
        \Illuminate\Support\Facades\DB::table('ai_nb_categories')->delete(); // will cascade if setup properly, but safe to delete

        $reports = \App\Models\Report::where('status_laporan', 'Selesai')
            ->whereNotNull('deskripsi_kerusakan')
            ->whereNotNull('tingkat_kerusakan')
            ->get();

        $count = 0;
        foreach ($reports as $report) {
            $aiService->train($report->deskripsi_kerusakan, $report->tingkat_kerusakan);
            $count++;
        }

        $this->info("Successfully trained AI with {$count} completed reports!");
    }
}
