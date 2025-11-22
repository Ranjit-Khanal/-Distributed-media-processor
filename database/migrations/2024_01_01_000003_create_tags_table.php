<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->timestamps();

            // Fulltext index for tag search
            $table->index('name', 'tags_name_idx');
        });

        // Add fulltext search index (PostgreSQL specific)
        DB::statement('CREATE INDEX tags_name_fulltext_idx ON tags USING gin(to_tsvector(\'english\', name));');
    }

    public function down(): void
    {
        Schema::dropIfExists('tags');
    }
};

