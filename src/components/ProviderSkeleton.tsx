
'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProviderSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-md border">
      <CardHeader className="p-0">
        <Skeleton className="h-52 w-full" />
      </CardHeader>
      <CardContent className="p-6 flex-grow space-y-3">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>
      <CardFooter className="p-6 flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </CardFooter>
    </Card>
  );
}
