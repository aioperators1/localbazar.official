import { MessageCircle, ShieldCheck, Truck, Clock, Ruler } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

const faqItems = [
    { 
        q: "Delivery Timeline // Qatar?", 
        a: "Express 24-48h delivery to all major locations in Qatar. Our concierge service ensures your luxury pieces arrive in pristine condition." 
    },
    { 
        q: "Payment Options // QAR?", 
        a: "We accept Cash on Delivery and all major Credit Cards. Flexible payments are available for exquisite collections exceeding " + formatPrice(5000) + "." 
    },
    { 
        q: "Authenticity Guarantee?", 
        a: "All items at Local Bazar are 100% authentic, curated from the finest heritage craftsmen and luxury ateliers." 
    },
    { 
        q: "Size & Fit Assistance?", 
        a: "Our experts are available via WhatsApp to provide personalized styling advice and precise measurement guidance for our tailleur and couture collections." 
    },
];

export default function SupportPage() {
    return (
        <div className="bg-transparent min-h-screen pt-32 pb-20 relative overflow-hidden text-white">
            {/* 🌌 SOFT ACCENT */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-white/5 blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <div className="text-center mb-20">
                    <h1 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter mb-6 leading-none">
                        Concierge <br /> <span className="text-white/10">Support</span>
                    </h1>
                    <p className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-black">
                        The Excellence of Luxury & Heritage
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8 space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-xs font-black text-white/60 uppercase tracking-[0.5em] flex items-center gap-4">
                                <div className="h-px w-8 bg-white/20" /> FAQ // Information
                            </h2>

                            <Accordion type="single" collapsible className="w-full space-y-4">
                                {faqItems.map((item, idx) => (
                                    <AccordionItem key={idx} value={`item-${idx}`} className="border border-white/10 bg-black/20 rounded-[8px] overflow-hidden px-6 transition-all hover:bg-black/30 hover:border-white/20">
                                        <AccordionTrigger className="text-white hover:no-underline font-bold uppercase tracking-widest text-[11px] py-6 text-left">
                                            {item.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-white/60 font-medium leading-relaxed pb-6 text-[13px]">
                                            {item.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-32 p-10 bg-white/5 border border-white/10 rounded-[12px] text-center space-y-8 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-150 group-hover:scale-200 transition-transform duration-1000" />

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                                    <MessageCircle className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase italic mb-4">Live Concierge</h3>
                                <p className="text-[11px] text-white/50 uppercase tracking-[0.2em] leading-relaxed mb-8 font-medium">
                                    Real-time assistance for our most exclusive collections.
                                </p>
                                <Button size="lg" className="w-full h-16 bg-white text-[#592C2F] hover:bg-white/90 transition-all duration-500 font-bold uppercase tracking-[0.3em] text-[10px] rounded-[2px] shadow-2xl" asChild>
                                    <Link href="https://wa.me/97450558884">
                                        Initiate WhatsApp
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
