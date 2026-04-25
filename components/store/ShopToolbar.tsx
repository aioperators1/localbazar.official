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
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('open-mobile-filters'))}
                    className="lg:hidden flex items-center gap-2 text-[11px] font-bold text-white uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-full border border-white/10"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H21M6 12H18M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    {t('shop.filters')}
                </button>
                <span className="text-[12px] font-bold text-white uppercase tracking-[0.1em] hidden sm:inline">
                    {totalProducts} {t('shop.items')}
                </span>
            </div>

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
