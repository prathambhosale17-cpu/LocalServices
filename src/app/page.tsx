import Link from 'next/link';
import { categories } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { SearchBar, SearchBarFallback } from '@/components/SearchBar';
import { Suspense } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Home() {
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

      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-headline">
              Explore Our Services
            </h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">Find the right professional for any job, from home repairs to personal wellness.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link href={`/search?cat=${category.id}`} key={category.id} className="group">
                <div className="bg-card p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border h-full flex flex-col items-start transform hover:-translate-y-2 hover:border-primary/50">
                  <div className="bg-primary/10 p-4 rounded-lg mb-5">
                    <category.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-2xl mb-2 font-headline">{category.name}</h3>
                  <p className="text-muted-foreground text-base flex-grow">
                    Find top-rated professionals in the {category.name.toLowerCase()} sector.
                  </p>
                  <div className="flex items-center text-primary font-bold mt-6 text-sm tracking-wide">
                    <span>View Services</span>
                    <ArrowRight className="h-4 w-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
