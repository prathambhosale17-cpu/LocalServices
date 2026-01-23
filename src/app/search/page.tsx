'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { categories } from '@/lib/data';
import { ProviderCard } from '@/components/ProviderCard';
import Link from 'next/link';
import type { ProviderProfile } from '@/lib/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = (searchParams.get('q') || '').toLowerCase();
  const loc = (searchParams.get('loc') || '').toLowerCase();
  const categoryId = searchParams.get('cat') || '';

  const firestore = useFirestore();
  
  const providersColRef = useMemoFirebase(() => collection(firestore, 'providers'), [firestore]);

  const { data: providers, isLoading } = useCollection<ProviderProfile>(providersColRef);

  const filteredProviders = useMemo(() => {
    if (!providers) return [];

    const categoryName = categories.find(c => c.id === categoryId)?.name;

    return providers.filter(provider => {
      const p = provider as ProviderProfile;
      const matchesCategory = categoryName ? p.category === categoryName : true;
      
      const matchesQuery = q ? 
        p.name.toLowerCase().includes(q) ||
        (p.tagline && p.tagline.toLowerCase().includes(q)) ||
        (p.services && p.services.some(s => s.toLowerCase().includes(q))) : true;
      
      const matchesLocation = loc ? p.location.toLowerCase().includes(loc) : true;
      
      return matchesCategory && matchesQuery && matchesLocation;
    });
  }, [providers, categoryId, q, loc]);

  const categoryName = categories.find(c => c.id === categoryId)?.name;
  
  const title = categoryId && categoryName ? `Browse ${categoryName}` : (q || loc ? "Search Results" : "All Services");

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="col-span-1 md:col-span-1">
          <div className="sticky top-28 p-4 rounded-lg bg-card shadow-lg border">
            <h3 className="font-bold font-headline text-xl mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                  <Link href="/search" className={`flex items-center p-3 rounded-lg text-base font-medium ${!categoryId ? 'bg-primary/10 text-primary' : 'hover:bg-accent/50'}`}>
                    All Services
                  </Link>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link href={`/search?cat=${cat.id}`} className={`flex items-center gap-3 p-3 rounded-lg text-base font-medium ${cat.id === categoryId ? 'bg-primary/10 text-primary' : 'hover:bg-accent/50'}`}>
                    <cat.icon className="h-5 w-5" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="col-span-1 md:col-span-3 min-w-0">
          <h1 className="text-4xl font-bold font-headline mb-4">
            {title}
          </h1>
          
          {isLoading && <p className="text-muted-foreground">Loading providers...</p>}
          {!isLoading && providers && (
            <>
              <p className="text-muted-foreground mb-8 text-lg">Found {filteredProviders.length} providers matching your criteria.</p>
              {filteredProviders.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {filteredProviders.map(provider => (
                    <Link href={`/provider/${provider.id}`} key={provider.id} className="block h-full group">
                      <ProviderCard provider={provider} />
                    </Link>
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
