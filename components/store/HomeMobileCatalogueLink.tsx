"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function HomeMobileCatalogueLink() {
    const { t } = useLanguage();

    return (
        <div className="flex justify-center mt-12 md:hidden">
            <Link href="/shop" className="text-sm font-bold text-white uppercase tracking-widest hover:text-blue-500 transition-colors flex items-center gap-2">
                {t("home.viewCatalogue")} <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
}
