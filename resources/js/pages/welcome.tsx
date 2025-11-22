import { dashboard, login, register } from '@/routes';
import media from '@/routes/media';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Image, 
    Video, 
    Search, 
    Zap, 
    Cloud, 
    Shield, 
    ArrowRight, 
    CheckCircle2,
    Play,
    Upload,
    Filter
} from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    const features = [
        {
            icon: Upload,
            title: 'Easy Upload',
            description: 'Drag and drop or select files. Supports images and videos with automatic processing.',
        },
        {
            icon: Zap,
            title: 'Fast Processing',
            description: 'Queue-based compression and thumbnail generation powered by Redis and FFmpeg.',
        },
        {
            icon: Search,
            title: 'Smart Search',
            description: 'Full-text search with Meilisearch. Find media by name, tags, type, or metadata.',
        },
        {
            icon: Filter,
            title: 'Advanced Filtering',
            description: 'Filter by type, status, size, and more. Sort and paginate with ease.',
        },
        {
            icon: Cloud,
            title: 'Scalable Architecture',
            description: 'Built for scale with microservice-ready architecture and distributed processing.',
        },
        {
            icon: Shield,
            title: 'Secure & Reliable',
            description: 'Role-based access, API key authentication, and comprehensive error handling.',
        },
    ];

    const stats = [
        { label: 'Media Files', value: 'Unlimited' },
        { label: 'Processing Speed', value: 'Real-time' },
        { label: 'Supported Formats', value: '10+' },
        { label: 'Storage', value: 'Scalable' },
    ];

    return (
        <>
            <Head title="Distributed Media Library">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                {/* Header */}
                <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                                    <Image className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">
                                    Media Library
                                </span>
                            </div>
                            <nav className="flex items-center gap-4">
                                {auth.user ? (
                                    <>
                                        <Link
                                            href={media.index()}
                                            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                                        >
                                            Media Library
                                        </Link>
                                        <Link
                                            href={dashboard()}
                                            className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30"
                                        >
                                            Dashboard
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                                        >
                                            Log in
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30"
                                            >
                                                Get Started
                                            </Link>
                                        )}
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent dark:from-blue-900/10" />
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Distributed Media Library
                            </span>
                            <br />
                            <span className="text-slate-700 dark:text-slate-300">
                                & Processing System
                            </span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-400">
                            Upload, process, and manage your media files with powerful compression,
                            intelligent search, and real-time processing. Built for scale with modern
                            architecture.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            {auth.user ? (
                                <Link
                                    href={media.index()}
                                    className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30"
                                >
                                    Go to Media Library
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={register()}
                                        className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30"
                                    >
                                        Get Started
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                    <Link
                                        href={login()}
                                        className="text-base font-semibold leading-6 text-slate-900 transition-colors hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
                                    >
                                        Sign in <span aria-hidden="true">→</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mx-auto mt-16 max-w-4xl">
                        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-slate-200/80 bg-white/50 p-6 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50"
                                >
                                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {stat.value}
                                    </div>
                                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="border-t border-slate-200 bg-slate-50/50 py-20 dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                Powerful Features
                            </h2>
                            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                                Everything you need to manage and process your media files efficiently.
                            </p>
                        </div>
                        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
                                >
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                                        <feature.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                How It Works
                            </h2>
                            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                                Simple, fast, and efficient media processing workflow.
                            </p>
                        </div>
                        <div className="mx-auto mt-16 max-w-3xl">
                            <div className="space-y-12">
                                {[
                                    {
                                        step: '1',
                                        title: 'Upload Your Media',
                                        description:
                                            'Drag and drop or select your images and videos. The system automatically detects file types and queues them for processing.',
                                        icon: Upload,
                                    },
                                    {
                                        step: '2',
                                        title: 'Automatic Processing',
                                        description:
                                            'Our queue workers compress media, generate thumbnails, and extract metadata in the background. Track progress in real-time.',
                                        icon: Zap,
                                    },
                                    {
                                        step: '3',
                                        title: 'Search & Manage',
                                        description:
                                            'Use powerful search to find your media by name, tags, or metadata. Filter, sort, and organize your library effortlessly.',
                                        icon: Search,
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="relative flex gap-8"
                                    >
                                        <div className="flex flex-shrink-0 flex-col items-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white shadow-lg">
                                                {item.step}
                                            </div>
                                            {index < 2 && (
                                                <div className="mt-4 h-24 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600" />
                                            )}
                                        </div>
                                        <div className="flex-1 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                            <div className="mb-2 flex items-center gap-3">
                                                <item.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                                    {item.title}
                                                </h3>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tech Stack Section */}
                <section className="border-t border-slate-200 bg-slate-50/50 py-20 dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                Built with Modern Technology
                            </h2>
                            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                                Powered by industry-leading tools and frameworks.
                            </p>
                        </div>
                        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
                            {[
                                'Laravel 12',
                                'PostgreSQL',
                                'Redis',
                                'Meilisearch',
                                'FFmpeg',
                                'Docker',
                            ].map((tech, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {tech}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-16 shadow-2xl">
                            <div className="relative text-center">
                                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                    Ready to get started?
                                </h2>
                                <p className="mt-4 text-lg leading-8 text-blue-100">
                                    Start uploading and processing your media files today. No credit card required.
                                </p>
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    {auth.user ? (
                                        <Link
                                            href={media.index()}
                                            className="group flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50"
                                        >
                                            Go to Media Library
                                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    ) : (
                                        <Link
                                            href={register()}
                                            className="group flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50"
                                        >
                                            Get Started Free
                                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                            <p>
                                Distributed Media Library & Processing System
                            </p>
                            <p className="mt-2">
                                Built with Laravel, React, and modern web technologies.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
