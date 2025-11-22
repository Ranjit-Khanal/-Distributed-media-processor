<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class MediaFile extends Model
{
    use HasFactory, SoftDeletes, Searchable;

    protected $fillable = [
        'user_id',
        'name',
        'original_name',
        'mime_type',
        'type',
        'size',
        'path',
        'compressed_path',
        'thumbnail_path',
        'thumbnails',
        'status',
        'error_message',
    ];

    protected $casts = [
        'thumbnails' => 'array',
        'size' => 'integer',
    ];

    /**
     * Get the user that owns the media file.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the metadata for the media file.
     */
    public function metadata(): HasOne
    {
        return $this->hasOne(MediaMetadata::class);
    }

    /**
     * Get the tags for the media file.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'media_tag');
    }

    /**
     * Get the indexable data array for the model.
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'original_name' => $this->original_name,
            'type' => $this->type,
            'mime_type' => $this->mime_type,
            'status' => $this->status,
            'user_id' => $this->user_id,
            'created_at' => $this->created_at->timestamp,
        ];
    }
}

