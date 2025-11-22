<?php

namespace App\Http\Controllers;

use App\Repositories\MediaRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class MediaStatusController extends Controller
{
    public function __construct(
        private MediaRepositoryInterface $mediaRepository
    ) {}

    /**
     * Get real-time processing status of a media file.
     */
    public function show(int $id): JsonResponse
    {
        $mediaFile = $this->mediaRepository->getWithMetadata($id);

        if (!$mediaFile || $mediaFile->user_id !== Auth::id()) {
            return response()->json([
                'error' => 'Media file not found',
            ], 404);
        }

        return response()->json([
            'data' => [
                'id' => $mediaFile->id,
                'status' => $mediaFile->status,
                'progress' => $this->calculateProgress($mediaFile),
                'error_message' => $mediaFile->error_message,
                'has_compressed' => !empty($mediaFile->compressed_path),
                'has_thumbnails' => !empty($mediaFile->thumbnails),
                'has_metadata' => $mediaFile->metadata !== null,
            ],
        ]);
    }

    /**
     * Calculate processing progress percentage.
     */
    private function calculateProgress($mediaFile): int
    {
        $progress = 0;

        if ($mediaFile->status === 'completed') {
            return 100;
        }

        if ($mediaFile->status === 'failed') {
            return 0;
        }

        // Calculate based on what's been processed
        if (!empty($mediaFile->compressed_path)) {
            $progress += 40;
        }

        if (!empty($mediaFile->thumbnails)) {
            $progress += 30;
        }

        if ($mediaFile->metadata !== null) {
            $progress += 30;
        }

        return min($progress, 99);
    }
}

