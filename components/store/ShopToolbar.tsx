"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface ShopToolbarProps {
    totalProducts: number;
}

export function ShopToolbar({ totalProducts }: ShopToolbarProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const updateSort = (sortValue: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (sortValue === "default") {
            params.delete("sort");
        } else {
            params.set("sort", sortValue);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-between py-6">
            <span className="text-[12px] font-bold text-[#111111] uppercase tracking-[0.1em]">
                {totalProducts} Products found
            </span>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#919191] uppercase tracking-widest">Sort by:</span>
                    <select 
                        onChange={(e) => updateSort(e.target.value)}
                        className="text-[11px] font-bold uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer text-[#111111]"
                        defaultValue={searchParams.get("sort") || "default"}
                    >
                        <option value="default">Recommended</option>
                        <option value="newest">New Arrivals</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
