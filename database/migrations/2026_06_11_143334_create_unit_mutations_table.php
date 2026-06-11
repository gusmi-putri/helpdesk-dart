<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('unit_mutations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('unit_id')->nullable()->constrained('units')->nullOnDelete();
            $table->enum('type', ['request_add', 'request_delete', 'approved_add', 'approved_delete', 'rejected_add', 'rejected_delete', 'restore']);
            $table->text('reason')->nullable();
            $table->string('document_path')->nullable();
            $table->foreignId('requested_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->json('unit_data')->nullable(); // Stores unit info for pending add requests
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('unit_mutations');
    }
};
