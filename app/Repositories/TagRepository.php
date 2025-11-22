<?php

namespace App\Repositories;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class TagRepository implements TagRepositoryInterface
{
    public function find(int $id): ?Tag
    {
        return Tag::find($id);
    }

    public function findByName(string $name): ?Tag
    {
        return Tag::where('name', $name)->first();
    }

    public function findOrCreate(string $name): Tag
    {
        $tag = $this->findByName($name);
        
        if (!$tag) {
            $tag = $this->create([
                'name' => $name,
                'slug' => Str::slug($name),
            ]);
        }

        return $tag;
    }

    public function getAll(): Collection
    {
        return Tag::select(['id', 'name', 'slug'])->get();
    }

    public function create(array $data): Tag
    {
        return Tag::create($data);
    }

    public function search(string $query): Collection
    {
        return Tag::select(['id', 'name', 'slug'])
            ->where('name', 'ilike', '%' . $query . '%')
            ->get();
    }
}

