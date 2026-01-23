"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('loc') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (location) params.set('loc', location);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto bg-card p-4 rounded-lg shadow-lg flex flex-col md:flex-row gap-2">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Service, e.g., 'plumber'"
          className="pl-10 text-base"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          aria-label="Search for a service"
        />
      </div>
      <div className="relative flex-grow">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Location, e.g., 'New York'"
          className="pl-10 text-base"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          aria-label="Enter a location"
        />
      </div>
      <Button type="submit" className="w-full md:w-auto">
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  );
}
