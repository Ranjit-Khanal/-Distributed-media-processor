<?php

namespace App\Providers;

use App\Events\MediaProcessed;
use App\Listeners\IndexMediaInSearch;
use App\Listeners\SendMediaProcessedNotification;
use App\Repositories\MediaRepository;
use App\Repositories\MediaRepositoryInterface;
use App\Repositories\TagRepository;
use App\Repositories\TagRepositoryInterface;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind repository interfaces to implementations
        $this->app->bind(MediaRepositoryInterface::class, MediaRepository::class);
        $this->app->bind(TagRepositoryInterface::class, TagRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register event listeners
        Event::listen(
            MediaProcessed::class,
            [SendMediaProcessedNotification::class, 'handle']
        );

        Event::listen(
            MediaProcessed::class,
            [IndexMediaInSearch::class, 'handle']
        );
    }
}
