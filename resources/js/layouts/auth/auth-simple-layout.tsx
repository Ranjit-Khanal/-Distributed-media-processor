import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { Image } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Header */}
            <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link
                            href={home()}
                            className="flex items-center gap-2 font-medium transition-opacity hover:opacity-80"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                                <Image className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white">
                                Media Library
                            </span>
                        </Link>
                        <Link
                            href={home()}
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
                        <div className="mb-8 flex flex-col items-center gap-4">
                            {/* Logo */}
                            <Link
                                href={home()}
                                className="flex flex-col items-center gap-3 transition-opacity hover:opacity-80"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
                                    <Image className="h-8 w-8 text-white" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                                        Media Library
                                    </span>
                                </div>
                            </Link>

                            {/* Title and Description */}
                            <div className="space-y-2 text-center">
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {title}
                                </h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {description}
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-200 bg-white/50 py-6 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-600 dark:text-slate-400">
                    <p>Distributed Media Library & Processing System</p>
                </div>
            </footer>
        </div>
    );
}
