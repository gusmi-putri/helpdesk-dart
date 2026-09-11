<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ai_nb_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->unsignedInteger('document_count')->default(0);
            $table->timestamps();
        });

        Schema::create('ai_nb_words', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('ai_nb_categories')->onDelete('cascade');
            $table->string('word');
            $table->unsignedInteger('frequency')->default(0);
            $table->timestamps();
            
            $table->unique(['category_id', 'word']); // Fast lookup
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_nb_words');
        Schema::dropIfExists('ai_nb_categories');
    }
};
