"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { useLanguage } from "@/components/providers/language-provider";

interface ProductGalleryProps {
    images: string[];
    name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
    const { language, t } = useLanguage();
    const isAr = language === 'ar';
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div className={cn(
            "flex flex-col gap-6 w-full",
            isAr ? "lg:flex-row" : "lg:flex-row-reverse"
        )} dir={isAr ? "rtl" : "ltr"}>
            {/* Primary Visual Stage */}
            <div className="relative aspect-[3/4] w-full grow overflow-hidden bg-black/20 group shadow-sm transition-all duration-700">
                <AnimatePresence>
                    <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <Image
                            src={images[selectedImage]}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105 ease-out"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
                
                {/* Micro-overlay badge */}
                <div className={cn(
                    "absolute bottom-6 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full border border-zinc-100/50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    isAr ? "left-6" : "right-6"
                )}>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#111111]">{t("product.luxeFocus")}</span>
                </div>
            </div>

            {/* Thumbnail Selection - Vertical on Desktop */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] no-scrollbar py-1 justify-center lg:justify-start">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                            "relative flex-shrink-0 w-20 lg:w-24 aspect-[3/4] overflow-hidden transition-all duration-500",
                            selectedImage === index
                                ? "ring-1 ring-white shadow-xl opacity-100"
                                : "opacity-30 bg-black/5 hover:opacity-100"
                        )}
                    >
                        <Image
                            src={image}
                            alt={`${name} thumbnail ${index + 1}`}
                            fill
                            className={cn(
                                "object-cover transition-all duration-500",
                                selectedImage === index ? "opacity-100" : "opacity-40 grayscale-[0.5] hover:opacity-100 hover:grayscale-0"
                            )}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
