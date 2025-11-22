<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_metadata', function (Blueprint $table) {
            $table->id();
            $table->foreignId('media_file_id')->constrained('media_files')->onDelete('cascade');
            $table->jsonb('metadata')->nullable(); // JSONB for efficient querying
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->integer('duration')->nullable(); // For videos, in seconds
            $table->string('codec')->nullable();
            $table->integer('bitrate')->nullable();
            $table->decimal('fps', 5, 2)->nullable(); // Frames per second for videos
            $table->timestamps();

            // GIN index for JSONB metadata
            $table->index('metadata', 'media_metadata_metadata_idx', 'gin');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_metadata');
    }
};

