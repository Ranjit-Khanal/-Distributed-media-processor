<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateMediaTypeMiddleware
{
    /**
     * Allowed MIME types for uploads.
     */
    private const ALLOWED_MIME_TYPES = [
        // Images
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        // Videos
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'video/x-msvideo',
        'video/webm',
    ];

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $mimeType = $file->getMimeType();

            if (!in_array($mimeType, self::ALLOWED_MIME_TYPES)) {
                return response()->json([
                    'error' => 'Invalid file type. Allowed types: ' . implode(', ', self::ALLOWED_MIME_TYPES),
                ], 422);
            }
        }

        return $next($request);
    }
}

