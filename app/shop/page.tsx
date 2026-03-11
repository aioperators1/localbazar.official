import { getAllProducts, getCategories } from "@/lib/actions/product";
import { ShopHeader } from "@/components/store/ShopHeader";
import { ProductsGrid } from "@/components/store/ProductsGrid";
import { ShopToolbar } from "@/components/store/ShopToolbar";
import { ShopSidebar } from "@/components/store/ShopSidebar";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
    title: "Collections | Local Bazar",
    description: "Découvrez nos collections exclusives de haute couture et prêt-à-porter de luxe.",
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
        'evening-wear': "Notre collection Couture incarne l'élégance absolue. Des robes de soirée aux silhouettes sophistiquées, confectionnées dans les soies les plus fines pour vos moments d'exception.",
        'suits': "L'art du Tailleur Local Bazar. Des coupes impeccables et des matières nobles pour une allure structurée et moderne, que ce soit pour le business ou les grandes occasions.",
        'traditional': "Héritage célèbre le savoir-faire ancestral revisité. Des pièces uniques mêlant broderies artisanales et designs contemporains pour un style intemporel.",
        'accessories': "Les essentiels du luxe. Découvrez notre sélection de maroquinerie, étoles en cachemire et accessoires raffinés pour parfaire votre silhouette.",
        'new-arrivals': "Les dernières tendances de la saison. Explorez nos nouveautés et soyez les premiers à adopter les pièces maîtresses de nos nouvelles collections."
    };

    const categorySl = params.category?.toLowerCase() || '';
    const currentCategoryName = params.category
        ? categories.find(c => c.slug === params.category)?.name || "Toutes les Collections"
        : "Toutes les Collections";

    const descText = catDescriptions[categorySl] || "Découvrez l'univers Local Bazar : une sélection rigoureuse de pièces de luxe alliant tradition et modernité.";

    return (
        <div className="bg-white min-h-screen pb-32 pt-10">
            <main className="container mx-auto px-4 lg:px-20">
                {/* Breadcrumbs */}
                <div className="text-[12px] text-zinc-500 font-medium mb-6 flex items-center gap-2">
                    <Link href="/" className="hover:text-[#592C2F] transition-colors">Accueil</Link>
                    <span>/</span>
                    <span className="text-zinc-900 capitalize">{currentCategoryName === "Full Catalogue" ? "Boutique" : currentCategoryName}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Sidebar */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <ShopSidebar categories={categories} />
                    </div>

                    {/* Catalog Content Area */}
                    <div className="flex-1 min-w-0">
                        {/* Header Box */}
                        <div className="bg-white p-6 md:p-8 rounded-[4px] shadow-sm mb-6 border border-zinc-100">
                            <ShopHeader
                                categoryName={currentCategoryName}
                                productCount={products.length}
                            />
                            <p className="text-[#677279] text-[13px] leading-relaxed max-w-4xl mt-4">
                                {descText}
                            </p>
                        </div>

                        <ShopToolbar totalProducts={products.length} />

                        {products.length === 0 ? (
                            <div className="bg-white p-12 text-center rounded-[4px] shadow-sm border border-zinc-100 mt-6 flex flex-col items-center">
                                <span className="text-2xl font-bold text-zinc-900 mb-2">Aucun produit trouvé</span>
                                <p className="text-zinc-500 text-sm mb-6">Essayez de modifier vos filtres ou de chercher autre chose.</p>
                                <Link href="/shop" className="bg-[#592C2F] text-white px-6 py-2.5 rounded-[4px] text-xs font-bold uppercase hover:bg-black transition-colors">
                                    Réinitialiser les filtres
                                </Link>
                            </div>
                        ) : (
                            <ProductsGrid products={products} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
