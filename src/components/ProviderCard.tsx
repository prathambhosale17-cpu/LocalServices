'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import type { ProviderProfile } from '@/lib/types';
import { useState, useEffect } from 'react';


export function ProviderCard({ provider }: { provider: ProviderProfile }) {
  const fallbackSrc = `https://picsum.photos/seed/${provider.id}/600/400`;
  const [imgSrc, setImgSrc] = useState(fallbackSrc);

  useEffect(() => {
    setImgSrc(provider.imageUrl || fallbackSrc);
  }, [provider.imageUrl, fallbackSrc]);
  
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 shadow-md group-hover:shadow-xl group-hover:-translate-y-1 border">
      <CardHeader className="p-0">
        <div className="relative h-52 w-full">
          <Image
            src={imgSrc}
            alt={`Image for ${provider.name}`}
            onError={() => setImgSrc(fallbackSrc)}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <Badge variant="secondary" className="mb-2 uppercase text-xs tracking-wider font-semibold">{provider.category}</Badge>
        <CardTitle className="text-2xl mb-2 font-headline group-hover:text-primary transition-colors">
          {provider.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{provider.tagline || 'No tagline provided.'}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span>{provider.location}</span>
        </div>
      </CardContent>
      <CardFooter className="p-6 bg-transparent flex justify-between items-center text-sm">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Star className={'text-muted-foreground/30 h-4 w-4'} />
          <span className="font-semibold">New</span>
          <span>(0 reviews)</span>
        </div>
        <div className="text-primary font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
          View Profile
          <ArrowRight className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
