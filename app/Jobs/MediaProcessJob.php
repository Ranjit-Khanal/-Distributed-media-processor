<?php

namespace App\Jobs;

use App\Services\MediaService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class MediaProcessJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 3600; // 1 hour

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
            Log::info("Processing media file: {$this->mediaFileId}");
            $mediaService->processMedia($this->mediaFileId);
            Log::info("Media file processed successfully: {$this->mediaFileId}");
        } catch (\Exception $e) {
            Log::error("Failed to process media file {$this->mediaFileId}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("MediaProcessJob failed for media file {$this->mediaFileId}: " . $exception->getMessage());
    }
}

