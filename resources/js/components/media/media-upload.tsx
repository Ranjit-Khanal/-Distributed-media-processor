import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface MediaUploadProps {
    onUploadSuccess?: () => void;
}

export function MediaUpload({ onUploadSuccess }: MediaUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [tags, setTags] = useState<string[]>(['']);
    const [dragActive, setDragActive] = useState(false);

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<{ file?: string }>({});

    const handleFileSelect = (file: File) => {
        if (file) {
            const validTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
                'image/webp',
                'video/mp4',
                'video/mpeg',
                'video/quicktime',
                'video/x-msvideo',
                'video/webm',
            ];
            if (validTypes.includes(file.type)) {
                setSelectedFile(file);
                setErrors({});
            } else {
                setErrors({
                    file: 'Invalid file type. Please upload an image or video.',
                });
            }
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            setErrors({ file: 'Please select a file to upload' });
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        tags.filter((tag) => tag.trim()).forEach((tag) => {
            formData.append('tags[]', tag.trim());
        });

        setProcessing(true);
        router.post('/api/media/upload', formData, {
            forceFormData: true,
            onSuccess: () => {
                setSelectedFile(null);
                setTags(['']);
                setErrors({});
                setProcessing(false);
                onUploadSuccess?.();
            },
            onError: (errors) => {
                setErrors(errors as { file?: string });
                setProcessing(false);
            },
        });
    };

    const addTag = () => {
        setTags([...tags, '']);
    };

    const removeTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const updateTag = (index: number, value: string) => {
        const newTags = [...tags];
        newTags[index] = value;
        setTags(newTags);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload Media</CardTitle>
                <CardDescription>
                    Upload photos or videos to your media library
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div
                        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                            dragActive
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    handleFileSelect(e.target.files[0]);
                                }
                            }}
                        />

                        {selectedFile ? (
                            <div className="space-y-2">
                                <p className="font-medium">
                                    {selectedFile.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {formatFileSize(selectedFile.size)} •{' '}
                                    {selectedFile.type}
                                </p>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setData('file', null);
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                >
                                    <X className="size-4" />
                                    Remove
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Upload className="mx-auto size-12 text-muted-foreground" />
                                <div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        Select File
                                    </Button>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        or drag and drop
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {errors.file && (
                        <p className="text-sm text-destructive">
                            {errors.file}
                        </p>
                    )}

                    <div className="space-y-2">
                        <Label>Tags (optional)</Label>
                        {tags.map((tag, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={tag}
                                    onChange={(e) =>
                                        updateTag(index, e.target.value)
                                    }
                                    placeholder="Enter tag name"
                                />
                                {tags.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeTag(index)}
                                    >
                                        <X className="size-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addTag}
                        >
                            Add Tag
                        </Button>
                    </div>

                    <Button
                        type="submit"
                        disabled={!selectedFile || processing}
                        className="w-full"
                    >
                        {processing ? 'Uploading...' : 'Upload Media'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
