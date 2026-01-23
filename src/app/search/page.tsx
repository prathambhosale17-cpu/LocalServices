import { providers, categories } from '@/lib/data';
import { ProviderCard } from '@/components/ProviderCard';
import Link from 'next/link';

export default function SearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const query = (searchParams.q as string || '').toLowerCase();
  const location = (searchParams.loc as string || '').toLowerCase();
  const categoryId = searchParams.cat as string || '';

  const filteredProviders = providers.filter(provider => {
    const categoryFromProvider = categories.find(c => c.name === provider.category);
    const matchesCategory = categoryId ? categoryFromProvider?.id === categoryId : true;
    
    const matchesQuery = query ? 
      provider.name.toLowerCase().includes(query) ||
      provider.tagline.toLowerCase().includes(query) ||
      provider.services.some(s => s.toLowerCase().includes(query)) : true;
    
    const matchesLocation = location ? provider.location.toLowerCase().includes(location) : true;
    
    return matchesCategory && matchesQuery && matchesLocation;
  });

  const categoryName = categories.find(c => c.id === categoryId)?.name;
  
  const title = categoryId ? `Browse ${categoryName}` : (query || location ? "Search Results" : "All Services");

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
        </main>
      </div>
    </div>
  );
}
