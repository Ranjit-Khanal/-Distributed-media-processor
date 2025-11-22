<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\MediaService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function __construct(
        private MediaService $mediaService
    ) {}

    /**
     * Display the media library index page.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'type' => $request->input('type'),
            'status' => $request->input('status'),
            'search' => $request->input('search'),
            'sort_by' => $request->input('sort_by', 'created_at'),
            'sort_order' => $request->input('sort_order', 'desc'),
        ];

        // Filter out empty values and 'all' values
        $filters = array_filter($filters, function ($value) {
            return $value !== null && $value !== '' && $value !== 'all';
        });

        $perPage = min($request->input('per_page', 15), 100);

        $mediaFiles = $this->mediaService->getUserMedia(
            $request->user()->id,
            $filters,
            $perPage
        );

        return Inertia::render('media/index', [
            'mediaFiles' => $mediaFiles,
            'filters' => $filters,
        ]);
    }

    /**
     * Display a specific media file.
     */
    public function show(Request $request, int $id): Response
    {
        $mediaFile = $this->mediaService->getMediaFile($id, $request->user()->id);

        if (!$mediaFile) {
            abort(404);
        }

        // Get real-time status
        $statusResponse = $this->getMediaStatus($id);
        $mediaStatus = $statusResponse->getData(true)['data'] ?? null;

        return Inertia::render('media/show', [
            'mediaFile' => $mediaFile->load(['metadata', 'tags', 'user']),
            'mediaStatus' => $mediaStatus,
        ]);
    }

    /**
     * Get media status for real-time updates.
     */
    private function getMediaStatus(int $id)
    {
        $repository = app(\App\Repositories\MediaRepositoryInterface::class);
        $mediaFile = $repository->getWithMetadata($id);
        
        if (!$mediaFile) {
            return response()->json(['error' => 'Media file not found'], 404);
        }

        $progress = 0;
        if ($mediaFile->status === 'completed') {
            $progress = 100;
        } elseif ($mediaFile->status === 'processing') {
            if (!empty($mediaFile->compressed_path)) $progress += 40;
            if (!empty($mediaFile->thumbnails)) $progress += 30;
            if ($mediaFile->metadata) $progress += 30;
        }

        return response()->json([
            'data' => [
                'status' => $mediaFile->status,
                'progress' => $progress,
                'error_message' => $mediaFile->error_message,
            ],
        ]);
    }
}

