import { cn } from "@/lib/utils";

export function WatermarkBackground({ className }: { className?: string }) {
    return (
        <div className={cn("fixed inset-0 overflow-hidden pointer-events-none z-[-2] bg-[#3C1518]", className)}>
            <div className="absolute inset-0 opacity-[0.12]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="luxury-pattern" x="0" y="0" width="900" height="900" patternUnits="userSpaceOnUse" patternTransform="rotate(-10) scale(1.1)">
                            <text x="-50" y="300" fontFamily="Playfair Display, serif" fontSize="400" fill="#fff" fontWeight="900">M</text>
                            <text x="400" y="450" fontFamily="Playfair Display, serif" fontSize="480" fill="#fff" fontWeight="400" fontStyle="italic">C</text>
                            <text x="150" y="800" fontFamily="Playfair Display, serif" fontSize="550" fill="#fff" fontWeight="700">L</text>
                            <text x="550" y="250" fontFamily="Playfair Display, serif" fontSize="300" fill="#fff" fontWeight="600">A</text>
                            <text x="650" y="750" fontFamily="Playfair Display, serif" fontSize="420" fill="#fff" fontWeight="500">I</text>
                            <text x="250" y="150" fontFamily="Playfair Display, serif" fontSize="220" fill="#fff" fontWeight="300">R</text>
                        </pattern>
                    </defs>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#luxury-pattern)" />
                </svg>
            </div>
            
            {/* Elegant vignette overlay */}
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(32, 8, 11, 0.95) 100%)' }} />
            <div className="absolute inset-0 noisy-bg opacity-[0.04] mix-blend-overlay" />
        </div>
    );
}
