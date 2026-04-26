"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface LegalPageClientProps {
    title: string;
    titleAr: string;
    contentKey: string;
    settings: Record<string, string>;
}

export function LegalPageClient({ title, titleAr, contentKey, settings }: LegalPageClientProps) {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const content = isAr 
        ? (settings[`${contentKey}_ar`] || "جاري التحديث...")
        : (settings[contentKey] || "Updating soon...");

    const imageUrl = settings[`${contentKey}_image`];

    const linkify = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split(urlRegex).map((part, i) => {
            if (part.match(urlRegex)) {
                return (
                    <a 
                        key={i} 
                        href={part} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white hover:text-brand-burgundy transition-colors underline decoration-white/30 underline-offset-8"
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    if (!mounted) return null;

    return (
        <div className="bg-transparent min-h-screen pt-32 pb-32 relative overflow-hidden text-white" dir={isAr ? "rtl" : "ltr"}>
            {/* Ambient Lighting Spheres */}
            <div className="absolute top-1/4 left-0 w-[50vw] h-[50vw] bg-[#592C2F]/20 rounded-full blur-[150px] pointer-events-none -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-rose-950/20 rounded-full blur-[120px] pointer-events-none translate-x-1/3 translate-y-1/3" />
            
            <div className="container mx-auto px-6 max-w-[900px] relative z-10">
                <div className={cn(
                    "mb-16 flex flex-col justify-center",
                    isAr ? "items-end text-right" : "items-start text-left",
                    "motion-safe:animate-[fadeIn_1s_ease-out_forwards]"
                )}>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-8 mix-blend-plus-lighter">
                        {isAr ? titleAr : title}
                    </h1>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-md shadow-2xl">
                    {imageUrl && (
                        <div className="w-full h-[300px] md:h-[450px] relative">
                            <img 
                                src={imageUrl} 
                                alt={title} 
                                className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                    )}
                    
                    <div className="p-8 md:p-16">
                        <div className="prose prose-invert max-w-none">
                            <div className={cn(
                                "text-white/80 leading-[1.8] whitespace-pre-wrap text-base md:text-lg font-medium tracking-wide",
                                isAr ? "font-serif text-right" : "text-left"
                            )}>
                                {linkify(content)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
