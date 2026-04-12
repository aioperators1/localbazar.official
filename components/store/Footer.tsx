"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Twitter, Truck, ShieldCheck, CreditCard, Phone, Mail, ChevronDown } from "lucide-react";
import { Branding } from "@/components/store/Branding";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminSetting } from "@/lib/types";
import { LucideIcon } from "lucide-react";

export function Footer({ settings }: { settings?: AdminSetting }) {
    const pathname = usePathname();
    const { t, language } = useLanguage();
    const isAr = language === 'ar';
    const [openSection, setOpenSection] = useState<string | null>(null);

    if (pathname.startsWith("/admin")) return null;

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <footer className="bg-[#1A0306] text-white pt-16 lg:pt-24 pb-12 border-t border-white/5" dir={isAr ? "rtl" : "ltr"}>
            <div className="container mx-auto px-6 lg:px-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12 gap-y-16">
                    {/* Brand & Concept */}
                    <div className="flex flex-col items-center lg:items-start space-y-8 lg:col-span-1">
                        <div className="bg-white/5 p-6 lg:p-8 rounded-[1px] border-y lg:border-y-0 lg:border-l border-white/10 w-full lg:w-auto flex justify-center lg:justify-start">
                            <Branding variant="luxury" light align={isAr ? "right" : "left"} />
                        </div>
                        <div className="flex flex-col items-center lg:items-start space-y-4">
                            <span className="text-[15px] text-white/30 font-black tracking-[0.5em] uppercase">
                                {t('nav.est')}
                            </span>
                            <p className={cn(
                                "text-[18px] text-white/50 leading-[2] font-medium max-w-xs uppercase tracking-widest bg-white/5 p-6 text-center lg:text-left",
                                isAr ? "lg:border-r-2 border-white/20 lg:text-right" : "lg:border-l-2 border-white/20"
                            )}>
                                {settings?.aboutText || t('footer.about')}
                            </p>
                            <div className="flex gap-8 pt-4">
                                <SocialIcon icon={Instagram} href="#" />
                                <SocialIcon icon={Twitter} href="#" />
                                <SocialIcon icon={Phone} href="#" />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Accordions / Desktop Lists */}
                    <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12">
                        {/* Collections */}
                        <div className="border-b lg:border-0 border-white/5 pb-4 lg:pb-0">
                            <button 
                                onClick={() => toggleSection('collections')}
                                className="flex items-center justify-between w-full lg:cursor-default"
                            >
                                <h4 className="text-white font-bold text-[14px] uppercase tracking-[0.2em] mb-4 lg:mb-8">{t('nav.collections')}</h4>
                                <ChevronDown className={cn("w-4 h-4 lg:hidden transition-transform duration-500 text-white/40", openSection === 'collections' && "rotate-180")} />
                            </button>
                            <div className={cn("overflow-hidden transition-all duration-500", openSection === 'collections' ? "max-h-[300px] opacity-100" : "max-h-0 lg:max-h-full opacity-0 lg:opacity-100")}>
                                <ul className="space-y-4 pb-4 lg:pb-0">
                                    <FooterLink href="/shop?category=abayas">{t('cat.abayas')}</FooterLink>
                                    <FooterLink href="/shop?category=jalabiyas">{t('cat.dresses')}</FooterLink>
                                    <FooterLink href="/shop?category=men">{t('cat.men')}</FooterLink>
                                    <FooterLink href="/shop?category=perfumes">{t('cat.perfumes')}</FooterLink>
                                    <FooterLink href="/shop?category=new-arrivals">{t('nav.newArrivals')}</FooterLink>
                                </ul>
                            </div>
                        </div>

                        {/* Boutique */}
                        <div className="border-b lg:border-0 border-white/5 py-4 lg:py-0">
                            <button 
                                onClick={() => toggleSection('boutique')}
                                className="flex items-center justify-between w-full lg:cursor-default"
                            >
                                <h4 className="text-white font-bold text-[14px] uppercase tracking-[0.2em] mb-4 lg:mb-8">{t('footer.company')}</h4>
                                <ChevronDown className={cn("w-4 h-4 lg:hidden transition-transform duration-500 text-white/40", openSection === 'boutique' && "rotate-180")} />
                            </button>
                            <div className={cn("overflow-hidden transition-all duration-500", openSection === 'boutique' ? "max-h-[300px] opacity-100" : "max-h-0 lg:max-h-full opacity-0 lg:opacity-100")}>
                                <ul className="space-y-4 pb-4 lg:pb-0">
                                    <FooterLink href="/about">{t('nav.ourStory')}</FooterLink>
                                    <FooterLink href="/contact">{t('footer.contact')}</FooterLink>
                                    <FooterLink href="/shipping">{t('nav.shippingPolicy')}</FooterLink>
                                    <FooterLink href="/terms">{t('footer.terms')}</FooterLink>
                                    <FooterLink href="/privacy">{t('footer.privacy')}</FooterLink>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <h4 className="text-white font-bold text-[14px] uppercase tracking-[0.2em]">{t('footer.newsletter')}</h4>
                        <p className="text-[16px] text-white/50 leading-relaxed font-medium uppercase tracking-widest max-w-xs">
                            {t('footer.newsletterDesc')}
                        </p>
                        <form className="flex flex-col gap-4 w-full" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder={t('footer.emailPlaceholder')}
                                className={cn(
                                    "bg-black/20 border border-white/10 rounded-[2px] text-[16px] py-4 px-6 outline-none focus:border-white transition-colors font-medium tracking-widest text-white placeholder:text-white/30",
                                    isAr && "text-right"
                                )}
                            />
                            <button className="bg-white text-black text-[16px] font-black uppercase py-4 hover:bg-white/90 transition-all tracking-[0.3em] shadow-xl">
                                {t('footer.subscribeButton')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col items-center gap-12 text-[9px] text-white/30 font-medium uppercase tracking-[0.3em] overflow-hidden">
                    <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 w-full max-w-4xl">
                        <p className="whitespace-nowrap">&copy; {new Date().getFullYear()} {settings?.siteName || "LOCAL BAZAR"}. {t('footer.rights')}</p>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <Phone className="w-3 h-3" />
                            <span>{settings?.contactPhone || "+974 5055 8884"}</span>
                        </div>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <Mail className="w-3 h-3" />
                            <span className="uppercase">{settings?.contactEmail || "LOCALBAZAR.QTR@GMAIL.COM"}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6 w-full">
                        <div className="w-8 h-[1px] bg-white/10" />
                        <span className="text-white/40 tracking-[0.6em] font-black animate-pulse hover:text-white transition-colors cursor-default">
                            DESIGNED BY AI OPERATORS GROUP
                        </span>
                    </div>

                    <div className="flex gap-10 items-center text-white/10 pt-4">
                        <CreditCard className="w-4 h-4 hover:text-white/30 transition-colors" />
                        <Truck className="w-4 h-4 hover:text-white/30 transition-colors" />
                        <ShieldCheck className="w-4 h-4 hover:text-white/30 transition-colors" />
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="text-white/40 hover:text-white text-[11px] font-medium uppercase tracking-widest transition-colors block">
                {children}
            </Link>
        </li>
    );
}

function SocialIcon({ icon: Icon, href }: { icon: LucideIcon; href: string }) {
    return (
        <a href={href} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:bg-white hover:text-black transition-all border border-white/5">
            <Icon className="w-4 h-4" />
        </a>
    );
}
