import { HeroSection } from "@/components/store/HeroSection";
import { FeatureCards } from "@/components/store/FeatureCards";
import { CollectionCircles } from "@/components/store/CollectionCircles";
import { ReferenceSection } from "@/components/store/ReferenceSection";
import { WhatsAppButton } from "@/components/store/WhatsAppButton";
import { ProductCarousel } from "@/components/store/ProductCarousel";
import { getAllProducts } from "@/lib/actions/product";
import { getAdminBanners } from "@/lib/actions/admin";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Parallelize data fetching for performance
  const [allProducts, rawBanners] = await Promise.all([
    getAllProducts(),
    getAdminBanners()
  ]);

  const activeBanners = rawBanners.filter((b: any) => b.active).sort((a: any, b: any) => a.order - b.order);

  // Simple categorization for the homepage
  const newArrivals = allProducts.slice(0, 8);
  const highlightedPieces = allProducts.filter(p => p.categoryId === 'evening-wear' || p.categoryId === 'suits').slice(0, 8);

  return (
    <div className="bg-white min-h-screen pb-20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <HeroSection banners={activeBanners} />
      </div>

      <ProductCarousel title="NOUVEAUTÉS" products={newArrivals} />
      <ProductCarousel title="PIÈCES D'EXCEPTION" products={highlightedPieces} />

      <CollectionCircles />

      {/* EVENING WEAR Section */}
      <ReferenceSection
        title="COUTURE DU SOIR"
        description="L'élégance absolue pour vos soirées les plus prestigieuses. Des créations uniques qui subliment votre silhouette."
        image="https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000"
        products={allProducts.filter(p => p.categoryId === 'evening-wear')}
      />

      {/* SUITS Section */}
      <ReferenceSection
        title="L'ART DU COSTUME"
        description="Le raffinement au masculin. Découvrez nos costumes taillés avec précision dans les plus belles laines."
        image="https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=1000"
        products={allProducts.filter(p => p.categoryId === 'suits')}
        reverse
      />

      {/* TRADITIONAL Section */}
      <ReferenceSection
        title="HÉRITAGE & MODERNITÉ"
        description="Une collection qui célèbre nos traditions tout en embrassant le style contemporain."
        image="https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000"
        products={allProducts.filter(p => p.categoryId === 'traditional')}
      />

      {/* ACCESSORIES Section */}
      <ReferenceSection
        title="LES ESSENTIELS"
        description="La touche finale qui parachève votre style. Des accessoires pensés pour durer."
        image="https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000"
        products={allProducts.filter(p => p.categoryId === 'accessories')}
        reverse
      />

      <WhatsAppButton />
    </div>
  );
}
