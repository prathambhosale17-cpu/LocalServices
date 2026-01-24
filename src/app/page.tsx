'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { collection, query, limit } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { SearchBar, SearchBarFallback } from '@/components/SearchBar';
import { Suspense } from 'react';
import { ProviderCard } from '@/components/ProviderCard';
import type { ProviderProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { categories } from '@/lib/data';
import { Card } from '@/components/ui/card';


export default function Home() {
  const firestore = useFirestore();

  const providersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'providers'), limit(6));
  }, [firestore]);

  const { data: providers, isLoading } = useCollection<ProviderProfile>(providersQuery);

  return (
    <>
      <section className="py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">
            Find Local Services, Instantly.
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-12 max-w-3xl mx-auto">
            Your one-stop directory for trusted service providers in your community.
          </p>
          <Suspense fallback={<SearchBarFallback />}>
            <SearchBar />
          </Suspense>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-headline">
              Browse by Category
            </h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">Find the right professional for your needs by browsing our service categories.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-8">
            {categories.map((category) => (
              <Link key={category.id} href={`/search?cat=${category.id}`} className="block group">
                <Card className="h-full text-center p-6 transition-all duration-300 shadow-md group-hover:shadow-xl group-hover:-translate-y-1 border hover:border-primary flex flex-col items-center justify-center aspect-square">
                  <category.icon className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h3 className="font-semibold font-headline text-lg">{category.name}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-headline">
              Featured Services
            </h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">Discover top-rated professionals for any job, from home repairs to personal wellness.</p>
          </div>
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[420px] w-full rounded-xl" />
              ))}
            </div>
          )}
          {providers && providers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {providers.map((provider) => (
                <ProviderCard provider={provider} key={provider.id} />
              ))}
            </div>
          )}
           {!isLoading && (!providers || providers.length === 0) && (
             <div className="text-center py-24 border-2 border-dashed rounded-lg bg-card mt-12">
                <h2 className="text-2xl font-semibold font-headline mb-2">No providers listed yet</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">Check back soon for new services in your area.</p>
              </div>
           )}
        </div>
      </section>
    </>
  );
}
