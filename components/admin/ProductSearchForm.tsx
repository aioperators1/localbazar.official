"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

export function ProductSearchForm({ 
    defaultValue, 
    activeTab, 
    brands, 
    defaultBrandId 
}: { 
    defaultValue?: string, 
    activeTab: string,
    brands: {id: string, name: string}[],
    defaultBrandId?: string
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [q, setQ] = useState(defaultValue || "");
    const [brand, setBrand] = useState(defaultBrandId || "all");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (activeTab && activeTab !== "All") params.set("tab", activeTab);
        if (brand && brand !== "all") params.set("brandId", brand);
        
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 group w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                <Input
                    name="q"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search products, categories, or IDs..."
                    className="pl-12 h-12 text-[13px] bg-white border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400 text-black shadow-sm"
                />
            </div>
            
            <div className="w-full sm:w-[200px]">
                <Select value={brand} onValueChange={setBrand}>
                    <SelectTrigger className="h-12 border-gray-200 bg-white rounded-lg focus:border-black focus:ring-1 focus:ring-black transition-all">
                        <SelectValue placeholder="Filter by Brand" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-[9999]">
                        <SelectItem value="all">All Brands</SelectItem>
                        {brands.map((b) => (
                            <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button type="submit" className="h-12 px-8 bg-black text-white hover:bg-gray-800 rounded-lg text-[12px] font-semibold uppercase tracking-wider transition-all w-full sm:w-auto shadow-sm">
                Search
            </Button>
        </form>
    );
}
