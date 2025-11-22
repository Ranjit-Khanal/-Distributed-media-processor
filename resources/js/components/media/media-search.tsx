import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface MediaSearchProps {
    initialQuery?: string;
    initialType?: string;
    initialStatus?: string;
}

export function MediaSearch({ initialQuery = '', initialType = '', initialStatus = '' }: MediaSearchProps) {
    const [query, setQuery] = useState(initialQuery);
    const [type, setType] = useState(initialType || 'all');
    const [status, setStatus] = useState(initialStatus || 'all');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (query) params.set('query', query);
        if (type && type !== 'all') params.set('type', type);
        if (status && status !== 'all') params.set('status', status);
        
        router.get(`/media/search?${params.toString()}`);
    };

    const handleReset = () => {
        setQuery('');
        setType('all');
        setStatus('all');
        router.get('/media');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Search Media</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="search">Search Query</Label>
                        <div className="relative mt-1">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="search"
                                placeholder="Search by name..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="type">Type</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger id="type" className="mt-1">
                                    <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All types</SelectItem>
                                    <SelectItem value="image">Image</SelectItem>
                                    <SelectItem value="video">Video</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger id="status" className="mt-1">
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={handleSearch} className="flex-1">
                            <Search className="size-4 mr-2" />
                            Search
                        </Button>
                        <Button variant="outline" onClick={handleReset}>
                            Reset
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

