"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
    name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div className="flex flex-col lg:flex-row-reverse gap-6 w-full">
            {/* Primary Visual Stage */}
            <div className="relative aspect-[3/4] w-full grow overflow-hidden bg-[#F9F9F9] group rounded-xl shadow-sm border border-zinc-100">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={images[selectedImage]}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110 ease-out"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
                
                {/* Micro-overlay badge */}
                <div className="absolute bottom-6 right-6 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full border border-zinc-100/50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#111111]">Luxe Focus</span>
                </div>
            </div>

            {/* Thumbnail Selection - Vertical on Desktop */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] no-scrollbar py-1">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                            "relative flex-shrink-0 w-20 lg:w-24 aspect-[3/4] overflow-hidden rounded-lg border-2 transition-all duration-500",
                            selectedImage === index
                                ? "border-[#111111] shadow-md ring-4 ring-[#111111]/5"
                                : "border-transparent bg-zinc-50 hover:border-zinc-200"
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
