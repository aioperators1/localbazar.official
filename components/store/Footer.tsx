"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Twitter, Truck, ShieldCheck, CreditCard, Phone, Mail, ChevronDown } from "lucide-react";
import { Branding } from "@/components/store/Branding";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminSetting, Category } from "@/lib/types";
import { LucideIcon } from "lucide-react";

export function Footer({ settings, categories = [] }: { settings?: AdminSetting, categories?: Category[] }) {
    const pathname = usePathname();
    const { t, language } = useLanguage();
    const isAr = language === 'ar';
    const [openSection, setOpenSection] = useState<string | null>(null);

    if (pathname.startsWith("/admin")) return null;

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    // Show all categories from database
    const displayCategories = categories;

    return (
        <footer className="bg-[#1A0306] text-white pt-8 lg:pt-12 pb-6 border-t border-white/5" dir={isAr ? "rtl" : "ltr"}>
            <div className="container mx-auto px-6 lg:px-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 gap-y-12">
                    {/* Brand & Concept */}
                    <div className="flex flex-col items-center md:items-start space-y-4 md:col-span-1">
                        <div className="bg-white/5 p-4 lg:p-6 rounded-[1px] border-y md:border-y-0 md:border-l border-white/10 w-full md:w-auto flex justify-center md:justify-start">
                            <Branding variant="luxury" light size="sm" align={isAr ? "right" : "left"} className="md:scale-110 md:origin-left" />
                        </div>
                        <div className="flex flex-col items-center md:items-start space-y-3 w-full">
                            <span className="text-[13px] text-white/30 font-black tracking-[0.5em] uppercase">
                                {t('nav.est')}
                            </span>
                            <p className={cn(
                                "text-[15px] text-white/50 leading-relaxed font-medium md:max-w-sm uppercase tracking-widest bg-white/5 p-4 text-center md:text-left w-full",
                                isAr ? "md:border-r-2 border-white/20 md:text-right" : "md:border-l-2 border-white/20"
                            )}>
                                {settings?.aboutText || t('footer.about')}
                            </p>
                            <div className="flex gap-4 pt-2">
                                <SocialIcon icon={Instagram} href="#" />
                                <SocialIcon icon={Twitter} href="#" />
                                <SocialIcon icon={Phone} href="#" />
                            </div>
                        </div>
                    </div>
 
                    {/* Mobile Accordions / Desktop Lists */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12">
                        {/* Collections */}
                        <div className="border-b md:border-0 border-white/5 pb-2 md:pb-0">
                            <button 
                                onClick={() => toggleSection('collections')}
                                className="flex items-center justify-between w-full md:cursor-default"
                            >
                                <h4 className="text-white font-bold text-[13px] uppercase tracking-[0.2em] mb-2 md:mb-4">{t('nav.collections')}</h4>
                                <ChevronDown className={cn("w-4 h-4 md:hidden transition-transform duration-500 text-white/40", openSection === 'collections' && "rotate-180")} />
                            </button>
                            <div className={cn("overflow-hidden transition-all duration-500", openSection === 'collections' ? "max-h-[400px] opacity-100" : "max-h-0 md:max-h-full opacity-0 md:opacity-100")}>
                                <ul className="space-y-4 md:space-y-2 pb-2 md:pb-0 pt-2 md:pt-0">
                                    {displayCategories.map((cat) => (
                                        <FooterLink key={cat.id} href={`/shop?category=${cat.slug}`}>
                                            {isAr && cat.nameAr ? cat.nameAr : cat.name}
                                        </FooterLink>
                                    ))}
                                    <FooterLink href="/shop?category=new-arrivals">{t('nav.newArrivals')}</FooterLink>
                                </ul>
                            </div>
                        </div>

                        {/* Boutique */}
                        <div className="border-b md:border-0 border-white/5 py-2 md:py-0">
                            <button 
                                onClick={() => toggleSection('boutique')}
                                className="flex items-center justify-between w-full md:cursor-default"
                            >
                                <h4 className="text-white font-bold text-[13px] uppercase tracking-[0.2em] mb-2 md:mb-4">{t('footer.company')}</h4>
                                <ChevronDown className={cn("w-4 h-4 md:hidden transition-transform duration-500 text-white/40", openSection === 'boutique' && "rotate-180")} />
                            </button>
                            <div className={cn("overflow-hidden transition-all duration-500", openSection === 'boutique' ? "max-h-[300px] opacity-100" : "max-h-0 md:max-h-full opacity-0 md:opacity-100")}>
                                <ul className="space-y-4 md:space-y-2 pb-2 md:pb-0 pt-2 md:pt-0">
                                    <FooterLink href="/about">{t('nav.ourStory')}</FooterLink>
                                    <FooterLink href="/contact">{t('footer.contact')}</FooterLink>
                                    <FooterLink href="/shipping">{t('nav.shippingPolicy')}</FooterLink>
                                    <FooterLink href="/terms">{t('footer.terms')}</FooterLink>
                                    <FooterLink href="/privacy">{t('footer.privacy')}</FooterLink>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="mt-10 pt-5 border-t border-white/5 flex flex-col items-center gap-8 text-[9px] text-white/30 font-medium uppercase tracking-[0.3em] overflow-hidden">
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 w-full max-w-4xl">
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

                    <div className="flex flex-col items-center gap-4 w-full">
                        <div className="w-8 h-[1px] bg-white/10" />
                        <span className="text-white/40 tracking-[0.6em] font-black animate-pulse hover:text-white transition-colors cursor-default">
                            DESIGNED BY AI OPERATORS GROUP
                        </span>
                    </div>

                    <div className="flex gap-8 items-center text-white/10 pt-2">
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
