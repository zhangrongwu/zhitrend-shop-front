interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-1/4" />
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="relative h-[600px]">
      <Skeleton className="h-full w-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
          <Skeleton className="h-12 w-32 mx-auto" />
        </div>
      </div>
    </div>
  );
} 