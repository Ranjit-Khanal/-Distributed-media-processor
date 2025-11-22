<?php

namespace App\Repositories;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Collection;

interface TagRepositoryInterface
{
    public function find(int $id): ?Tag;
    public function findByName(string $name): ?Tag;
    public function findOrCreate(string $name): Tag;
    public function getAll(): Collection;
    public function create(array $data): Tag;
    public function search(string $query): Collection;
}

