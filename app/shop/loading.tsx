import { ProductGridSkeleton } from "@/components/store/ProductSkeleton";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function ShopLoading() {
    return (
        <div className="bg-white min-h-screen pb-32 pt-12">
            <main className="container mx-auto px-4 lg:px-12 xl:px-24">
                {/* Breadcrumbs Skeleton */}
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#919191] mb-12 animate-pulse">
                    <div className="w-12 h-3 bg-zinc-100 rounded" />
                    <ChevronRight className="w-3 h-3" />
                    <div className="w-24 h-3 bg-zinc-100 rounded" />
                </div>

                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    {/* Sidebar Skeleton */}
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-8 animate-pulse">
                        <div className="h-6 bg-zinc-100 w-full mb-4" />
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i: number) => (
                                <div key={i} className="h-4 bg-zinc-50 w-32" />
                            ))}
                        </div>
                    </div>

                    {/* Content Area Skeleton */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-16 animate-pulse">
                            <div className="h-16 bg-zinc-100 w-3/4 mb-6" />
                            <div className="h-4 bg-zinc-50 w-full mb-2" />
                            <div className="h-4 bg-zinc-50 w-2/3" />
                        </div>

                        <div className="border-t border-[#F1F1F1] pt-8 mb-8">
                            <div className="h-6 bg-zinc-50 w-32" />
                        </div>

                        <ProductGridSkeleton count={8} />
                    </div>
                </div>
            </main>
        </div>
    );
}
