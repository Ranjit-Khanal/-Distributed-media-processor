import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Eye, Image as ImageIcon, Trash2, Video, X } from 'lucide-react';
import { useState } from 'react';

interface MediaFile {
    id: number;
    name: string;
    original_name: string;
    type: 'image' | 'video';
    mime_type: string;
    path?: string;
    compressed_path?: string;
    size: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    thumbnail_path?: string;
    thumbnails?: {
        small?: string;
        medium?: string;
        large?: string;
    };
    created_at: string;
    metadata?: {
        width?: number;
        height?: number;
        duration?: number;
    };
}

interface MediaGalleryProps {
    mediaFiles: {
        data: MediaFile[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    onDelete?: (id: number) => void;
}

export function MediaGallery({ mediaFiles, onDelete }: MediaGalleryProps) {
    const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500';
            case 'processing':
                return 'bg-yellow-500';
            case 'failed':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this media file?')) {
            router.delete(`/api/media/${id}`, {
                onSuccess: () => {
                    onDelete?.(id);
                },
            });
        }
    };

    const getThumbnailUrl = (media: MediaFile) => {
        if (media.thumbnails?.medium) {
            return `/storage/${media.thumbnails.medium}`;
        }
        if (media.thumbnail_path) {
            return `/storage/${media.thumbnail_path}`;
        }
        return null;
    };

    const getMediaUrl = (media: MediaFile) => {
        // First try the main path
        if (media.path) {
            return `/storage/${media.path}`;
        }
        // Fall back to compressed path
        if (media.compressed_path) {
            return `/storage/${media.compressed_path}`;
        }
        // Fall back to thumbnail
        const thumbnailUrl = getThumbnailUrl(media);
        if (thumbnailUrl) {
            return thumbnailUrl;
        }
        // No valid URL available
        return null;
    };

    if (mediaFiles.data.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <ImageIcon className="mb-4 size-12 text-muted-foreground" />
                    <p className="text-muted-foreground">No media files yet</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Upload your first file to get started
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                    >
                        Grid
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                    >
                        List
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                    {mediaFiles.total}{' '}
                    {mediaFiles.total === 1 ? 'file' : 'files'}
                </p>
            </div>

            <div
                className={cn(
                    viewMode === 'grid'
                        ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                        : 'space-y-2',
                )}
            >
                {mediaFiles.data.map((media) => (
                    <Card
                        key={media.id}
                        className={cn(
                            'group relative overflow-hidden transition-shadow hover:shadow-lg',
                            viewMode === 'list' && 'flex gap-4',
                        )}
                    >
                        <div
                            className={cn(
                                'relative',
                                viewMode === 'grid'
                                    ? 'aspect-square'
                                    : 'h-32 w-32 flex-shrink-0',
                            )}
                        >
                            {media.status === 'completed' &&
                            getThumbnailUrl(media) ? (
                                <img
                                    src={getThumbnailUrl(media)!}
                                    alt={media.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                    {media.type === 'video' ? (
                                        <Video className="size-8 text-muted-foreground" />
                                    ) : (
                                        <ImageIcon className="size-8 text-muted-foreground" />
                                    )}
                                </div>
                            )}

                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-colors group-hover:bg-black/40 group-hover:opacity-100">
                                <div className="flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        onClick={() => setSelectedMedia(media)}
                                    >
                                        <Eye className="size-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        onClick={() => handleDelete(media.id)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="absolute top-2 left-2">
                                <Badge
                                    variant="secondary"
                                    className={cn(
                                        'text-white',
                                        getStatusColor(media.status),
                                    )}
                                >
                                    {media.status}
                                </Badge>
                            </div>
                        </div>

                        <CardContent
                            className={cn(
                                'p-4',
                                viewMode === 'list' && 'flex-1',
                            )}
                        >
                            <div className="space-y-1">
                                <p className="truncate font-medium">
                                    {media.name}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    {media.type === 'video' ? (
                                        <Video className="size-3" />
                                    ) : (
                                        <ImageIcon className="size-3" />
                                    )}
                                    <span>{formatFileSize(media.size)}</span>
                                    {media.metadata && (
                                        <>
                                            <span>•</span>
                                            <span>
                                                {media.metadata.width} ×{' '}
                                                {media.metadata.height}
                                            </span>
                                        </>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(
                                        media.created_at,
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            {mediaFiles.last_page > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={mediaFiles.current_page === 1}
                        onClick={() => {
                            router.get('/media', {
                                page: mediaFiles.current_page - 1,
                            });
                        }}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {mediaFiles.current_page} of {mediaFiles.last_page}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={
                            mediaFiles.current_page === mediaFiles.last_page
                        }
                        onClick={() => {
                            router.get('/media', {
                                page: mediaFiles.current_page + 1,
                            });
                        }}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Media Detail Modal */}
            {selectedMedia && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
                    onClick={() => setSelectedMedia(null)}
                >
                    <div
                        className="relative max-h-[90vh] max-w-4xl p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 z-10 bg-white/90 hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900"
                            onClick={() => setSelectedMedia(null)}
                        >
                            <X className="size-4" />
                        </Button>
                        {(() => {
                            const mediaUrl = getMediaUrl(selectedMedia);

                            if (!mediaUrl) {
                                return (
                                    <div className="flex flex-col items-center justify-center rounded-lg bg-slate-100 p-12 dark:bg-slate-800">
                                        {selectedMedia.type === 'video' ? (
                                            <Video className="mb-4 size-16 text-slate-400" />
                                        ) : (
                                            <ImageIcon className="mb-4 size-16 text-slate-400" />
                                        )}
                                        <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                                            Media not available
                                        </p>
                                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                            {selectedMedia.status ===
                                            'processing'
                                                ? 'Media is still being processed'
                                                : 'Media file path is not available'}
                                        </p>
                                    </div>
                                );
                            }

                            return selectedMedia.type === 'video' ? (
                                <video
                                    src={mediaUrl}
                                    controls
                                    className="max-h-[90vh] rounded-lg"
                                />
                            ) : (
                                <img
                                    src={mediaUrl}
                                    alt={selectedMedia.name}
                                    className="max-h-[90vh] rounded-lg object-contain"
                                />
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
}
