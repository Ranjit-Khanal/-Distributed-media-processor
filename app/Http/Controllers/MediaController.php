<?php

namespace App\Http\Controllers;

use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MediaController extends Controller
{
    public function __construct(
        private MediaService $mediaService
    ) {}

    /**
     * Upload a media file.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:102400', // 100MB max
            'tags' => 'sometimes|array',
            'tags.*' => 'string|max:50',
        ]);

        $file = $request->file('file');
        $tags = $request->input('tags', []);

        $mediaFile = $this->mediaService->uploadMedia(
            Auth::id(),
            $file,
            $tags
        );

        return response()->json([
            'message' => 'Media uploaded successfully',
            'data' => [
                'id' => $mediaFile->id,
                'name' => $mediaFile->name,
                'type' => $mediaFile->type,
                'status' => $mediaFile->status,
                'size' => $mediaFile->size,
            ],
        ], 201);
    }

    /**
     * Get user's media files.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'type' => $request->input('type'),
            'status' => $request->input('status'),
            'search' => $request->input('search'),
            'sort_by' => $request->input('sort_by', 'created_at'),
            'sort_order' => $request->input('sort_order', 'desc'),
        ];

        $perPage = min($request->input('per_page', 15), 100);

        $mediaFiles = $this->mediaService->getUserMedia(
            Auth::id(),
            array_filter($filters),
            $perPage
        );

        return response()->json($mediaFiles);
    }

    /**
     * Get a specific media file.
     */
    public function show(int $id): JsonResponse
    {
        $mediaFile = $this->mediaService->getMediaFile($id, Auth::id());

        if (!$mediaFile) {
            return response()->json([
                'error' => 'Media file not found',
            ], 404);
        }

        return response()->json([
            'data' => $mediaFile,
        ]);
    }

    /**
     * Delete a media file.
     */
    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->mediaService->deleteMedia($id, Auth::id());

        if (!$deleted) {
            return response()->json([
                'error' => 'Media file not found',
            ], 404);
        }

        return response()->json([
            'message' => 'Media file deleted successfully',
        ]);
    }

    /**
     * Search media files.
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'query' => 'required|string|min:1|max:255',
            'type' => 'sometimes|in:image,video',
            'status' => 'sometimes|in:pending,processing,completed,failed',
            'sort_by' => 'sometimes|string',
            'sort_order' => 'sometimes|in:asc,desc',
        ]);

        $filters = [
            'type' => $request->input('type'),
            'status' => $request->input('status'),
            'user_id' => Auth::id(),
            'sort_by' => $request->input('sort_by', 'created_at'),
            'sort_order' => $request->input('sort_order', 'desc'),
        ];

        // Filter out empty values and 'all' values
        $filters = array_filter($filters, function ($value) {
            return $value !== null && $value !== '' && $value !== 'all';
        });

        $perPage = min($request->input('per_page', 15), 100);

        $results = $this->mediaService->searchMedia(
            $request->input('query'),
            $filters,
            $perPage
        );

        return response()->json($results);
    }
}

