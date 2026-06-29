'use client';

import { useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { collection } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { categories } from '@/lib/data';
import { ProviderCard } from '@/components/ProviderCard';
import Link from 'next/link';
import type { ProviderProfile } from '@/lib/types';
import { SearchBar, SearchBarFallback } from '@/components/SearchBar';
import { Skeleton } from '@/components/ui/skeleton';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = (searchParams.get('q') || '').toLowerCase();
  const loc = (searchParams.get('loc') || '').toLowerCase();
  const categoryId = searchParams.get('cat') || '';

  const firestore = useFirestore();
  
  const providersColRef = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'providers');
  }, [firestore]);

  const { data: providers, isLoading } = useCollection<ProviderProfile>(providersColRef);

  const filteredProviders = useMemo(() => {
    if (!providers) return [];

    const categoryName = categories.find(c => c.id === categoryId)?.name;

    return providers.filter(provider => {
      const p = provider;
      const matchesCategory = categoryName ? p.category === categoryName : true;
      
      const matchesQuery = q ? 
        p.name.toLowerCase().includes(q) ||
        (p.tagline && p.tagline.toLowerCase().includes(q)) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q)) || // Added subcategory check
        (p.services && p.services.some(s => s.toLowerCase().includes(q))) : true;
      
      const matchesLocation = loc ? p.location.toLowerCase().includes(loc) : true;
      
      return matchesCategory && matchesQuery && matchesLocation;
    });
  }, [providers, categoryId, q, loc]);

  const createQueryString = (name: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    return params.toString();
  };

  const categoryName = categories.find(c => c.id === categoryId)?.name;
  
  const title = categoryId && categoryName ? `Browse ${categoryName}` : (q || loc ? "Search Results" : "All Services");

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="col-span-1 md:col-span-1 space-y-8">
          {/* Category Filter */}
          <div className="sticky top-28">
            <div className="p-4 rounded-lg bg-card shadow-lg border">
              <h3 className="font-bold font-headline text-xl mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                    <Link 
                      href={`/search?${createQueryString('cat', null)}`} 
                      className={`flex items-center p-3 rounded-lg text-base font-medium ${!categoryId ? 'bg-primary/10 text-primary' : 'hover:bg-accent/50'}`}
                    >
                      All Services
                    </Link>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link 
                      href={`/search?${createQueryString('cat', cat.id)}`} 
                      className={`flex items-center gap-3 p-3 rounded-lg text-base font-medium ${cat.id === categoryId ? 'bg-primary/10 text-primary' : 'hover:bg-accent/50'}`}
                    >
                      <cat.icon className="h-5 w-5" />
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        <main className="col-span-1 md:col-span-3 min-w-0">
          <h1 className="text-3xl md:text-4xl font-bold font-headline mb-4">
            {title}
          </h1>

          <div className="mb-8">
            <Suspense fallback={<SearchBarFallback />}>
              <SearchBar />
            </Suspense>
          </div>
          
          {isLoading && (
            <>
              <Skeleton className="h-7 w-72 mb-8" />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <Skeleton className="h-[420px] w-full rounded-xl" />
                <Skeleton className="h-[420px] w-full rounded-xl" />
              </div>
            </>
          )}
          
          {!isLoading && providers && (
            <>
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <p className="text-muted-foreground text-base md:text-lg mr-2">
                  Found {filteredProviders.length} providers matching your criteria.
                </p>
                {loc && (
                  <Badge variant="secondary" className="flex items-center gap-1 pl-3 pr-1 py-1">
                    Location: <span className="font-bold">{loc}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 rounded-full hover:bg-muted ml-1"
                      onClick={() => router.push(`/search?${createQueryString('loc', null)}`)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
              
              {filteredProviders.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {filteredProviders.map(provider => (
                    <ProviderCard provider={provider} key={provider.id} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 border-2 border-dashed rounded-lg bg-card mt-12">
                  <h2 className="text-2xl font-semibold font-headline mb-2">No providers found</h2>
                  <p className="text-muted-foreground max-w-sm mx-auto">Try adjusting your search terms, or select a different category to browse available services.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
