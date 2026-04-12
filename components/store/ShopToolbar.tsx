"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";

interface ShopToolbarProps {
    totalProducts: number;
}

export function ShopToolbar({ totalProducts }: ShopToolbarProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { t } = useLanguage();

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
            <span className="text-[12px] font-bold text-white uppercase tracking-[0.1em]">
                {totalProducts} {t('shop.items')}
            </span>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest">{t('shop.sortBy')}</span>
                    <select 
                        onChange={(e) => updateSort(e.target.value)}
                        className="text-[11px] font-bold uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer text-white [&>option]:text-black"
                        defaultValue={searchParams.get("sort") || "default"}
                    >
                        <option value="default">{t('shop.featured')}</option>
                        <option value="newest">{t('shop.newest')}</option>
                        <option value="price_asc">{t('shop.priceLow')}</option>
                        <option value="price_desc">{t('shop.priceHigh')}</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
