<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\MediaService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private MediaService $mediaService
    ) {}

    /**
     * Display the dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get recent media files (limit to 6)
        $recentMedia = $this->mediaService->getUserMedia(
            $user->id,
            [],
            6
        );

        // Get statistics
        $stats = [
            'total' => \App\Models\MediaFile::where('user_id', $user->id)->count(),
            'images' => \App\Models\MediaFile::where('user_id', $user->id)->where('type', 'image')->count(),
            'videos' => \App\Models\MediaFile::where('user_id', $user->id)->where('type', 'video')->count(),
            'processing' => \App\Models\MediaFile::where('user_id', $user->id)
                ->whereIn('status', ['pending', 'processing'])
                ->count(),
        ];

        return Inertia::render('dashboard', [
            'recentMedia' => $recentMedia,
            'stats' => $stats,
        ]);
    }
}

