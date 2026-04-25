"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnnouncementBarProps {
    text: string;
    active: boolean;
    bgColor?: string;
    textColor?: string;
}

export function AnnouncementBar({ text, active, bgColor = "#000000", textColor = "#FFFFFF" }: AnnouncementBarProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !active || !text) return null;

    // We use a CSS-based marquee for ultimate performance on mobile phones.
    // By duplicating the string enough times, we ensure it fills 200% of the movement container.
    const segment = `${text.toUpperCase()} • `;
    
    return (
        <div 
            className="w-full h-8 lg:h-9 overflow-hidden flex items-center relative z-[200] border-b border-black/5 select-none touch-none"
            style={{ backgroundColor: bgColor }}
        >
            {/* 
                CS-Engine Marquee: 
                - Using pure CSS keyframes instead of JS for zero-latency on mobile Safari/Chrome.
                - 'animate-marquee' is defined in globals.css.
                - We render the content twice to allow for the -50% translateX loop.
            */}
            <div className="flex whitespace-nowrap animate-marquee">
                <div className="flex items-center min-w-full">
                    <span 
                        className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em] px-8"
                        style={{ color: textColor }}
                    >
                        {Array(10).fill(segment).join("  ")}
                    </span>
                </div>
                {/* Secondary Mirror Node for Absolute Seamless Loop on all screen sizes */}
                <div className="flex items-center min-w-full">
                    <span 
                        className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.4em] px-8"
                        style={{ color: textColor }}
                    >
                        {Array(10).fill(segment).join("  ")}
                    </span>
                </div>
            </div>
            
            {/* Visual Balance Overlays */}
            <div 
                className="absolute inset-y-0 left-0 w-16 pointer-events-none z-10" 
                style={{ background: `linear-gradient(to right, ${bgColor}, transparent)` }}
            />
            <div 
                className="absolute inset-y-0 right-0 w-16 pointer-events-none z-10" 
                style={{ background: `linear-gradient(to left, ${bgColor}, transparent)` }}
            />
        </div>
    );
}
