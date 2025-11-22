<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('original_name');
            $table->string('mime_type');
            $table->enum('type', ['image', 'video'])->index();
            $table->bigInteger('size')->index();
            $table->string('path');
            $table->string('compressed_path')->nullable();
            $table->string('thumbnail_path')->nullable();
            $table->json('thumbnails')->nullable(); // Array of thumbnail paths
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending')->index();
            $table->text('error_message')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Fulltext index for name search
            $table->index('name', 'media_files_name_idx');
            // B-tree index for created_at
            $table->index('created_at', 'media_files_created_at_idx');
        });

        // Add fulltext search index (PostgreSQL specific)
        DB::statement('CREATE INDEX media_files_name_fulltext_idx ON media_files USING gin(to_tsvector(\'english\', name));');
    }

    public function down(): void
    {
        Schema::dropIfExists('media_files');
    }
};

