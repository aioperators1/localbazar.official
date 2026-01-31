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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6 border-b border-border/40 pb-8 relative z-30">
            <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em]">Index Discovery</span>
                <p className="text-sm font-light text-zinc-600 dark:text-zinc-400">
                    Showing <span className="text-black dark:text-white font-bold">{totalProducts}</span> available units
                </p>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] hidden sm:inline-block">Filter_By:</span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded-full border-border/40 bg-background/50 backdrop-blur-xl px-6 gap-3 font-bold uppercase text-[9px] tracking-widest hover:bg-foreground hover:text-background transition-all">
                                {sortOptions.find(o => o.value === currentSort)?.label || "Sort By"}
                                <ChevronDown className="w-3 h-3 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px] p-2 bg-popover/95 backdrop-blur-3xl border-border rounded-2xl">
                            {sortOptions.map((option) => (
                                <DropdownMenuItem
                                    key={option.value}
                                    onClick={() => updateSort(option.value)}
                                    className="flex items-center justify-between cursor-pointer rounded-xl py-3 px-4 focus:bg-accent focus:text-accent-foreground text-[10px] font-bold uppercase tracking-widest"
                                >
                                    <span>{option.label}</span>
                                    {currentSort === option.value && <Check className="w-3 h-3 text-primary" />}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="h-4 w-px bg-border hidden sm:block" />

                <div className="flex items-center gap-2 border border-border/40 bg-muted/20 rounded-full p-1 shadow-inner">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                        <LayoutGrid className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground">
                        <List className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
