<?php

namespace App\Repositories;

use App\Models\MediaFile;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface MediaRepositoryInterface
{
    public function find(int $id): ?MediaFile;
    public function findByUser(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function create(array $data): MediaFile;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function search(string $query, array $filters = [], int $perPage = 15): LengthAwarePaginator;
    public function findByStatus(string $status, int $perPage = 15): LengthAwarePaginator;
    public function getWithMetadata(int $id): ?MediaFile;
    public function attachTags(int $mediaFileId, array $tagIds): void;
    public function detachTags(int $mediaFileId, array $tagIds): void;
}

