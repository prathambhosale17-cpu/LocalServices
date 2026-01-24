'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import type { Review as ReviewType } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import type { WithId } from '@/firebase';

function StarRatingDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  );
}

export function ReviewCard({ review }: { review: WithId<ReviewType> }) {
  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.split('@');
    return parts[0].charAt(0).toUpperCase();
  };
  
  const date = review.createdAt?.toDate ? 
    formatDistanceToNow(review.createdAt.toDate(), { addSuffix: true }) :
    'just now';

  return (
    <div className="flex items-start gap-4 border-b pb-4 last:border-b-0 last:pb-0">
      <Avatar>
        <AvatarFallback>{getInitials(review.author)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
            <p className="font-semibold text-sm">{review.author}</p>
            <StarRatingDisplay rating={review.rating} />
        </div>
        <p className="text-xs text-muted-foreground mb-2">{date}</p>
        <p className="text-sm text-foreground/80 whitespace-pre-wrap">{review.comment}</p>
      </div>
    </div>
  );
}
