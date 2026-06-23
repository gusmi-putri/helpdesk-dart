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

        $filename = $prefix . time() . '_' . $file->getClientOriginalName();
        $file->storeAs($directory, $filename, 'public');
        
        return $filename; // Returns only filename if stored with storeAs and specific name
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
                $path = $file->store($directory, 'public');
                $filePaths[] = $path;
            }
        }

        return $filePaths;
    }
}
