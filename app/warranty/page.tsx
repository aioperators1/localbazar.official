import { ShieldCheck, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WarrantyPage() {
    return (
        <div className="bg-transparent min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <ShieldCheck className="w-20 h-20 text-white/20 mx-auto mb-6" />
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-6">
                        Quality <span className="text-white/50">Assurance</span>
                    </h1>
                    <p className="text-xl text-white/60">
                        Every piece at Local Bazar is a testament to artisanal excellence and heritage.
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="bg-black/20 border border-white/10 p-8 rounded-xl">
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 italic uppercase tracking-tighter">
                            <CheckCircle className="text-white/50" /> Artisanal Integrity
                        </h3>
                        <p className="text-white/60 leading-relaxed mb-4">
                            Our collections are crafted from the finest materials. We provide a <strong className="text-white">6-month craftsmanship guarantee</strong> on all couture and tailleur pieces.
                        </p>
                        <ul className="space-y-2 text-white/40 text-sm list-disc pl-5 font-medium uppercase tracking-widest text-[10px]">
                            <li>Stitching & Seam Integrity</li>
                            <li>Embroidery & Bead Placement</li>
                            <li>Material Authenticity</li>
                            <li>Fragrance Preservation</li>
                        </ul>
                    </div>

                    <div className="bg-black/20 border border-white/10 p-8 rounded-xl">
                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 italic uppercase tracking-tighter">
                            <CheckCircle className="text-white/50" /> Limitations
                        </h3>
                        <p className="text-white/60 leading-relaxed mb-4">
                            The guarantee does not cover wear through normal Use or improper after-care.
                        </p>
                        <ul className="space-y-2 text-white/40 text-sm list-disc pl-5 font-medium uppercase tracking-widest text-[10px]">
                            <li>Improper Dry Cleaning Damage</li>
                            <li>Fabric Snags from jewelry/accessories</li>
                            <li>Improper storage of perfumes</li>
                            <li>Discoloration from chemical exposure</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-white/30 mb-6 uppercase tracking-[0.2em] font-black text-[10px]">Need assistance with your piece?</p>
                    <Button size="lg" className="bg-white text-[#592C2F] hover:bg-white/90 font-black uppercase tracking-widest rounded-[2px]" asChild>
                        <Link href="/contact">Contact Concierge</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
