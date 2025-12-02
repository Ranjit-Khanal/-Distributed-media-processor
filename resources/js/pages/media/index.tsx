import { MediaGallery } from '@/components/media/media-gallery';
import { MediaSearch } from '@/components/media/media-search';
import { MediaUpload } from '@/components/media/media-upload';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface MediaFile {
    id: number;
    name: string;
    original_name: string;
    type: 'image' | 'video';
    mime_type: string;
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

interface Props {
    mediaFiles: {
        data: MediaFile[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters?: {
        type?: string;
        status?: string;
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Media Library',
        href: '/media',
    },
];

export default function MediaIndex({ mediaFiles, filters = {} }: Props) {
    const [showUpload, setShowUpload] = useState(false);

    const handleUploadSuccess = () => {
        setShowUpload(false);
        router.reload({ only: ['mediaFiles'] });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Media Library" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Media Library</h1>
                    <button
                        onClick={() => setShowUpload(!showUpload)}
                        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                        {showUpload ? 'Cancel Upload' : 'Upload Media'}
                    </button>
                </div>

                {showUpload && (
                    <MediaUpload onUploadSuccess={handleUploadSuccess} />
                )}

                <MediaSearch
                    initialQuery={filters.search}
                    initialType={filters.type}
                    initialStatus={filters.status}
                />

                <MediaGallery mediaFiles={mediaFiles} />
            </div>
        </AppLayout>
    );
}
