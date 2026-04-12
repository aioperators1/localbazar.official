import { getAllProducts, getCategories } from "@/lib/actions/product";
import { ShopContent } from "@/components/store/ShopContent";

export const metadata = {
    title: "Collections | Local Bazar Hub",
    description: "Discover our exclusive collections of high fashion, abayas, and luxury scents in Qatar.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; sort?: string; filter?: string; minPrice?: string; maxPrice?: string; search?: string; brand?: string; }>;
}) {
    const params = await searchParams;

    const minPrice = params.minPrice ? parseInt(params.minPrice) : undefined;
    const maxPrice = params.maxPrice ? parseInt(params.maxPrice) : undefined;

    // Parallelize fetches for better performance
    const [products, categories, brands] = await Promise.all([
        getAllProducts(params.category, params.search, params.filter, minPrice, maxPrice, params.sort, params.brand),
        getCategories(),
        import('@/lib/actions/admin').then(m => m.getAdminBrands())
    ]);

    let currentCategoryName = "Full Catalogue";
    if (params.category) {
        currentCategoryName = (categories as any[]).find(c => c.slug === params.category)?.name || "Full Catalogue";
    } else if (params.brand) {
        currentCategoryName = (brands as any[]).find(b => b.slug === params.brand)?.name || "Full Catalogue";
    }

    return (
        <ShopContent 
            products={products} 
            categories={categories}
            brands={brands as any} 
            params={params} 
            currentCategoryName={currentCategoryName}
        />
    );
}
