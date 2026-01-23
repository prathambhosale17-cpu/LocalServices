import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import type { Review } from '@/lib/data';

function StarRating({ rating, className }: { rating: number, className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex items-start gap-4">
      <Avatar>
        <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
            <p className="font-semibold">{review.author}</p>
            <StarRating rating={review.rating} />
        </div>
        <p className="text-xs text-muted-foreground mb-2">{review.date}</p>
        <p className="text-sm text-muted-foreground">{review.comment}</p>
      </div>
    </div>
  );
}
