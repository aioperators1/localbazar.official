import { HeroSection } from "@/components/store/HeroSection";
import { CategoryCuration } from "@/components/store/CategoryCuration";
import { NewArrivalsTabs } from "@/components/store/NewArrivalsTabs";
import { WhatsAppButton } from "@/components/store/WhatsAppButton";
import { HomeContent } from "@/components/store/HomeContent";
import { HomeBrands } from "@/components/store/HomeBrands";
import { getAllProducts } from "@/lib/actions/product";
import { ScrollReveal } from "@/components/store/ScrollReveal";
import { getAdminBanners } from "@/lib/actions/admin";
import { DynamicSectionsBuilder } from "@/components/store/DynamicSectionsBuilder";

import { Category, Banner, Brand, Product, AdminSetting } from "@/lib/types";

export const revalidate = 60;

export default async function Home() {
  const [allProducts, rawBanners, dbSettings, allCategories, allBrands] = await Promise.all([
    getAllProducts() as Promise<Product[]>,
    getAdminBanners() as Promise<Banner[]>,
    import('@/lib/actions/admin').then(m => m.getAdminSettings()),
    import('@/lib/actions/admin').then(m => m.getAdminCategories()) as Promise<Category[]>,
    import('@/lib/actions/admin').then(m => m.getAdminBrands()) as Promise<Brand[]>
  ]);

  const activeBanners = rawBanners.filter((b: Banner) => b.active).sort((a: Banner, b: Banner) => a.order - b.order);

  const rawSections = dbSettings?.home_sections;
  let parsedDynamicSections = [];
  if (rawSections) {
    try {
      parsedDynamicSections = JSON.parse(rawSections);
    } catch(e) {}
  }

  const fallbackSettings = {
    homepageTitle: "Doha Signature",
    homepageSubtitle: "LUXURY COLLECTION",
    aboutText: "Experience the ultimate expression of modesty and elegance with our handcrafted abayas.",
    homepageImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2000",
    whatsappNumber: "97450558884"
  };

  const settings: AdminSetting = { ...fallbackSettings, ...(dbSettings || {}) };

  const homeBrands = allBrands.filter((b: Brand) => b.showInHome);

  // Home groups
  const homeTabsCategories = allCategories
    .filter((c: Category) => c.showInHomeTabs)
    .sort((a: Category, b: Category) => (a.orderInHomeTabs || 0) - (b.orderInHomeTabs || 0));

  const homeCuratedCategories = allCategories
    .filter((c: Category) => c.showInHomeCurated)
    .sort((a: Category, b: Category) => (a.orderInHomeCurated || 0) - (b.orderInHomeCurated || 0));

  const featuredCategories = allCategories.filter((c: Category) => c.featured);
  const selectionCategory = featuredCategories.length > 0 ? featuredCategories[0] : (homeCuratedCategories.length > 0 ? homeCuratedCategories[0] : null);
  const selectionProducts = selectionCategory ? allProducts.filter(p => p.categoryId === selectionCategory.id || p.category?.slug === selectionCategory.slug).slice(0, 8) : [];

  return (
    <div className="relative min-h-screen pb-20 overflow-x-hidden">
      {/* Dynamic Builder Sections */}
      {parsedDynamicSections.length > 0 ? (
          <DynamicSectionsBuilder 
              sections={parsedDynamicSections} 
              products={allProducts} 
              categories={allCategories}
              brands={homeBrands}
              activeBanners={activeBanners as any}
          />
      ) : (
        <>
          {/* Hero - Full width experience */}
          <HeroSection banners={activeBanners as any} />

          {homeBrands.length > 0 && (
              <HomeBrands brands={homeBrands} />
          )}

          {homeTabsCategories.length > 0 && (
            <ScrollReveal delay={0.2}>
              <NewArrivalsTabs products={allProducts} categories={homeTabsCategories} />
            </ScrollReveal>
          )}

          {homeCuratedCategories.length > 0 && (
            <ScrollReveal delay={0.3}>
              <CategoryCuration categories={homeCuratedCategories} />
            </ScrollReveal>
          )}

          {selectionCategory && (
            <HomeContent selectionProducts={selectionProducts} selectionCategory={selectionCategory} />
          )}
        </>
      )}

      <WhatsAppButton settings={settings} />
    </div>
  );
}
