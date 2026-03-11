"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Twitter, Truck, ShieldCheck, CreditCard, Headphones, MapPin, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Footer() {
    const pathname = usePathname();
    const { t, language } = useLanguage();
    const isAr = language === 'ar';

    if (pathname.startsWith("/admin")) return null;

    return (
        <footer className="bg-[#111111] text-white pt-24 pb-12" dir={isAr ? "rtl" : "ltr"}>
            <div className="container mx-auto px-4 lg:px-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12">
                    {/* Brand & Concept */}
                    <div className="space-y-8">
                        <Link href="/" className="flex flex-col items-start group">
                            <div className="relative w-[180px] h-[40px]">
                                <Image 
                                    src="/logo.svg" 
                                    alt="Local Bazar Logo" 
                                    fill 
                                    className="object-contain brightness-0 invert" 
                                />
                            </div>
                            <span className="text-white/40 font-medium text-[9px] tracking-[0.5em] uppercase mt-2">
                                EST. 2013 — QATAR
                            </span>
                        </Link>
                        <p className="text-[12px] text-white/50 leading-loose font-medium max-w-xs uppercase tracking-widest">
                            L'excellence de la mode et des senteurs d'Orient. Une signature d'élégance masculine depuis 2013.
                        </p>
                        <div className="flex gap-6 pt-2">
                            <SocialIcon icon={Facebook} href="#" />
                            <SocialIcon icon={Instagram} href="https://instagram.com/localbazar.qtr" />
                            <SocialIcon icon={Twitter} href="#" />
                        </div>
                    </div>

                    {/* Collections */}
                    <div>
                        <h4 className="text-white font-bold text-[11px] uppercase mb-8 tracking-[0.2em]">Collections</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/shop?category=evening-wear">Couture du Soir</FooterLink>
                            <FooterLink href="/shop?category=suits">L'Art du Tailleur</FooterLink>
                            <FooterLink href="/shop?category=traditional">Héritage</FooterLink>
                            <FooterLink href="/shop?category=accessories">Accessoires</FooterLink>
                            <FooterLink href="/shop?category=new-arrivals">Nouveautés</FooterLink>
                        </ul>
                    </div>

                    {/* Boutique */}
                    <div>
                        <h4 className="text-white font-bold text-[11px] uppercase mb-8 tracking-[0.2em]">L'Univers</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/about">Notre Histoire</FooterLink>
                            <FooterLink href="/contact">Contact</FooterLink>
                            <FooterLink href="/shipping">Livraison & Retours</FooterLink>
                            <FooterLink href="/terms">CGV</FooterLink>
                            <FooterLink href="/privacy">Confidentialité</FooterLink>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-8">
                        <h4 className="text-white font-bold text-[11px] uppercase tracking-[0.2em]">Newsletter</h4>
                        <p className="text-[11px] text-white/50 leading-relaxed font-medium uppercase tracking-widest">
                            Inscrivez-vous pour recevoir nos actualités et invitations exclusives.
                        </p>
                        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="VOTRE ADRESSE EMAIL"
                                className="bg-transparent border-b border-white/20 text-[10px] py-3 outline-none focus:border-white transition-colors font-medium tracking-widest text-white placeholder:text-white/30"
                            />
                            <button className="text-white text-[10px] font-bold uppercase py-4 border border-white/20 hover:bg-white hover:text-black transition-all tracking-[0.3em]">
                                S'abonner
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] text-white/30 font-medium uppercase tracking-[0.3em]">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <p>&copy; 2026 LOCAL BAZAR. TOUS DROITS RÉSERVÉS.</p>
                        <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            <span>+974 5055 8884</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            <span>LOCALBAZAR.QTR@GMAIL.COM</span>
                        </div>
                    </div>
                    <div className="flex gap-8 items-center text-white/20">
                        <CreditCard className="w-4 h-4" />
                        <Truck className="w-4 h-4" />
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </footer>
    );
}

const TRUST_ITEMS = [
    { icon: Truck, title: "LIVRAISON RAPIDE", desc: "Partout à Qatar" },
    { icon: ShieldCheck, title: "GARANTIE OFFICIELLE", desc: "Produits 100% Authentiques" },
    { icon: CreditCard, title: "PAIEMENT SÉCURISÉ", desc: "CB ou Cash à la livraison" },
    { icon: Headphones, title: "SERVICE CLIENT 24/7", desc: "Support technique expert" },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="text-white/50 hover:text-white text-[11px] font-medium uppercase tracking-widest transition-colors">
                {children}
            </Link>
        </li>
    );
}

function SocialIcon({ icon: Icon, href }: { icon: any; href: string }) {
    return (
        <a href={href} className="text-white/40 hover:text-white transition-colors">
            <Icon className="w-5 h-5" />
        </a>
    );
}
