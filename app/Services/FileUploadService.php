<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
    /**
     * Mengunggah satu file dengan nama khusus.
     */
    public function uploadSingleFile(?UploadedFile $file, string $directory, string $prefix = ''): ?string
    {
        if (!$file) {
            return null;
        }

        $extension = strtolower($file->getClientOriginalExtension() ?: $file->guessExtension() ?: 'bin');
        $extension = preg_replace('/[^a-z0-9]+/i', '', $extension) ?: 'bin';
        $filename = $prefix . uniqid('', true) . '_' . time() . '.' . $extension;
        $file->storeAs($directory, $filename, 'public');

        return trim($directory . '/' . $filename, '/');
    }

    /**
     * Mengunggah banyak file (array) ke direktori tertentu dengan batas maksimal.
     */
    public function uploadMultipleFiles(?array $files, string $directory, int $maxLimit = 5): array
    {
        if (empty($files)) {
            return [];
        }

        $filePaths = [];
        $filesToProcess = array_slice($files, 0, $maxLimit);
        
        foreach ($filesToProcess as $file) {
            if ($file instanceof UploadedFile) {
                $filePaths[] = $this->uploadSingleFile($file, $directory);
            }
        }

        return $filePaths;
    }
}
