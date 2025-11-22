<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MediaMetadata extends Model
{
    use HasFactory;

    protected $fillable = [
        'media_file_id',
        'metadata',
        'width',
        'height',
        'duration',
        'codec',
        'bitrate',
        'fps',
    ];

    protected $casts = [
        'metadata' => 'array',
        'width' => 'integer',
        'height' => 'integer',
        'duration' => 'integer',
        'bitrate' => 'integer',
        'fps' => 'decimal:2',
    ];

    /**
     * Get the media file that owns the metadata.
     */
    public function mediaFile(): BelongsTo
    {
        return $this->belongsTo(MediaFile::class);
    }
}

