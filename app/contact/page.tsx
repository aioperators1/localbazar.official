"use client";

import { useLanguage } from "@/components/providers/language-provider";
import { Mail, MapPin, Phone, MessageCircle, ArrowUpRight, Clock, ShieldCheck, Gem } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function ContactPage() {
    const { language } = useLanguage();
    const isAr = language === "ar";
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const tContent = {
        title: isAr ? "اتصل" : "Contact",
        subtitle: isAr ? "بنا" : "Concierge",
        heroPreLabel: isAr ? "خدمات العملاء" : "CLIENT SERVICES",
        desc: isAr 
            ? "ندعوك للتواصل مع فريق الكونسيرج المخصص لدينا. نحن هنا لتلبية متطلباتك وضمان تجربة لا مثيل لها بدءًا من المجموعات الحصرية وحتى الاستفسارات المخصصة."
            : "We invite you to connect with our dedicated concierge team. From exclusive collections to bespoke inquiries, we are here to orchestrate an unparalleled experience for you.",
        hotline: isAr ? "الخط الساخن الحصري" : "Exclusive Hotline",
        hours: isAr ? "الاثنين - الجمعة، 9 صباحًا - 6 مساءً" : "Mon-Fri, 09:00 - 18:00 AST",
        emailTitle: isAr ? "البريد الإلكتروني المخصص" : "Dedicated Email",
        response: isAr ? "رد أولي مضمون خلال 24 ساعة" : "24H Priority Response",
        hq: isAr ? "مقر البوتيك" : "Boutique HQ",
        city: isAr ? "لوسيل، الدوحة" : "Lusail City, Doha",
        country: isAr ? "قطر - مدخل كبار الشخصيات" : "Qatar - VIP Entrance",
        whatsappAction: isAr ? "التواصل عبر واتساب" : "Connect via WhatsApp",
        whatsappInstant: isAr ? "مساعدة فورية" : "Instant Assistance",
        featuresLabel: isAr ? "امتيازاتنا" : "OUR PRIVILEGES",
        feat1: isAr ? "شحن دولي آمن" : "Secure Global Shipping",
        feat2: isAr ? "ضمان الأصالة 100٪" : "100% Authenticity Guarantee",
        feat3: isAr ? "تغليف هدايا فاخر" : "Premium Gift Packaging"
    };

    const phoneNumber = "97450558884";
    const whatsappLink = `https://wa.me/${phoneNumber}`;

    if (!mounted) return null;

    return (
        <div className="bg-transparent min-h-screen pt-32 pb-32 relative overflow-hidden text-white" dir={isAr ? "rtl" : "ltr"}>
            
            {/* Ambient Lighting Spheres */}
            <div className="absolute top-1/4 left-0 w-[50vw] h-[50vw] bg-[#592C2F]/20 rounded-full blur-[150px] pointer-events-none -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-rose-950/20 rounded-full blur-[120px] pointer-events-none translate-x-1/3 translate-y-1/3" />
            <div className="absolute top-1/2 left-1/2 w-[60vw] h-[60vw] bg-black/40 rounded-full blur-[200px] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0" />

            <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
                {/* Hero Header Section */}
                <div className={cn(
                    "mb-24 flex flex-col items-center justify-center text-center",
                    "motion-safe:animate-[fadeIn_1s_ease-out_forwards]"
                )}>
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
                        <Gem className="w-3.5 h-3.5 text-brand-burgundy/80" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70">{tContent.heroPreLabel}</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black uppercase tracking-tighter leading-[0.85] mb-8 mix-blend-plus-lighter">
                        {tContent.title} <br className="hidden md:block"/>
                        <span className="font-serif font-light italic text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
                            {tContent.subtitle}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/60 leading-[1.8] max-w-3xl font-medium tracking-wide">
                        {tContent.desc}
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Contact Pillars (Left) */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        <h3 className={cn(
                            "text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-2 pl-2",
                            isAr && "pr-2 pl-0 text-right"
                        )}>
                            Communication Channels
                        </h3>
                        
                        <div className="grid sm:grid-cols-2 gap-6">
                            <ContactCard
                                icon={Phone}
                                title={tContent.hotline}
                                content={`+${phoneNumber.slice(0,3)} ${phoneNumber.slice(3,7)} ${phoneNumber.slice(7)}`}
                                sub={tContent.hours}
                                isAr={isAr}
                            />
                            <ContactCard
                                icon={Mail}
                                title={tContent.emailTitle}
                                content="concierge@localbazar.com"
                                sub={tContent.response}
                                isAr={isAr}
                            />
                        </div>

                        <ContactCard
                            icon={MapPin}
                            title={tContent.hq}
                            content={`${tContent.city}, ${tContent.country}`}
                            sub="Valet Parking Available"
                            isAr={isAr}
                            fullWidth
                        />

                        {/* Extra Trust Badges */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-8">
                            <div className={cn("flex flex-col gap-2", isAr && "items-end text-right")}>
                                <Clock className="w-5 h-5 text-white/40 mb-1" />
                                <span className="text-[11px] font-black tracking-widest uppercase text-white/70">{tContent.feat1}</span>
                            </div>
                            <div className={cn("flex flex-col gap-2", isAr && "items-end text-right")}>
                                <ShieldCheck className="w-5 h-5 text-white/40 mb-1" />
                                <span className="text-[11px] font-black tracking-widest uppercase text-white/70">{tContent.feat2}</span>
                            </div>
                            <div className={cn("flex flex-col gap-2", isAr && "items-end text-right")}>
                                <Gem className="w-5 h-5 text-white/40 mb-1" />
                                <span className="text-[11px] font-black tracking-widest uppercase text-white/70">{tContent.feat3}</span>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp Epic Card (Right) */}
                    <div className="lg:col-span-5 flex flex-col justify-center h-full relative group">
                        
                        {/* Interactive Aura */}
                        <div className="absolute inset-x-0 -bottom-20 h-[150%] bg-gradient-to-t from-[#25D366]/20 via-[#25D366]/5 to-transparent blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-[40px]" />

                        <div className="relative h-full w-full bg-[#050505]/60 backdrop-blur-2xl border border-[#25D366]/20 hover:border-[#25D366]/40 p-10 md:p-14 rounded-[32px] overflow-hidden transition-all duration-700 hover:shadow-[0_0_80px_rgba(37,211,102,0.1)] flex flex-col justify-between overflow-hidden">
                            
                            {/* Glass Reflections */}
                            <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#25D366]/10 blur-[60px] rounded-full" />
                            
                            <div className={cn("relative z-10 flex flex-col h-full gap-8", isAr ? "items-end text-right" : "items-start text-left")}>
                                
                                <div className="w-20 h-20 bg-gradient-to-br from-[#25D366]/20 to-[#25D366]/5 rounded-2xl flex items-center justify-center border border-[#25D366]/30 shadow-[inset_0_0_20px_rgba(37,211,102,0.2)]">
                                    <MessageCircle className="w-8 h-8 text-[#25D366]" strokeWidth={1.5} />
                                </div>
                                
                                <div>
                                    <h3 className="text-3xl md:text-5xl font-serif italic font-light text-white mb-4">{tContent.whatsappInstant}</h3>
                                    <p className="text-white/50 font-medium leading-[1.8] text-sm md:text-base">
                                        {isAr 
                                            ? "أسرع استجابة لتأمين قطعك الفاخرة، ترتيب مواعيد القياس، أو طلب معلومات إضافية."
                                            : "The fastest response for securing your luxury pieces, arranging fittings, or requesting additional information."}
                                    </p>
                                </div>

                                <a 
                                    href={whatsappLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="mt-8 w-full group/btn relative overflow-hidden rounded-full p-[1px] inline-flex"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-[#25D366] via-emerald-400 to-[#25D366] opacity-70 group-hover/btn:opacity-100 transition-opacity duration-500 animate-[spin_4s_linear_infinite]" style={{ animationPlayState: 'running' }} />
                                    
                                    <div className="relative w-full flex items-center justify-between px-8 py-6 bg-[#0a0a0a] rounded-full transition-all duration-300 group-hover/btn:bg-transparent group-hover/btn:shadow-[inset_0_0_30px_rgba(255,255,255,0.2)]">
                                        <span className="text-sm font-bold text-white tracking-[0.2em] uppercase">
                                            {tContent.whatsappAction}
                                        </span>
                                        <ArrowUpRight className={cn("w-5 h-5 text-white transition-transform duration-500 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1", isAr && "rotate-[-90deg] group-hover/btn:translate-x-0 group-hover/btn:-translate-y-2")} />
                                    </div>
                                </a>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface ContactCardProps {
    icon: React.ElementType;
    title: string;
    content: string;
    sub: string;
    isAr?: boolean;
    fullWidth?: boolean;
}

function ContactCard({ icon: Icon, title, content, sub, isAr, fullWidth }: ContactCardProps) {
    return (
        <div className={cn(
            "relative overflow-hidden bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-3xl p-8 transition-colors duration-500 flex flex-col gap-6",
            fullWidth ? "col-span-1 sm:col-span-2" : "",
            isAr ? "items-end text-right" : "items-start text-left"
        )}>
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-white" strokeWidth={1} />
            </div>
            <div className="space-y-1 w-full">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">{title}</h4>
                <p className={cn(
                    "font-medium text-white tracking-wide mt-2 block",
                    fullWidth ? "text-2xl md:text-4xl font-serif italic" : "text-lg md:text-xl"
                )} dir={isAr ? "rtl" : "ltr"}>
                    {content}
                </p>
                <p className="text-xs text-white/30 font-mono mt-3 block uppercase tracking-widest">{sub}</p>
            </div>
        </div>
    )
}
