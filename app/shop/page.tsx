import { getAllProducts, getCategories } from "@/lib/actions/product";
import { ShopHeader } from "@/components/store/ShopHeader";
import { ProductsGrid } from "@/components/store/ProductsGrid";
import { ShopToolbar } from "@/components/store/ShopToolbar";
import { ShopSidebar } from "@/components/store/ShopSidebar";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
    title: "Shop | Premium Inventory",
    description: "Explore our collection of high-performance gear.",
};

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; sort?: string; filter?: string; minPrice?: string; maxPrice?: string }>;
}) {
    const params = await searchParams;

    const minPrice = params.minPrice ? parseInt(params.minPrice) : undefined;
    const maxPrice = params.maxPrice ? parseInt(params.maxPrice) : undefined;

    const products = await getAllProducts(params.category, params.sort, params.filter, minPrice, maxPrice);

    // Fallback categories if database is empty
    let categories = await getCategories();
    if (categories.length === 0) {
        categories = [
            { id: '1', name: 'Laptops', slug: 'laptops', image: null, createdAt: new Date().toISOString(), parentId: null },
            { id: '2', name: 'Audio', slug: 'audio', image: null, createdAt: new Date().toISOString(), parentId: null },
            { id: '3', name: 'Accessories', slug: 'accessories', image: null, createdAt: new Date().toISOString(), parentId: null },
            { id: '4', name: 'Gaming', slug: 'gaming', image: null, createdAt: new Date().toISOString(), parentId: null },
            { id: '5', name: 'Components', slug: 'components', image: null, createdAt: new Date().toISOString(), parentId: null },
        ];
    }

    const currentCategoryName = params.category
        ? categories.find(c => c.slug === params.category)?.name || "Category"
        : "Full Catalogue";

    return (
        <div className="bg-background min-h-screen pb-32 pt-24 relative overflow-hidden selection:bg-indigo-500/30">
            {/* Clean Background Architecture */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-background" />
            </div>

            <main className="relative z-10 container mx-auto px-6 lg:px-12">
                {/* Discovery Header */}
                <ShopHeader
                    categoryName={currentCategoryName}
                    productCount={products.length}
                />

                <div className="flex flex-col lg:flex-row gap-16 mt-16">
                    {/* Tactical Sidebar */}
                    <ShopSidebar categories={categories} />

                    {/* Catalog Feed */}
                    <div className="flex-1">
                        <ShopToolbar totalProducts={products.length} />

                        <ProductsGrid products={products} />

                        {/* Pagination Unit */}
                        <div className="mt-24 flex justify-center">
                            <button className="px-12 py-5 text-[9px] font-black text-foreground border border-border/40 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all rounded-full uppercase tracking-[0.4em] bg-card/40 backdrop-blur-xl">
                                Request Further Data
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
