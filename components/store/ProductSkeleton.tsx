import { cn } from "@/lib/utils";

export function ProductSkeleton() {
    return (
        <div className="group flex flex-col animate-pulse">
            <div className="relative aspect-[4/5] w-full bg-zinc-50 overflow-hidden mb-6 flex items-center justify-center">
                {/* Image Placeholder */}
                <div className="w-[60%] h-[80%] bg-zinc-100/50 rounded-sm" />
                
                {/* Badges Placeholder */}
                <div className="absolute top-4 left-4 w-12 h-5 bg-zinc-100" />
            </div>
            
            <div className="space-y-3">
                {/* Title Line 1 */}
                <div className="h-4 bg-zinc-50 w-3/4 rounded-sm" />
                {/* Title Line 2 */}
                <div className="h-4 bg-zinc-50 w-1/2 rounded-sm" />
                
                <div className="flex items-center justify-between pt-2">
                    {/* Price */}
                    <div className="h-4 bg-zinc-50 w-20 rounded-sm" />
                    {/* Circle Color Placeholder */}
                    <div className="w-4 h-4 rounded-full bg-zinc-100" />
                </div>
            </div>
        </div>
    );
}


export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
            {Array.from({ length: count }).map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    );
}
