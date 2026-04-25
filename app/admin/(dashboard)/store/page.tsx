import { StoreBuilder } from "@/components/admin/StoreBuilder";
import { prisma } from "@/lib/prisma";
import { getAdminSettings, getAdminCategories, getAdminBrands, getAdminBanners } from "@/lib/actions/admin";

export const dynamic = 'force-dynamic';

export default async function AdminStorePage() {
  const [settings, dbProducts, dbCategories, dbBrands, dbBanners] = await Promise.all([
    getAdminSettings(),
    prisma.product.findMany({
      select: { id: true, name: true, images: true },
      orderBy: { createdAt: 'desc' }
    }).catch((err: any) => {
      console.error("Store Page Product Fetch Error:", err);
      return [];
    }),
    getAdminCategories(),
    getAdminBrands(),
    getAdminBanners()
  ]);

  const rawSections = settings.home_sections;
  let initialSections = [];
  if (rawSections) {
    try {
      initialSections = JSON.parse(rawSections);
    } catch(e: any) {}
  }

  // Pre-populate with default if empty
  if (initialSections.length === 0) {
    initialSections = [
      {
        id: "default-hero",
        type: "system_hero",
        title: "System Main Slider",
        product_ids: [],
        category_ids: [],
        brand_ids: [],
        images: [],
        is_visible: true,
        position: 0
      },
      {
        id: "default-brands",
        type: "system_brands",
        title: "System Brands",
        product_ids: [],
        category_ids: [],
        brand_ids: [],
        images: [],
        is_visible: true,
        position: 1
      },
      {
        id: "default-new-arrivals",
        type: "system_new_arrivals",
        title: "System New Arrivals",
        product_ids: [],
        category_ids: [],
        brand_ids: [],
        images: [],
        is_visible: true,
        position: 2
      },
      {
        id: "default-curation",
        type: "system_curation",
        title: "System Categories Curation",
        product_ids: [],
        category_ids: [],
        brand_ids: [],
        images: [],
        is_visible: true,
        position: 3
      },
      {
        id: "default-featured-content",
        type: "system_featured_category",
        title: "System Featured Category Content",
        product_ids: [],
        category_ids: [],
        brand_ids: [],
        images: [],
        is_visible: true,
        position: 4
      }
    ];
  }

  const products = dbProducts.map((p: any) => {
    let image = "";
    try {
      const parsed = JSON.parse(p.images);
      image = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : (typeof parsed === 'string' ? parsed : "");
    } catch(e: any) {
      image = p.images || ""; // Fallback
    }
    return {
      id: p.id,
      name: p.name,
      image
    };
  });

  const categories = dbCategories.map((c: any) => ({
    id: c.id,
    name: c.name,
    image: (c as any).image || null
  }));

  const brands = dbBrands.map((b: any) => ({
    id: b.id,
    name: b.name,
    logo: (b as any).logo || null
  }));

  const bannersList = dbBanners.map((b: any) => ({
    id: b.id,
    title: b.title || "Untitled",
    image: b.image || "",
    active: b.active ?? true
  }));

  return (
    <div className="pb-20">
      <StoreBuilder initialSections={initialSections} products={products} categories={categories} brands={brands} banners={bannersList} />
    </div>
  );
}
