<?php

namespace App\Listeners;

use App\Events\MediaProcessed;
use App\Models\MediaFile;

class IndexMediaInSearch
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(MediaProcessed $event): void
    {
        $mediaFile = $event->mediaFile;

        // Index in Meilisearch via Laravel Scout
        $mediaFile->searchable();
    }
}

