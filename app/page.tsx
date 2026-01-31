import Link from "next/link";
import Image from "next/image";
import { HeroSection } from "@/components/store/HeroSection";
import { ProductCard } from "@/components/store/ProductCard";
import { getFeaturedProducts } from "@/lib/actions/product";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { FlashSaleHero } from "@/components/store/FlashSaleHero";
import { CategoryGrid } from "@/components/store/CategoryGrid";
import { HomeNewDropsHeader } from "@/components/store/HomeNewDropsHeader";
import { HomeMobileCatalogueLink } from "@/components/store/HomeMobileCatalogueLink";
import { MarketplaceStats } from "@/components/store/MarketplaceStats";

export const dynamic = 'force-dynamic';

const BRANDS = [
  "ASUS ROG", "MSI", "RAZER", "CORSAIR", "LOGITECH G", "ALIENWARE", "HYPERX", "STEELSERIES", "NVIDIA", "AMD", "INTEL"
];

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  // Fallback if empty (for visual fidelity)
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : [
    // GAMING LAPTOPS
    { id: '1', name: 'Razer Blade 16', slug: 'razer-blade-16', price: 32990, category: { name: 'Laptops' }, images: 'https://images.unsplash.com/photo-1624705002806-5d72df19c2ba?q=80&w=1000' },
    { id: '2', name: 'MacBook Pro M3 Max', slug: 'macbook-pro-m3-max', price: 45900, category: { name: 'Laptops' }, images: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000' },

    // COMPONENTS
    { id: '3', name: 'RTX 4090 SUPRIM X', slug: 'rtx-4090-suprim-x', price: 24900, category: { name: 'Components' }, images: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1000' },
    { id: '4', name: 'AMD Ryzen 9 7950X', slug: 'amd-ryzen-9-7950x', price: 6500, category: { name: 'Components' }, images: 'https://images.unsplash.com/photo-1555618568-d0505164f986?q=80&w=1000' },

    // CONSOLES & GAMING
    { id: '5', name: 'PlayStation 5 Pro', slug: 'playstation-5-pro', price: 8490, category: { name: 'Consoles' }, images: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=1000' },
    { id: '6', name: 'Xbox Series X', slug: 'xbox-series-x', price: 6990, category: { name: 'Consoles' }, images: 'https://images.unsplash.com/photo-1621259182902-38006d09fde0?q=80&w=1000' },

    // PERIPHERALS
    { id: '7', name: 'Logitech G Pro X 2', slug: 'logitech-g-pro-x-2', price: 1890, category: { name: 'Peripherals' }, images: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1000' },
    { id: '8', name: 'Keychron Q1 Pro', slug: 'keychron-q1-pro', price: 2200, category: { name: 'Peripherals' }, images: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000' },
  ];

  return (
    <div className="bg-background min-h-screen pb-20 overflow-x-hidden">
      <HeroSection />

      {/* 1. Trusted Brands Marquee */}
      <section className="py-12 bg-zinc-100/50 dark:bg-white/5 border-y border-zinc-200 dark:border-white/5 overflow-hidden relative backdrop-blur-md">
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-background via-background/80 to-transparent z-10" />

        <div className="flex w-[200%] animate-marquee">
          <div className="flex gap-24 items-center whitespace-nowrap px-12">
            {BRANDS.map((brand, i) => (
              <span key={i} className="text-3xl font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-tighter hover:text-zinc-900 dark:hover:text-zinc-200 transition-all duration-700 cursor-default select-none">
                {brand}
              </span>
            ))}
          </div>
          <div className="flex gap-24 items-center whitespace-nowrap px-12">
            {BRANDS.map((brand, i) => (
              <span key={`dup-${i}`} className="text-3xl font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-tighter hover:text-zinc-900 dark:hover:text-zinc-200 transition-all duration-700 cursor-default select-none">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Flash Deal Section */}
      <FadeIn className="container mx-auto px-6 py-24">
        <FlashSaleHero />
      </FadeIn>

      {/* NEW: Pro Marketplace Dynamics */}
      <MarketplaceStats />

      {/* 3. Bento Grid Categories */}
      <CategoryGrid />

      {/* 4. Filtered Grids - e.g. New Arrivals */}
      <section className="container mx-auto px-6 py-24 border-t border-zinc-900">
        <HomeNewDropsHeader />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.1}>
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  name: p.name,
                  slug: p.slug || p.id,
                  price: Number(p.price),
                  image: p.images || "",
                  category: p.category?.name || "Uncategorized"
                }}
              />
            </FadeIn>
          ))}
        </div>

        <HomeMobileCatalogueLink />
      </section>
    </div>
  );
}
