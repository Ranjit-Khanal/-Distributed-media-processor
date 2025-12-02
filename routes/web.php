<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\Web\DashboardController::class, 'index'])->name('dashboard');

    // Media Library Routes
    Route::get('media', [\App\Http\Controllers\Web\MediaController::class, 'index'])->name('media.index');
    Route::get('media/{id}', [\App\Http\Controllers\Web\MediaController::class, 'show'])->name('media.show');
});

require __DIR__.'/settings.php';
