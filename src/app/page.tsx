import Link from 'next/link';
import { categories } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { SearchBar, SearchBarFallback } from '@/components/SearchBar';
import { Suspense } from 'react';

export default function Home() {
  return (
    <>
      <section className="py-20 md:py-32 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">
            Find Local Services, Instantly.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Your one-stop directory for trusted service providers in your community.
          </p>
          <Suspense fallback={<SearchBarFallback />}>
            <SearchBar />
          </Suspense>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-headline text-center mb-12">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link href={`/search?cat=${category.id}`} key={category.id} className="group">
                <Card className="text-center group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full flex flex-col justify-center">
                  <CardContent className="p-6">
                    <category.icon className="h-12 w-12 mx-auto text-primary mb-4 transition-colors group-hover:text-primary/80" />
                    <h3 className="font-semibold">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
