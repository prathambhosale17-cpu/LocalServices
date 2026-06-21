'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Tag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { categories } from '@/lib/data';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('loc') || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLFormElement>(null);
  const { t } = useLanguage();

  const suggestions = useMemo(() => {
    if (!keyword || keyword.length < 2) return [];
    
    const term = keyword.toLowerCase();
    const result: { type: 'category' | 'service'; name: string; id?: string }[] = [];

    categories.forEach(cat => {
      if (cat.name.toLowerCase().includes(term)) {
        result.push({ type: 'category', name: cat.name, id: cat.id });
      }
      cat.subServices.forEach(sub => {
        if (sub.toLowerCase().includes(term)) {
          result.push({ type: 'service', name: sub });
        }
      });
    });

    return result.slice(0, 6);
  }, [keyword]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveSearch = (q: string, loc: string) => {
    if (!q && !loc) return;
    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      const newSearch = { q, loc, id: Date.now() };
      const filtered = [newSearch, ...recent.filter((s: any) => !(s.q === q && s.loc === loc))].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(filtered));
      window.dispatchEvent(new Event('recentSearchesUpdated'));
    } catch (e) {}
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (location) params.set('loc', location);
    saveSearch(keyword, location);
    router.push(`/search?${params.toString()}`);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.type === 'category') {
      router.push(`/search?cat=${suggestion.id}`);
    } else {
      setKeyword(suggestion.name);
      const params = new URLSearchParams();
      params.set('q', suggestion.name);
      if (location) params.set('loc', location);
      router.push(`/search?${params.toString()}`);
    }
    setShowSuggestions(false);
  };

  return (
    <form 
      ref={containerRef}
      onSubmit={handleSearch} 
      className="w-full max-w-2xl mx-auto bg-card p-4 rounded-lg shadow-lg flex flex-col md:flex-row gap-2 relative z-50" 
      suppressHydrationWarning
    >
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('search.placeholder')}
          className="pl-10 text-base"
          value={keyword}
          onFocus={() => setShowSuggestions(true)}
          onChange={(e) => {
            setKeyword(e.target.value);
            setShowSuggestions(true);
          }}
          aria-label="Search for a service"
          suppressHydrationWarning
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-lg shadow-xl overflow-hidden text-left">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSuggestionClick(s)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-accent transition-colors text-sm md:text-base border-b last:border-0"
              >
                {s.type === 'category' ? <Tag className="h-4 w-4 text-primary" /> : <Search className="h-4 w-4 text-muted-foreground" />}
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{s.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">{s.type}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="relative flex-grow">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('search.locationPlaceholder')}
          className="pl-10 text-base"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          aria-label="Enter a location"
          suppressHydrationWarning
        />
      </div>
      <Button type="submit" className="w-full md:w-auto px-8">
        <Search className="mr-2 h-4 w-4" />
        {t('common.search')}
      </Button>
    </form>
  );
}

export function SearchBarFallback() {
  return (
    <div className="w-full max-w-2xl mx-auto bg-card p-4 rounded-lg shadow-lg flex flex-col md:flex-row gap-2">
      <div className="relative flex-grow">
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="relative flex-grow">
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full md:w-[108px]" />
    </div>
  );
}
