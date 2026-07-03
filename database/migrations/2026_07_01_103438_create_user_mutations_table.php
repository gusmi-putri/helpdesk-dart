<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_mutations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('target_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('type', ['request_add', 'request_edit', 'request_delete', 'approved_add', 'approved_edit', 'approved_delete', 'rejected_add', 'rejected_edit', 'rejected_delete']);
            $table->text('reason')->nullable();
            $table->foreignId('requested_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->json('user_data')->nullable(); // Stores user info for pending add/edit requests
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_mutations');
    }
};

