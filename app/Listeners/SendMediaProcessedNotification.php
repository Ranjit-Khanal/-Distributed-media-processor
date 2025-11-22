<?php

namespace App\Listeners;

use App\Events\MediaProcessed;
use Illuminate\Support\Facades\Log;

class SendMediaProcessedNotification
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

        Log::info("Media file processed and ready", [
            'media_file_id' => $mediaFile->id,
            'user_id' => $mediaFile->user_id,
            'name' => $mediaFile->name,
            'type' => $mediaFile->type,
        ]);

        // Here you can add:
        // - Send email notification
        // - Send push notification
        // - Update real-time status via WebSockets
        // - Trigger webhook
    }
}

