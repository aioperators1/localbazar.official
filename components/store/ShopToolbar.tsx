"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronDown, Check, LayoutGrid, List } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ShopToolbarProps {
    totalProducts: number;
}

export function ShopToolbar({ totalProducts }: ShopToolbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSort = searchParams.get("sort") || "default";

    const updateSort = (sortValue: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (sortValue === "default") {
            params.delete("sort");
        } else {
            params.set("sort", sortValue);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const sortOptions = [
        { label: "Recommended", value: "default" },
        { label: "Price: Low to High", value: "price_asc" },
        { label: "Price: High to Low", value: "price_desc" },
        { label: "Newest Arrivals", value: "newest" },
    ];

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 py-3 border-y border-zinc-200">
            <div className="text-[13px] text-zinc-500 font-medium">
                Affiche 1 - {totalProducts} de {totalProducts} produits
            </div>

            <div className="flex items-center gap-6 mt-4 sm:mt-0 text-[13px] text-zinc-600">
                <div className="hidden sm:flex items-center gap-2 font-medium">
                    <span>Afficher:</span>
                    <span className="font-bold flex items-center gap-1 cursor-pointer hover:text-[var(--color-brand-blue)] transition-colors">
                        24 par page <ChevronDown className="w-3 h-3" />
                    </span>
                </div>

                <div className="flex items-center gap-2 font-medium">
                    <span>Trier par:</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <span className="font-bold cursor-pointer hover:text-[var(--color-brand-blue)] transition-colors outline-none flex items-center gap-1">
                                {sortOptions.find(o => o.value === currentSort)?.label || "En vedette"}
                                <ChevronDown className="w-3 h-3" />
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px] p-0 bg-white border border-zinc-200 shadow-lg rounded-[4px] overflow-hidden">
                            {sortOptions.map((option) => (
                                <DropdownMenuItem
                                    key={option.value}
                                    onClick={() => updateSort(option.value)}
                                    className="px-4 py-2.5 text-[13px] font-medium text-zinc-600 hover:bg-[#f3f5f6] hover:text-[var(--color-brand-blue)] cursor-pointer"
                                >
                                    {option.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center gap-3 border-l border-zinc-200 pl-6 h-5">
                    <button className="text-[var(--color-brand-blue)] hover:text-[#002090] transition-colors"><LayoutGrid className="w-4 h-4" fill="currentColor" /></button>
                    <button className="text-zinc-400 hover:text-zinc-900 transition-colors"><List className="w-4 h-4" /></button>
                </div>
            </div>
        </div>
    );
}
