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
        <div className="flex flex-col gap-8">
            {/* Primary Visual Stage */}
            <div className="relative aspect-square w-full rounded-[40px] overflow-hidden bg-[#0a0a0a] border border-white/5 group">
                {/* Immersive Ambient Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(99,102,241,0.05),transparent_70%)]" />

                {/* Subtle Luxury Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent" />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full h-full p-8 lg:p-12"
                    >
                        <Image
                            src={images[selectedImage]}
                            alt={name}
                            fill
                            unoptimized
                            className="object-contain transition-transform duration-700 hover:scale-105"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Corner Tech Label - Minimalist */}
                <div className="absolute bottom-8 left-8 flex items-center gap-4 opacity-40">
                    <div className="w-8 h-[1px] bg-white" />
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white">Visual Artifact {selectedImage + 1}</span>
                </div>
            </div>

            {/* Thumbnail Selection - Refined */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                            "relative flex-shrink-0 w-24 aspect-square rounded-2xl overflow-hidden border transition-all duration-500",
                            selectedImage === index
                                ? "border-indigo-500/50 bg-indigo-500/5 ring-4 ring-indigo-500/10"
                                : "border-white/5 bg-zinc-900/40 hover:border-white/20"
                        )}
                    >
                        <Image
                            src={image}
                            alt={`${name} thumbnail ${index + 1}`}
                            fill
                            unoptimized
                            className={cn(
                                "object-cover p-2 transition-all duration-500",
                                selectedImage === index ? "scale-90" : "scale-100 opacity-40 group-hover:opacity-100"
                            )}
                        />
                        {selectedImage === index && (
                            <motion.div
                                layoutId="thumb-active"
                                className="absolute inset-0 border-2 border-indigo-500 rounded-2xl pointer-events-none"
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
