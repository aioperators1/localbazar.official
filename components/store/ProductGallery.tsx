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
            <div className="relative aspect-[3/4] w-full grow overflow-hidden bg-[#F9F9F9] group shadow-sm">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={images[selectedImage]}
                            alt={name}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Thumbnail Selection - Vertical on Desktop */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] no-scrollbar">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                            "relative flex-shrink-0 w-20 lg:w-24 aspect-[3/4] overflow-hidden border transition-all duration-300",
                            selectedImage === index
                                ? "border-[#111111]"
                                : "border-transparent bg-zinc-50 hover:border-zinc-200"
                        )}
                    >
                        <Image
                            src={image}
                            alt={`${name} thumbnail ${index + 1}`}
                            fill
                            unoptimized
                            className={cn(
                                "object-cover",
                                selectedImage === index ? "opacity-100" : "opacity-60"
                            )}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
