"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import { useEffect, useState } from "react";
import { getAdminSettings } from "@/lib/actions/admin";
import Image from "next/image";

interface BrandingSize {
    text: string;
    luxuryText: string;
    divider: string;
    gap: string;
    imageHeight: number;
}

interface BrandingProps {
    className?: string;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "luxury";
    light?: boolean;
    align?: "left" | "center" | "right";
}

function LogoContent({ logoUrl, s, align, variant, light }: { logoUrl: string | null, s: BrandingSize, align: string, variant: string, light: boolean }) {
    if (logoUrl) {
        return (
            <div className={cn("relative flex items-center", align === "center" && "justify-center")} style={{ height: `${s.imageHeight}px` }}>
                <img 
                    src={logoUrl} 
                    alt="Local Bazar" 
                    className="h-full w-auto object-contain transition-all duration-700"
                />
            </div>
        );
    }

    if (variant === "luxury") {
        return (
            <div className={cn("flex items-center gap-1 group")} dir="ltr">
                <span className={cn(
                    "font-serif font-light tracking-[0.2em]",
                    s.luxuryText,
                    light ? "text-white" : "text-black"
                )}>
                    LOCAL
                </span>
                <div className={cn(
                    "flex flex-col gap-0.5 border-l pl-2 ml-1",
                    light ? "text-white/80 border-white/20" : "text-black/80 border-black/20"
                )}>
                    <span className="text-[13px] font-black tracking-[0.3em] uppercase opacity-40">Bazar</span>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("flex items-center", s.gap)} dir="ltr">
            <span className={cn(
                "font-serif font-light tracking-[-0.02em]",
                s.text,
                light ? "text-white" : "text-black"
            )}>
                LOCAL
            </span>
            <div className={cn(
                "w-[1px] rotate-[20deg]",
                s.divider,
                light ? "bg-white/20" : "bg-zinc-200"
            )} />
            <span className={cn(
                "font-serif font-bold tracking-[-0.02em] text-brand-burgundy",
                s.text
            )}>
                BAZAR
            </span>
        </div>
    );
}

export function Branding({ className, size = "md", variant = "default", light = false, align = "center" }: BrandingProps) {
    const { language } = useLanguage();
    // Use the new uploaded logo by default
    const [logoUrl, setLogoUrl] = useState<string | null>("/logo-white-transparent.png");

    useEffect(() => {
        async function loadLogo() {
            try {
                const settings = await getAdminSettings();
                if (settings && settings.website_logo_url) {
                    setLogoUrl(settings.website_logo_url);
                }
            } catch (error) {
                console.error("Failed to load branding logo:", error);
            }
        }
        loadLogo();
    }, []);

    const sizes = {
        sm: {
            text: "text-[18px]",
            luxuryText: "text-[22px]",
            divider: "h-4",
            gap: "gap-2",
            imageHeight: 32 // Slightly larger for better visibility
        },
        md: {
            text: "text-[18px] lg:text-[30px]",
            luxuryText: "text-[24px] lg:text-[40px]",
            divider: "h-5 lg:h-8",
            gap: "gap-1 lg:gap-4",
            imageHeight: 48 // Taller to show logo clearly
        },
        lg: {
            text: "text-[24px] lg:text-[42px]",
            luxuryText: "text-[32px] lg:text-[52px]",
            divider: "h-6 lg:h-12",
            gap: "gap-2 lg:gap-6",
            imageHeight: 72 // Taller for large areas
        }
    };

    const s = sizes[size];

    return (
        <div className={cn(
            "flex flex-col transition-all duration-700",
            align === "center" && "items-center text-center",
            align === "left" && "items-start text-left",
            align === "right" && "items-end text-right",
            className
        )}>
            <Link href="/" className="group relative block w-full h-full">
                <LogoContent logoUrl={logoUrl} s={s} align={align} variant={variant} light={light} />
            </Link>
        </div>
    );
}
