import { Suspense } from 'react';
import SearchPageContent from './SearchPageContent';
import { Skeleton } from '@/components/ui/skeleton';

function SearchPageFallback() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <aside className="col-span-1 md:col-span-1">
                    <div className="sticky top-28 p-4 rounded-lg bg-card shadow-lg border">
                        <Skeleton className="h-8 w-3/4 mb-6" />
                        <ul className="space-y-2">
                            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                        </ul>
                    </div>
                </aside>

                <main className="col-span-1 md:col-span-3 min-w-0">
                    <Skeleton className="h-12 w-1/2 mb-4" />
                    <Skeleton className="h-20 w-full mb-8" />
                    <Skeleton className="h-6 w-1/3 mb-8" />
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <Skeleton className="h-[420px] w-full rounded-xl" />
                        <Skeleton className="h-[420px] w-full rounded-xl" />
                        <Skeleton className="h-[420px] w-full rounded-xl" />
                        <Skeleton className="h-[420px] w-full rounded-xl" />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<SearchPageFallback />}>
            <SearchPageContent />
        </Suspense>
    );
}
