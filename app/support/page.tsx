import { MessageCircle } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const faqItems = [
    { q: "Logistics Timeline // Rabat?", a: "Express 24-48h deployment to major urban centers including Rabat, Casablanca, and Marrakech via high-tier transit protocols." },
    { q: "Payment Matrix // Installments?", a: "0% interest-free allocation plans (up to 3x) for transitions exceeding 2000 MAD. Select 'Instalments' during sync." },
    { q: "PC Synthesis // Expert Requirement?", a: "Our Master Technicians assemble all custom builds as standard ('Pro Synth Service'). Plug & Play guaranteed." },
    { q: "Security Layer // Warranty?", a: "24-month comprehensive hardware protection protocol against all structural defects. Physical damage excluded." },
];

export default function SupportPage() {
    return (
        <div className="bg-black min-h-screen pt-32 pb-20 relative overflow-hidden">
            {/* 🌌 VOLUMETRIC BACKLIGHT */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/10 blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <div className="text-center mb-20">
                    <h1 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter mb-6 leading-none">
                        Command <br /> <span className="text-transparent text-stroke-white opacity-20">Support</span>
                    </h1>
                    <p className="text-zinc-500 uppercase tracking-[0.4em] text-[10px] font-black">
                        Protocol: DIAGNOSE // REPAIR // UPGRADE
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8 space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-xs font-black text-indigo-500 uppercase tracking-[0.5em] flex items-center gap-4">
                                <div className="h-px w-8 bg-indigo-500/50" /> Frequency_Matrix (FAQ)
                            </h2>

                            <Accordion type="single" collapsible className="w-full space-y-4">
                                {faqItems.map((item, idx) => (
                                    <AccordionItem key={idx} value={`item-${idx}`} className="border border-white/5 bg-white/[0.02] rounded-3xl overflow-hidden px-6 transition-all hover:bg-white/[0.04] hover:border-white/10">
                                        <AccordionTrigger className="text-white hover:no-underline font-bold uppercase tracking-widest text-xs py-6">
                                            {item.q}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-zinc-500 font-light leading-relaxed pb-6 text-sm">
                                            {item.a}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-32 p-10 bg-indigo-500/[0.03] border border-indigo-500/10 rounded-[40px] text-center space-y-8 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full scale-150 group-hover:scale-200 transition-transform duration-1000" />

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                                    <MessageCircle className="w-8 h-8 text-indigo-500" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase italic mb-4">Live Uplink</h3>
                                <p className="text-xs text-zinc-500 uppercase tracking-[0.2em] leading-relaxed mb-8">
                                    Real-time technical assistance available for high-tier hardware deployment.
                                </p>
                                <Button size="lg" className="w-full h-16 bg-white text-black hover:bg-indigo-500 hover:text-white transition-all duration-700 font-black uppercase tracking-[0.3em] text-[10px] rounded-full shadow-2xl" asChild>
                                    <Link href="https://wa.me/212600000000">
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
