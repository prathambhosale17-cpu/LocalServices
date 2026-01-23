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
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h3 className="font-bold font-headline text-lg mb-4">Categories</h3>
            <ul className="space-y-1">
              <li>
                  <Link href="/search" className={`flex items-center p-2 rounded-md text-sm font-medium ${!categoryId ? 'bg-primary/10 text-primary' : 'hover:bg-accent/50'}`}>
                    All Services
                  </Link>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link href={`/search?cat=${cat.id}`} className={`flex items-center gap-2 p-2 rounded-md text-sm font-medium ${cat.id === categoryId ? 'bg-primary/10 text-primary' : 'hover:bg-accent/50'}`}>
                    <cat.icon className="h-4 w-4" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="w-full min-w-0">
          <h1 className="text-3xl font-bold font-headline mb-2">
            {title}
          </h1>
          
          {isLoading && <p className="text-muted-foreground">Loading providers...</p>}
          {!isLoading && providers && (
            <>
              <p className="text-muted-foreground mb-6">Found {filteredProviders.length} providers matching your criteria.</p>
              {filteredProviders.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredProviders.map(provider => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 border-2 border-dashed rounded-lg bg-card">
                  <h2 className="text-xl font-semibold mb-2">No providers found</h2>
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
