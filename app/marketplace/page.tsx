import { getMarketplaceProducts, getCategories } from "@/lib/actions/product";
import { ProductCard } from "@/components/store/ProductCard";
import { FadeIn } from "@/components/ui/fade-in";
import { MarketplaceStats } from "@/components/store/MarketplaceStats";
import { MarketplaceHero } from "@/components/marketplace/MarketplaceHero";
import { ShoppingBag, Users, Zap, Search, Globe, ChevronRight, LayoutGrid, PlusCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata = {
    title: "Marketplace | ElectroIslam Community",
    description: "The leading community marketplace for gaming hardware in Morocco.",
};

export default async function MarketplacePage() {
    const products = await getMarketplaceProducts();
    const categories = await getCategories();

    return (
        <div className="bg-black min-h-screen pb-32 pt-24 relative selection:bg-blue-500/30">
            <main className="relative z-10 container mx-auto px-6 lg:px-12">
                <MarketplaceHero />

                <div className="max-w-7xl mx-auto mt-12">
                    <MarketplaceStats />

                    {/* Advantage Grid */}
                    <section className="py-20">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Zap,
                                    title: "Direct Access",
                                    desc: "Connect directly with verified owners of high-performance hardware across Morocco.",
                                    color: "blue"
                                },
                                {
                                    icon: Users,
                                    title: "Verified Registry",
                                    desc: "Our platform ensures a standard of trust and technical verification for all participants.",
                                    color: "blue"
                                },
                                {
                                    icon: Globe,
                                    title: "Professional Logistics",
                                    desc: "Benefit from a streamlined infrastructure designed for safe and efficient hardware transfer.",
                                    color: "blue"
                                }
                            ].map((item, i) => (
                                <FadeIn key={i} delay={i * 0.1}>
                                    <div className="group p-10 rounded-xl bg-zinc-900/40 border border-white/5 hover:border-blue-500/20 transition-all shadow-pro">
                                        <div className="w-12 h-12 rounded-lg bg-blue-600/10 text-blue-500 flex items-center justify-center mb-8">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">{item.title}</h3>
                                        <p className="text-[11px] text-zinc-500 leading-relaxed font-bold uppercase tracking-tighter">{item.desc}</p>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    </section>

                    {/* Main Listings Grid */}
                    <section id="community-drops" className="py-20 border-t border-white/5">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">COMMUNITY INVENTORY</span>
                                </div>
                                <h2 className="text-4xl font-black tracking-tighter uppercase text-white">Latest Verified <span className="text-blue-600">Assets</span></h2>
                            </div>

                            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0 w-full md:w-auto">
                                <Link
                                    href="/shop"
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2 whitespace-nowrap shadow-pro"
                                >
                                    <LayoutGrid className="w-3.5 h-3.5" />
                                    ALL CATEGORIES
                                </Link>
                                {categories.slice(0, 4).map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/shop?category=${cat.slug}`}
                                        className="px-6 py-3 bg-zinc-900 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-blue-500/20 transition-all whitespace-nowrap"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {products.map((p, i) => (
                                    <FadeIn key={p.id} delay={i * 0.05}>
                                        <ProductCard
                                            product={{
                                                ...p,
                                                image: p.images || "",
                                                category: p.category?.name || "Standard"
                                            }}
                                        />
                                    </FadeIn>
                                ))}
                            </div>
                        ) : (
                            <div className="py-32 text-center rounded-xl bg-zinc-900/20 border border-dashed border-white/5">
                                <ShoppingBag className="w-12 h-12 text-zinc-800 mx-auto mb-6" />
                                <h3 className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-4">No Verified Listings</h3>
                                <p className="text-[10px] text-zinc-700 max-w-sm mx-auto font-black uppercase tracking-tighter mb-10">Contribute to the network by listing your professional hardware.</p>
                                <Link href="/sell" className="inline-flex items-center gap-3 px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                                    POST INVENTORY AD <PlusCircle className="w-4 h-4" />
                                </Link>
                            </div>
                        )}

                        {products.length > 0 && (
                            <div className="mt-20 flex justify-center">
                                <button className="px-12 py-5 bg-zinc-900 border border-white/5 rounded-lg text-[10px] font-black text-zinc-500 hover:text-white transition-all uppercase tracking-widest">
                                    Load More Inventory
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
