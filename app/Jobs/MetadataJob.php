<?php

namespace App\Jobs;

use App\Services\MediaService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class MetadataJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 300; // 5 minutes

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $mediaFileId
    ) {}

    /**
     * Execute the job.
     */
    public function handle(MediaService $mediaService): void
    {
        try {
            Log::info("Extracting metadata for media file: {$this->mediaFileId}");
            $mediaService->extractMetadata($this->mediaFileId);
            Log::info("Metadata extracted successfully for media file: {$this->mediaFileId}");
        } catch (\Exception $e) {
            Log::error("Failed to extract metadata for media file {$this->mediaFileId}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("MetadataJob failed for media file {$this->mediaFileId}: " . $exception->getMessage());
    }
}

