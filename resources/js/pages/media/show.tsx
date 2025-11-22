import { MediaStatus } from '@/components/media/media-status';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Download, Image as ImageIcon, Trash2, Video } from 'lucide-react';

interface MediaFile {
    id: number;
    name: string;
    original_name: string;
    type: 'image' | 'video';
    mime_type: string;
    size: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    path: string;
    compressed_path?: string;
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
        codec?: string;
        bitrate?: number;
        fps?: number;
    };
    tags?: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
}

interface Props {
    mediaFile: MediaFile;
    mediaStatus?: {
        status: string;
        progress: number;
        error_message?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Media Library',
        href: '/media',
    },
    {
        title: 'Media Details',
    },
];

export default function MediaShow({ mediaFile, mediaStatus }: Props) {
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return 'N/A';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this media file?')) {
            router.delete(`/api/media/${mediaFile.id}`, {
                onSuccess: () => {
                    router.visit('/media');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${mediaFile.name} - Media Library`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.visit('/media')}
                    >
                        <ArrowLeft className="size-4" />
                    </Button>
                    <h1 className="text-2xl font-bold">{mediaFile.name}</h1>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                                {mediaFile.type === 'video' ? (
                                    <video
                                        src={`/storage/${mediaFile.path}`}
                                        controls
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <img
                                        src={`/storage/${mediaFile.path}`}
                                        alt={mediaFile.name}
                                        className="h-full w-full object-contain"
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        {mediaStatus && (
                            <MediaStatus
                                mediaId={mediaFile.id}
                                initialStatus={mediaStatus.status}
                            />
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Type</p>
                                        <p className="font-medium capitalize">{mediaFile.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Status</p>
                                        <Badge variant="secondary">{mediaFile.status}</Badge>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Size</p>
                                        <p className="font-medium">{formatFileSize(mediaFile.size)}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">MIME Type</p>
                                        <p className="font-medium">{mediaFile.mime_type}</p>
                                    </div>
                                    {mediaFile.metadata && (
                                        <>
                                            {mediaFile.metadata.width && (
                                                <div>
                                                    <p className="text-muted-foreground">Dimensions</p>
                                                    <p className="font-medium">
                                                        {mediaFile.metadata.width} × {mediaFile.metadata.height}
                                                    </p>
                                                </div>
                                            )}
                                            {mediaFile.metadata.duration && (
                                                <div>
                                                    <p className="text-muted-foreground">Duration</p>
                                                    <p className="font-medium">{formatDuration(mediaFile.metadata.duration)}</p>
                                                </div>
                                            )}
                                            {mediaFile.metadata.codec && (
                                                <div>
                                                    <p className="text-muted-foreground">Codec</p>
                                                    <p className="font-medium">{mediaFile.metadata.codec}</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <div>
                                        <p className="text-muted-foreground">Uploaded</p>
                                        <p className="font-medium">
                                            {new Date(mediaFile.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {mediaFile.tags && mediaFile.tags.length > 0 && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">Tags</p>
                                        <div className="flex flex-wrap gap-2">
                                            {mediaFile.tags.map((tag) => (
                                                <Badge key={tag.id} variant="outline">
                                                    {tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            window.open(`/storage/${mediaFile.path}`, '_blank');
                                        }}
                                    >
                                        <Download className="size-4 mr-2" />
                                        Download
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDelete}
                                    >
                                        <Trash2 className="size-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

