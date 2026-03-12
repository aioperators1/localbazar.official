import { HeroSection } from "@/components/store/HeroSection";
import { CategoryCuration } from "@/components/store/CategoryCuration";
import { NewArrivalsTabs } from "@/components/store/NewArrivalsTabs";
import { ProductCarousel } from "@/components/store/ProductCarousel";
import { WhatsAppButton } from "@/components/store/WhatsAppButton";
import { getAllProducts } from "@/lib/actions/product";
import { getAdminBanners } from "@/lib/actions/admin";
import { ShieldCheck, Truck, RefreshCcw, CreditCard } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [allProducts, rawBanners, dbSettings, allCategories] = await Promise.all([
    getAllProducts(),
    getAdminBanners(),
    import('@/lib/actions/admin').then(m => m.getAdminSettings()),
    import('@/lib/actions/admin').then(m => m.getAdminCategories())
  ]);

  const activeBanners = rawBanners.filter((b: any) => b.active).sort((a: any, b: any) => a.order - b.order);

  const fallbackSettings = {
    homepageTitle: "Doha Signature",
    homepageSubtitle: "LUXURY COLLECTION",
    aboutText: "Experience the ultimate expression of modesty and elegance with our handcrafted abayas.",
    homepageImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2000"
  };

  const settings = { ...fallbackSettings, ...(dbSettings || {}) };

  // Home groups
  const newArrivals = allProducts.slice(0, 8);
  const featuredCategories = allCategories.filter((c: any) => c.featured);

  const selectionCategory = featuredCategories.length > 0 ? featuredCategories[0] : { id: "dresses", name: "Dresses & Jalabiyas", slug: "dresses-jalabiyas" };
  const selectionProducts = allProducts.filter(p => p.categoryId === selectionCategory.id || p.category?.slug === selectionCategory.slug).slice(0, 8);

  return (
    <div className="bg-white min-h-screen pb-20 overflow-x-hidden">
      {/* Hero - Full width experience */}
      <HeroSection banners={activeBanners} settings={settings} />



      {/* New Arrivals Section with Tabs */}
      <NewArrivalsTabs products={allProducts} categories={allCategories} />

      {/* Curation Grid */}
      <CategoryCuration categories={featuredCategories} />

      <div className="py-24 bg-[#F9F9F9]">
        <div className="container mx-auto px-4 lg:px-24 mb-12 text-center">
            <span className="text-[11px] font-bold text-[#919191] uppercase tracking-[0.4em] mb-4 block">SELECTION</span>
            <h2 className="font-serif text-[42px] text-black leading-tight">{selectionCategory.name}</h2>
        </div>
        <ProductCarousel products={selectionProducts as any} />
        <div className="text-center mt-16">
          <Link href={`/shop?category=${selectionCategory.slug}`} className="inline-block bg-black text-white px-12 py-5 text-[12px] font-bold uppercase tracking-[0.3em] hover:bg-[#333] transition-all">
            Explore the Collection
          </Link>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
}
