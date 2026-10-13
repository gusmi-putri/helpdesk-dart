<?php

namespace App\Observers;

use App\Models\Report;
use Illuminate\Support\Facades\Storage;

class ReportObserver
{
    /**
     * Handle the Report "force deleted" event.
     */
    public function forceDeleted(Report $report): void
    {
        $this->deleteFiles($report->file_bukti);
        $this->deleteFiles($report->dokumen_anggaran);
        $this->deleteFiles($report->file_bukti_selesai);
    }

    /**
     * Handle the Report "updated" event.
     * Clean up old files if they are replaced.
     */
    public function updated(Report $report): void
    {
        if ($report->isDirty('file_bukti')) {
            $this->deleteOldFiles($report->getOriginal('file_bukti'), $report->file_bukti);
        }
        if ($report->isDirty('dokumen_anggaran')) {
            $this->deleteOldFiles($report->getOriginal('dokumen_anggaran'), $report->dokumen_anggaran);
        }
        if ($report->isDirty('file_bukti_selesai')) {
            $this->deleteOldFiles($report->getOriginal('file_bukti_selesai'), $report->file_bukti_selesai);
        }
    }

    private function deleteFiles(?string $data): void
    {
        if (!$data) return;

        // Cek jika data adalah JSON array
        $files = json_decode($data, true);
        
        if (json_last_error() === JSON_ERROR_NONE && is_array($files)) {
            foreach ($files as $file) {
                if (Storage::disk('public')->exists($file)) {
                    Storage::disk('public')->delete($file);
                }
            }
        } else {
            // Asumsi data adalah string tunggal (path)
            if (Storage::disk('public')->exists($data)) {
                Storage::disk('public')->delete($data);
            }
        }
    }

    private function deleteOldFiles(?string $originalData, ?string $newData): void
    {
        if (!$originalData) return;

        $originalFiles = $this->extractFiles($originalData);
        $newFiles = $this->extractFiles($newData);

        // Cari file yang ada di original tapi tidak ada di new
        $filesToDelete = array_diff($originalFiles, $newFiles);

        foreach ($filesToDelete as $file) {
            if (Storage::disk('public')->exists($file)) {
                Storage::disk('public')->delete($file);
            }
        }
    }

    private function extractFiles(?string $data): array
    {
        if (!$data) return [];
        $files = json_decode($data, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($files)) {
            return $files;
        }
        return [$data];
    }
}
