import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin } from 'lucide-react';
import type { ProviderProfile } from '@/lib/types';


export function ProviderCard({ provider }: { provider: ProviderProfile }) {
  
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-shadow hover:shadow-xl group">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          {provider.imageUrl ? (
            <Image
              src={provider.imageUrl}
              alt={`Image for ${provider.name}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No image available</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Badge variant="secondary" className="mb-2 uppercase text-xs tracking-wider">{provider.category}</Badge>
        <CardTitle className="text-xl mb-1">
          <Link href={`/provider/${provider.id}`} className="hover:text-primary transition-colors stretched-link">
            {provider.name}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-3">{provider.tagline}</p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{provider.location}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50 flex justify-between items-center text-sm">
        <div className="flex items-center gap-1">
          <Star className={'text-muted-foreground/30'} />
          <span className="font-semibold">New</span>
          <span className="text-muted-foreground">(0 reviews)</span>
        </div>
        <div className="text-primary font-semibold group-hover:underline">
          View Profile
        </div>
      </CardFooter>
    </Card>
  );
}
