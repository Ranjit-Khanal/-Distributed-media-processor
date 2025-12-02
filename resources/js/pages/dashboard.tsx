import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import media from '@/routes/media';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Image, ImageIcon, Plus, Upload, Video } from 'lucide-react';

interface MediaFile {
    id: number;
    name: string;
    type: 'image' | 'video';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    thumbnails?: {
        small?: string;
        medium?: string;
        large?: string;
    };
    thumbnail_path?: string;
    created_at: string;
}

interface DashboardProps {
    recentMedia?: {
        data: MediaFile[];
    };
    stats?: {
        total: number;
        images: number;
        videos: number;
        processing: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ recentMedia, stats }: DashboardProps) {
    const mediaFiles = recentMedia?.data || [];

    const getThumbnailUrl = (media: MediaFile) => {
        if (media.thumbnails?.medium) {
            return `/storage/${media.thumbnails.medium}`;
        }
        if (media.thumbnail_path) {
            return `/storage/${media.thumbnail_path}`;
        }
        return null;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Stats Cards */}
                {stats && (
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Media</CardTitle>
                                <ImageIcon className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total}</div>
                                <p className="text-xs text-muted-foreground">All files</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Images</CardTitle>
                                <Image className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.images}</div>
                                <p className="text-xs text-muted-foreground">Photo files</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Videos</CardTitle>
                                <Video className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.videos}</div>
                                <p className="text-xs text-muted-foreground">Video files</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Processing</CardTitle>
                                <Upload className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.processing}</div>
                                <p className="text-xs text-muted-foreground">In queue</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Recent Media Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Recent Media</h2>
                        <p className="text-muted-foreground">Your recently uploaded files</p>
                    </div>
                    <Link href={media.index()}>
                        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30">
                            <Plus className="size-4 mr-2" />
                            Upload Media
                        </Button>
                    </Link>
                </div>

                {/* Media Grid or Empty State */}
                {mediaFiles.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
                                <ImageIcon className="size-10 text-blue-600 dark:text-blue-400" />
                            </div>
                            <CardTitle className="mb-2 text-xl">No media files yet</CardTitle>
                            <CardDescription className="mb-6 text-center">
                                Get started by uploading your first photo or video
                            </CardDescription>
                            <Link href={media.index()}>
                                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30">
                                    <Upload className="size-4 mr-2" />
                                    Upload Your First Media
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {mediaFiles.map((mediaItem) => (
                            <Card
                                key={mediaItem.id}
                                className="group relative overflow-hidden transition-shadow hover:shadow-lg"
                            >
                                <div className="relative aspect-video">
                                    {mediaItem.status === 'completed' && getThumbnailUrl(mediaItem) ? (
                                        <img
                                            src={getThumbnailUrl(mediaItem)!}
                                            alt={mediaItem.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-muted">
                                            {mediaItem.type === 'video' ? (
                                                <Video className="size-8 text-muted-foreground" />
                                            ) : (
                                                <ImageIcon className="size-8 text-muted-foreground" />
                                            )}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <Link href={media.show(mediaItem.id).url}>
                                            <Button size="sm" variant="secondary">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <p className="font-medium truncate">{mediaItem.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(mediaItem.created_at).toLocaleDateString()}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common tasks and shortcuts</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link href={media.index()}>
                                <Button variant="outline" className="w-full justify-start">
                                    <ImageIcon className="size-4 mr-2" />
                                    Browse Media Library
                                </Button>
                            </Link>
                            <Link href={media.index()}>
                                <Button variant="outline" className="w-full justify-start">
                                    <Upload className="size-4 mr-2" />
                                    Upload New Media
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Getting Started</CardTitle>
                            <CardDescription>Learn how to use the media library</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-muted-foreground">
                            <p>• Upload photos and videos using drag & drop</p>
                            <p>• Files are automatically processed in the background</p>
                            <p>• Search and filter your media by tags, type, or status</p>
                            <p>• View processing status in real-time</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
