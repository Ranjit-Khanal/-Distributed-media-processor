<?php

namespace App\Services;

use App\Events\MediaProcessed;
use App\Jobs\MediaProcessJob;
use App\Jobs\MetadataJob;
use App\Jobs\ThumbnailJob;
use App\Repositories\MediaRepositoryInterface;
use App\Repositories\TagRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaService
{
    public function __construct(
        private MediaRepositoryInterface $mediaRepository,
        private TagRepositoryInterface $tagRepository
    ) {}

    public function uploadMedia(int $userId, UploadedFile $file, ?array $tags = null): \App\Models\MediaFile
    {
        // Determine file type
        $mimeType = $file->getMimeType();
        $type = str_starts_with($mimeType, 'image/') ? 'image' : 'video';

        // Generate unique filename
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid() . '.' . $extension;
        $path = 'media/' . $type . '/' . date('Y/m') . '/' . $filename;

        // Store file
        Storage::disk('local')->put($path, file_get_contents($file->getRealPath()));

        // Create media file record
        $mediaFile = $this->mediaRepository->create([
            'user_id' => $userId,
            'name' => pathinfo($originalName, PATHINFO_FILENAME),
            'original_name' => $originalName,
            'mime_type' => $mimeType,
            'type' => $type,
            'size' => $file->getSize(),
            'path' => $path,
            'status' => 'pending',
        ]);

        // Attach tags if provided
        if ($tags) {
            $tagIds = [];
            foreach ($tags as $tagName) {
                $tag = $this->tagRepository->findOrCreate($tagName);
                $tagIds[] = $tag->id;
            }
            $this->mediaRepository->attachTags($mediaFile->id, $tagIds);
        }

        // Dispatch processing job
        MediaProcessJob::dispatch($mediaFile->id);

        return $mediaFile;
    }

    public function processMedia(int $mediaFileId): void
    {
        $mediaFile = $this->mediaRepository->find($mediaFileId);
        
        if (!$mediaFile) {
            return;
        }

        // Update status to processing
        $this->mediaRepository->update($mediaFileId, ['status' => 'processing']);

        try {
            // Dispatch jobs for processing
            ThumbnailJob::dispatch($mediaFileId);
            MetadataJob::dispatch($mediaFileId);

            // Process compression based on type
            if ($mediaFile->type === 'image') {
                $this->compressImage($mediaFile);
            } else {
                $this->compressVideo($mediaFile);
            }

            // Reload media file to get latest data
            $mediaFile = $this->mediaRepository->find($mediaFileId);

            // Update status to completed
            $this->mediaRepository->update($mediaFileId, ['status' => 'completed']);

            // Reload again for event
            $mediaFile = $this->mediaRepository->find($mediaFileId);

            // Fire event
            event(new MediaProcessed($mediaFile));
        } catch (\Exception $e) {
            $this->mediaRepository->update($mediaFileId, [
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    private function compressImage(\App\Models\MediaFile $mediaFile): void
    {
        $fullPath = Storage::disk('local')->path($mediaFile->path);
        $compressedPath = 'media/compressed/' . date('Y/m') . '/' . Str::uuid() . '.jpg';

        // Use Intervention Image to compress
        $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Imagick\Driver());
        $image = $manager->read($fullPath);
        $image->scaleDown(1920, 1080); // Max dimensions
        
        // Save as JPEG with 85% quality
        $compressedImage = $image->toJpeg(85);
        Storage::disk('local')->put($compressedPath, $compressedImage);

        $this->mediaRepository->update($mediaFile->id, [
            'compressed_path' => $compressedPath,
        ]);
    }

    private function compressVideo(\App\Models\MediaFile $mediaFile): void
    {
        $fullPath = Storage::disk('local')->path($mediaFile->path);
        $compressedPath = 'media/compressed/' . date('Y/m') . '/' . Str::uuid() . '.mp4';

        // FFmpeg command to compress video
        $command = sprintf(
            'ffmpeg -i %s -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart %s 2>&1',
            escapeshellarg($fullPath),
            escapeshellarg(Storage::disk('local')->path($compressedPath))
        );

        exec($command, $output, $returnCode);

        if ($returnCode === 0) {
            $this->mediaRepository->update($mediaFile->id, [
                'compressed_path' => $compressedPath,
            ]);
        } else {
            throw new \Exception('Video compression failed: ' . implode("\n", $output));
        }
    }

    public function generateThumbnails(int $mediaFileId): void
    {
        $mediaFile = $this->mediaRepository->find($mediaFileId);
        
        if (!$mediaFile) {
            return;
        }

        $fullPath = Storage::disk('local')->path($mediaFile->path);
        $thumbnails = [];

        if ($mediaFile->type === 'image') {
            // Generate 3 thumbnails: small, medium, large
            $sizes = [
                'small' => [150, 150],
                'medium' => [300, 300],
                'large' => [800, 800],
            ];

            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Imagick\Driver());
            
            foreach ($sizes as $sizeName => $dimensions) {
                $thumbnailPath = 'media/thumbnails/' . date('Y/m') . '/' . Str::uuid() . '.jpg';
                $image = $manager->read($fullPath);
                $image->cover($dimensions[0], $dimensions[1]);
                $thumbnail = $image->toJpeg(90);
                Storage::disk('local')->put($thumbnailPath, $thumbnail);
                $thumbnails[$sizeName] = $thumbnailPath;
            }
        } else {
            // Generate video thumbnails using FFmpeg
            $sizes = [
                'small' => [150, 150],
                'medium' => [300, 300],
                'large' => [800, 800],
            ];

            foreach ($sizes as $sizeName => $dimensions) {
                $thumbnailPath = 'media/thumbnails/' . date('Y/m') . '/' . Str::uuid() . '.jpg';
                $outputPath = Storage::disk('local')->path($thumbnailPath);

                // Extract frame at 1 second
                $command = sprintf(
                    'ffmpeg -i %s -ss 00:00:01 -vframes 1 -vf "scale=%d:%d:force_original_aspect_ratio=decrease,pad=%d:%d:(ow-iw)/2:(oh-ih)/2" %s 2>&1',
                    escapeshellarg($fullPath),
                    $dimensions[0],
                    $dimensions[1],
                    $dimensions[0],
                    $dimensions[1],
                    escapeshellarg($outputPath)
                );

                exec($command, $output, $returnCode);

                if ($returnCode === 0) {
                    $thumbnails[$sizeName] = $thumbnailPath;
                }
            }
        }

        $this->mediaRepository->update($mediaFileId, [
            'thumbnails' => $thumbnails,
            'thumbnail_path' => $thumbnails['medium'] ?? null,
        ]);
    }

    public function extractMetadata(int $mediaFileId): void
    {
        $mediaFile = $this->mediaRepository->find($mediaFileId);
        
        if (!$mediaFile) {
            return;
        }

        $fullPath = Storage::disk('local')->path($mediaFile->path);
        $metadata = [];

        if ($mediaFile->type === 'image') {
            $manager = new \Intervention\Image\ImageManager(new \Intervention\Image\Drivers\Imagick\Driver());
            $image = $manager->read($fullPath);
            $metadata = [
                'width' => $image->width(),
                'height' => $image->height(),
                'format' => $image->origin()->format(),
                'colorspace' => $image->origin()->colorspace(),
            ];
        } else {
            // Extract video metadata using FFprobe
            $command = sprintf(
                'ffprobe -v quiet -print_format json -show_format -show_streams %s',
                escapeshellarg($fullPath)
            );

            exec($command, $output, $returnCode);

            if ($returnCode === 0) {
                $probeData = json_decode(implode("\n", $output), true);
                
                $videoStream = collect($probeData['streams'] ?? [])
                    ->firstWhere('codec_type', 'video');

                if ($videoStream) {
                    $metadata = [
                        'width' => (int) ($videoStream['width'] ?? 0),
                        'height' => (int) ($videoStream['height'] ?? 0),
                        'duration' => (int) ($probeData['format']['duration'] ?? 0),
                        'codec' => $videoStream['codec_name'] ?? null,
                        'bitrate' => (int) ($probeData['format']['bit_rate'] ?? 0),
                        'fps' => isset($videoStream['r_frame_rate']) 
                            ? eval('return ' . $videoStream['r_frame_rate'] . ';') 
                            : null,
                    ];
                }
            }
        }

        // Store metadata
        $mediaFile->metadata()->create([
            'metadata' => $metadata,
            'width' => $metadata['width'] ?? null,
            'height' => $metadata['height'] ?? null,
            'duration' => $metadata['duration'] ?? null,
            'codec' => $metadata['codec'] ?? null,
            'bitrate' => $metadata['bitrate'] ?? null,
            'fps' => $metadata['fps'] ?? null,
        ]);
    }

    public function searchMedia(string $query, array $filters = [], int $perPage = 15)
    {
        return $this->mediaRepository->search($query, $filters, $perPage);
    }

    public function getUserMedia(int $userId, array $filters = [], int $perPage = 15)
    {
        return $this->mediaRepository->findByUser($userId, $filters, $perPage);
    }

    public function getMediaFile(int $id, int $userId): ?\App\Models\MediaFile
    {
        $mediaFile = $this->mediaRepository->getWithMetadata($id);
        
        if ($mediaFile && $mediaFile->user_id === $userId) {
            return $mediaFile;
        }
        
        return null;
    }

    public function deleteMedia(int $id, int $userId): bool
    {
        $mediaFile = $this->mediaRepository->find($id);
        
        if (!$mediaFile || $mediaFile->user_id !== $userId) {
            return false;
        }
        
        return $this->mediaRepository->delete($id);
    }
}

