<?php

use App\Http\Controllers\Admin\AdminMediaController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\MediaStatusController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes (if needed)
Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

// Authenticated routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Media upload and management
    Route::prefix('media')->group(function () {
        Route::post('/upload', [MediaController::class, 'upload'])
            ->middleware('validate.media.type');
        Route::get('/', [MediaController::class, 'index']);
        Route::get('/search', [MediaController::class, 'search']);
        Route::get('/{id}', [MediaController::class, 'show']);
        Route::delete('/{id}', [MediaController::class, 'destroy']);
    });

    // Real-time status
    Route::get('/media/{id}/status', [MediaStatusController::class, 'show']);
});

// Admin routes (with API key middleware)
Route::middleware(['auth:sanctum', 'api.key'])->prefix('admin')->group(function () {
    Route::prefix('media')->group(function () {
        Route::get('/', [AdminMediaController::class, 'index']);
        Route::get('/statistics', [AdminMediaController::class, 'statistics']);
    });
});

