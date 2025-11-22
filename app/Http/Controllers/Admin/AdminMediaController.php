<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\MediaRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminMediaController extends Controller
{
    public function __construct(
        private MediaRepositoryInterface $mediaRepository
    ) {}

    /**
     * Get all media files with filters, sorting, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'type' => $request->input('type'),
            'status' => $request->input('status'),
            'search' => $request->input('search'),
            'user_id' => $request->input('user_id'),
            'sort_by' => $request->input('sort_by', 'created_at'),
            'sort_order' => $request->input('sort_order', 'desc'),
        ];

        $perPage = min($request->input('per_page', 15), 100);

        if (isset($filters['search'])) {
            $results = $this->mediaRepository->search(
                $filters['search'],
                array_filter($filters),
                $perPage
            );
        } else {
            $query = \App\Models\MediaFile::select(['id', 'user_id', 'name', 'original_name', 'mime_type', 'type', 'size', 'status', 'created_at', 'updated_at'])
                ->with(['user:id,name,email', 'metadata:id,media_file_id,width,height']);

            if (isset($filters['type'])) {
                $query->where('type', $filters['type']);
            }

            if (isset($filters['status'])) {
                $query->where('status', $filters['status']);
            }

            if (isset($filters['user_id'])) {
                $query->where('user_id', $filters['user_id']);
            }

            $query->orderBy($filters['sort_by'], $filters['sort_order']);

            $results = $query->paginate($perPage);
        }

        return response()->json($results);
    }

    /**
     * Get media file statistics.
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => \App\Models\MediaFile::count(),
            'by_type' => \App\Models\MediaFile::selectRaw('type, count(*) as count')
                ->groupBy('type')
                ->pluck('count', 'type'),
            'by_status' => \App\Models\MediaFile::selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status'),
            'total_size' => \App\Models\MediaFile::sum('size'),
            'pending_processing' => \App\Models\MediaFile::where('status', 'pending')->count(),
        ];

        return response()->json(['data' => $stats]);
    }
}

