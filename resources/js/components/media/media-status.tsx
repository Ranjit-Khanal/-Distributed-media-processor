import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MediaStatusProps {
    mediaId: number;
    initialStatus?: string;
}

export function MediaStatus({ mediaId, initialStatus = 'pending' }: MediaStatusProps) {
    const [status, setStatus] = useState(initialStatus);
    const [progress, setProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'pending' || status === 'processing') {
            const interval = setInterval(() => {
                fetch(`/api/media/${mediaId}/status`, {
                    headers: {
                        'Accept': 'application/json',
                    },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.data) {
                            setStatus(data.data.status);
                            setProgress(data.data.progress || 0);
                            setErrorMessage(data.data.error_message || null);
                            
                            if (data.data.status === 'completed' || data.data.status === 'failed') {
                                clearInterval(interval);
                            }
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching status:', error);
                    });
            }, 2000); // Poll every 2 seconds

            return () => clearInterval(interval);
        }
    }, [status, mediaId]);

    const getStatusIcon = () => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="size-5 text-green-500" />;
            case 'failed':
                return <XCircle className="size-5 text-red-500" />;
            case 'processing':
                return <Loader2 className="size-5 text-yellow-500 animate-spin" />;
            default:
                return <Clock className="size-5 text-gray-500" />;
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'completed':
                return 'Processing Complete';
            case 'failed':
                return 'Processing Failed';
            case 'processing':
                return 'Processing...';
            default:
                return 'Pending Processing';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {getStatusIcon()}
                    Processing Status
                </CardTitle>
                <CardDescription>{getStatusText()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Compression</span>
                        <Badge variant={status === 'completed' ? 'default' : 'secondary'}>
                            {status === 'completed' ? 'Done' : 'Pending'}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Thumbnails</span>
                        <Badge variant={status === 'completed' ? 'default' : 'secondary'}>
                            {status === 'completed' ? 'Done' : 'Pending'}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Metadata</span>
                        <Badge variant={status === 'completed' ? 'default' : 'secondary'}>
                            {status === 'completed' ? 'Done' : 'Pending'}
                        </Badge>
                    </div>
                </div>

                {errorMessage && (
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                        {errorMessage}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

