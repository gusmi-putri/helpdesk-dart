<?php

namespace Tests\Unit;

use App\Services\FileUploadService;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class FileUploadServiceTest extends TestCase
{
    public function test_rejects_dangerous_file_types_before_storage(): void
    {
        $service = new FileUploadService();
        $file = UploadedFile::fake()->create('shell.php', 100, 'application/x-php');

        $result = $service->uploadSingleFile($file, 'reports');

        $this->assertNull($result);
    }

    public function test_allows_safe_image_uploads(): void
    {
        $service = new FileUploadService();
        $file = UploadedFile::fake()->image('photo.jpg', 640, 480);

        $result = $service->uploadSingleFile($file, 'reports');

        $this->assertNotNull($result);
        $this->assertStringContainsString('reports/', $result);
    }
}
