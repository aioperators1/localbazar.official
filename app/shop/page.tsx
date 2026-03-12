import { getAllProducts, getCategories } from "@/lib/actions/product";
import { ShopHeader } from "@/components/store/ShopHeader";
import { ProductsGrid } from "@/components/store/ProductsGrid";
import { ShopToolbar } from "@/components/store/ShopToolbar";
import { ShopSidebar } from "@/components/store/ShopSidebar";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
    title: "Collections | Local Bazar Hub",
    description: "Discover our exclusive collections of high fashion, abayas, and luxury scents in Qatar.",
};

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; sort?: string; filter?: string; minPrice?: string; maxPrice?: string; search?: string; }>;
}) {
    const params = await searchParams;

    const minPrice = params.minPrice ? parseInt(params.minPrice) : undefined;
    const maxPrice = params.maxPrice ? parseInt(params.maxPrice) : undefined;

    // Parallelize fetches for better performance
    const [products, initialCategories] = await Promise.all([
        getAllProducts(params.category, params.search, params.filter, minPrice, maxPrice, params.sort),
        getCategories()
    ]);

    let categories = initialCategories;

    const catDescriptions: Record<string, string> = {
        'abayas': "Experience the ultimate elegance with our signature Abaya collection. Crafted for the modern woman who values tradition and luxury.",
        'dresses-jalabiyas': "Elegant dresses and Jalabiyas for your most unforgettable moments. Where fashion meets heritage in perfect harmony.",
        'perfumes-oud': "A sensory journey through the scents of Arabia. Discover our premium selection of Oud, Perfumes, and Bukhoor.",
        'men': "Premium menswear crafted with precision. From classic designs to modern essentials, experience luxury in every stitch.",
        'jewelry': "Exquisite jewelry pieces that illuminate your grace. Discover our collection of precious gemstones and timeless designs.",
        'accessories': "The perfect finishing touches. Explore our curated selection of luxury accessories to complement your unique style.",
        'kids': "Luxury collections for the little ones. Timeless elegance and comfort for your children's special moments."
    };

    const categorySl = params.category?.toLowerCase() || '';
    const currentCategoryName = params.category
        ? categories.find(c => c.slug === params.category)?.name || "All Collections"
        : "All Collections";

    const descText = catDescriptions[categorySl] || "Welcome to the world of Local Bazar Hub: a curated selection of luxury pieces merging tradition with modern aesthetics.";

    return (
        <div className="bg-white min-h-screen pb-32 pt-12">
            <main className="container mx-auto px-4 lg:px-12 xl:px-24">
                {/* Breadcrumbs - Minimalist */}
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#919191] mb-12">
                    <Link href="/" className="hover:text-black transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-black">{currentCategoryName === "Full Catalogue" ? "Shop" : currentCategoryName}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    {/* Sidebar - Precision Width */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <ShopSidebar categories={categories} />
                    </div>

                    {/* Catalog Content Area */}
                    <div className="flex-1 min-w-0">
                        {/* High-End Editorial Header */}
                        <div className="mb-16">
                            <h1 className="font-serif text-[42px] sm:text-[56px] text-[#111111] leading-tight tracking-tight mb-6 uppercase">
                                {currentCategoryName}
                            </h1>
                            <p className="text-[#616161] text-[15px] leading-relaxed max-w-3xl font-medium">
                                {descText}
                            </p>
                        </div>

                        {/* Professional Toolbar */}
                        <div className="border-t border-[#F1F1F1] pt-8">
                           <ShopToolbar totalProducts={products.length} />
                        </div>

                        {products.length === 0 ? (
                            <div className="max-w-md mx-auto py-32 text-center">
                                <h2 className="font-serif text-2xl text-black mb-4">No results found</h2>
                                <p className="text-[#616161] text-sm mb-8">We couldn't find any pieces matching your current criteria.</p>
                                <Link href="/shop" className="inline-block bg-black text-white px-10 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-[#333] transition-colors rounded-sm">
                                    Explore the Boutique
                                </Link>
                            </div>
                        ) : (
                            <div className="mt-8">
                                <ProductsGrid products={products as any} />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
