<?php

namespace App\Repositories;

use App\Models\MediaFile;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class MediaRepository implements MediaRepositoryInterface
{
    public function find(int $id): ?MediaFile
    {
        return MediaFile::select(['id', 'user_id', 'name', 'original_name', 'mime_type', 'type', 'size', 'path', 'compressed_path', 'thumbnail_path', 'thumbnails', 'status', 'created_at', 'updated_at'])
            ->find($id);
    }

    public function findByUser(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = MediaFile::select(['id', 'user_id', 'name', 'original_name', 'mime_type', 'type', 'size', 'path', 'compressed_path', 'thumbnail_path', 'thumbnails', 'status', 'created_at', 'updated_at'])
            ->where('user_id', $userId)
            ->with(['metadata:id,media_file_id,width,height,duration', 'tags:id,name,slug']);

        // Apply filters
        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['search'])) {
            $query->where('name', 'ilike', '%' . $filters['search'] . '%');
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        return $query->paginate($perPage);
    }

    public function create(array $data): MediaFile
    {
        return MediaFile::create($data);
    }

    public function update(int $id, array $data): bool
    {
        return MediaFile::where('id', $id)->update($data) > 0;
    }

    public function delete(int $id): bool
    {
        return MediaFile::where('id', $id)->delete() > 0;
    }

    public function search(string $query, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $builder = MediaFile::select(['id', 'user_id', 'name', 'original_name', 'mime_type', 'type', 'size', 'path', 'compressed_path', 'thumbnail_path', 'thumbnails', 'status', 'created_at', 'updated_at'])
            ->with(['metadata:id,media_file_id,width,height,duration', 'tags:id,name,slug'])
            ->where(function (Builder $q) use ($query) {
                $q->where('name', 'ilike', '%' . $query . '%')
                    ->orWhere('original_name', 'ilike', '%' . $query . '%');
            });

        // Apply additional filters
        if (isset($filters['type'])) {
            $builder->where('type', $filters['type']);
        }

        if (isset($filters['status'])) {
            $builder->where('status', $filters['status']);
        }

        if (isset($filters['user_id'])) {
            $builder->where('user_id', $filters['user_id']);
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $builder->orderBy($sortBy, $sortOrder);

        return $builder->paginate($perPage);
    }

    public function findByStatus(string $status, int $perPage = 15): LengthAwarePaginator
    {
        return MediaFile::select(['id', 'user_id', 'name', 'original_name', 'mime_type', 'type', 'size', 'path', 'compressed_path', 'thumbnail_path', 'thumbnails', 'status', 'created_at', 'updated_at'])
            ->where('status', $status)
            ->with(['metadata:id,media_file_id,width,height,duration'])
            ->orderBy('created_at', 'asc')
            ->paginate($perPage);
    }

    public function getWithMetadata(int $id): ?MediaFile
    {
        return MediaFile::select(['id', 'user_id', 'name', 'original_name', 'mime_type', 'type', 'size', 'path', 'compressed_path', 'thumbnail_path', 'thumbnails', 'status', 'created_at', 'updated_at'])
            ->with(['metadata', 'tags', 'user:id,name,email'])
            ->find($id);
    }

    public function attachTags(int $mediaFileId, array $tagIds): void
    {
        $mediaFile = MediaFile::find($mediaFileId);
        if ($mediaFile) {
            $mediaFile->tags()->syncWithoutDetaching($tagIds);
        }
    }

    public function detachTags(int $mediaFileId, array $tagIds): void
    {
        $mediaFile = MediaFile::find($mediaFileId);
        if ($mediaFile) {
            $mediaFile->tags()->detach($tagIds);
        }
    }
}

