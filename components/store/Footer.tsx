"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Twitter, Instagram, Youtube, Truck, ShieldCheck, CreditCard, Headphones, MessageCircle } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

export function Footer() {
    const pathname = usePathname();
    const { t, language } = useLanguage();
    const isAr = language === 'ar';

    if (pathname.startsWith("/admin")) return null;

    return (
        <footer className="relative z-10 bg-black text-zinc-500 border-t border-white/5 font-medium" dir={isAr ? "rtl" : "ltr"}>

            {/* Trust Bar (Service Pillars) */}
            <div className="bg-zinc-950 border-b border-white/5">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
                        {TRUST_ITEMS.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center gap-4 group">
                                <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 group-hover:border-blue-500/50 group-hover:text-blue-500 transition-all duration-500">
                                    <item.icon className="w-6 h-6" strokeWidth={1} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-white font-black text-[10px] uppercase tracking-widest">{t(`footer.trust.${item.key}.title` as any) || item.title}</h4>
                                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">{t(`footer.trust.${item.key}.desc` as any) || item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16">

                    {/* Brand */}
                    <div className="space-y-8 text-center md:text-start">
                        <Link href="/" className="block">
                            <span className="text-xl font-black tracking-tighter text-white uppercase">ELECTRO<span className="text-blue-600">ISLAM</span></span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                            {t("footer.about") || "Morocco's premier destination for high-end technology and professional grade hardware."}
                        </p>
                        <div className="flex justify-center md:justify-start gap-4">
                            <SocialIcon icon={Facebook} />
                            <SocialIcon icon={Twitter} />
                            <SocialIcon icon={Instagram} />
                            <SocialIcon icon={Youtube} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-8">
                        <h4 className="text-white font-black text-[11px] uppercase tracking-widest">&mdash; {t("footer.catalog") || "Catalog"}</h4>
                        <div className="flex flex-col gap-3 text-sm">
                            <FooterLink href="/shop">{t("footer.allProducts") || "All Products"}</FooterLink>
                            <FooterLink href="/shop?category=laptops">{t("nav.laptops")}</FooterLink>
                            <FooterLink href="/shop?category=components">{t("nav.components")}</FooterLink>
                            <FooterLink href="/marketplace">{t("nav.marketplace")}</FooterLink>
                            <FooterLink href="/deals" className="text-blue-500 font-bold">{t("nav.deals")}</FooterLink>
                        </div>
                    </div>

                    {/* My Account */}
                    <div className="space-y-8">
                        <h4 className="text-white font-black text-[11px] uppercase tracking-widest">&mdash; {t("footer.service") || "Service"}</h4>
                        <div className="flex flex-col gap-3 text-sm">
                            <FooterLink href="/account">{t("footer.accountCenter") || "Account Center"}</FooterLink>
                            <FooterLink href="/orders">{t("footer.trackShipment") || "Track Shipment"}</FooterLink>
                            <FooterLink href="/support">{t("footer.techSupport") || "Technical Support"}</FooterLink>
                            <FooterLink href="/contact">{t("footer.location") || "Location"}</FooterLink>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-8">
                        <h4 className="text-white font-black text-[11px] uppercase tracking-widest">&mdash; {t("footer.connection") || "Connection"}</h4>
                        <p className="text-xs">{t("footer.subscribe") || "Subscribe to our weekly inventory updates."}</p>
                        <form
                            className="flex flex-col gap-3"
                            onSubmit={(e) => {
                                e.preventDefault();
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const email = (e.currentTarget.elements as any)[0].value;
                                if (email) {
                                    import("sonner").then(({ toast }) => toast.success("Connected to newsletter!"));
                                    (e.target as HTMLFormElement).reset();
                                }
                            }}
                        >
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    placeholder="operative@domain.com"
                                    className={cn(
                                        "bg-zinc-900 border border-white/5 text-white text-xs py-4 rounded-xl outline-none focus:border-blue-500/50 w-full transition-all",
                                        isAr ? "pr-5 pl-24" : "pl-5 pr-24"
                                    )}
                                />
                                <button type="submit" className={cn(
                                    "absolute top-2 bottom-2 bg-blue-600 text-white font-black uppercase text-[9px] px-6 rounded-lg hover:bg-blue-500 transition-colors",
                                    isAr ? "left-2" : "right-2"
                                )}>
                                    {t("footer.join") || "Join"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-24 pt-12 border-t border-white/5 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-700 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-start">
                    <p>&copy; 2026 ELECTROISLAM PREMIUM. {t("footer.rights") || "ALL RIGHTS RESERVED."}</p>
                    <div className="flex gap-8 grayscale opacity-20">
                        <CreditCard className="w-5 h-5" />
                        <ShieldCheck className="w-5 h-5" />
                        <Truck className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </footer>
    );
}

const TRUST_ITEMS = [
    { key: "delivery", icon: Truck, title: "EXPRESS DELIVERY", desc: "Regional Distribution" },
    { key: "warranty", icon: ShieldCheck, title: "OFFICIAL WARRANTY", desc: "Certified Hardware Only" },
    { key: "commerce", icon: CreditCard, title: "SECURE COMMERCE", desc: "Multiple Payment Options" },
    { key: "support", icon: Headphones, title: "PREMIUM SUPPORT", desc: "Technical Assistance" },
    { key: "consultation", icon: MessageCircle, title: "LIVE CONSULTATION", desc: "Direct Inquiries" },
];

interface FooterLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

function FooterLink({ href, children, className }: FooterLinkProps) {
    return (
        <Link href={href} className={cn("hover:text-white transition-all flex items-center gap-3 transition-colors", className)}>
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" /> {children}
        </Link>
    );
}

function SocialIcon({ icon: Icon }: { icon: React.ElementType }) {
    return (
        <a href="#" className="w-12 h-12 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center text-zinc-500 hover:bg-white hover:text-black hover:border-white transition-all duration-500 hover:-translate-y-1">
            <Icon className="w-5 h-5" />
        </a>
    );
}
