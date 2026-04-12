import Link from "next/link";
import { MoveLeft, House, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="bg-transparent text-white min-h-[80vh] flex flex-col items-center justify-center px-6 text-center animate-in fade-in duration-1000">
            {/* Background Texture/Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -z-10" />
            
            <span className="text-[100px] md:text-[180px] font-serif font-black text-white/5 leading-none select-none">404</span>
            
            <div className="max-w-[500px] -mt-10 md:-mt-20">
                <h1 className="text-[24px] md:text-[32px] font-black uppercase tracking-tighter text-white mb-4">
                    The item you are looking for has vanished.
                </h1>
                <p className="text-[14px] md:text-[16px] text-white/50 font-medium mb-10 leading-relaxed">
                    It might have been acquired by another collector or moved to a different wing of the bazar.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild className="h-14 px-8 bg-white hover:bg-white/90 text-[#592C2F] font-bold rounded-[2px] transition-all uppercase tracking-[0.2em] text-[12px] group">
                        <Link href="/">
                            <House className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                            Return Home
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-14 px-8 border-white/20 hover:border-white text-white bg-transparent hover:bg-white/10 font-bold rounded-[2px] transition-all uppercase tracking-[0.2em] text-[12px] group">
                        <Link href="/shop">
                            <Search className="w-4 h-4 mr-2" />
                            Explore Shop
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="mt-20 flex items-center gap-8 opacity-40 filter grayscale">
                <div className="text-[10px] font-black tracking-widest uppercase">Archivage</div>
                <div className="w-1 h-1 bg-white rounded-full" />
                <div className="text-[10px] font-black tracking-widest uppercase">Éditions</div>
                <div className="w-1 h-1 bg-white rounded-full" />
                <div className="text-[10px] font-black tracking-widest uppercase">Boutique</div>
            </div>
        </div>
    );
}
