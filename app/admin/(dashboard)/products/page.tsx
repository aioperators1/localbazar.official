import { prisma } from "@/lib/prisma";
import { Plus, Download, Upload, Search } from "lucide-react";
import Link from "next/link";
import { ProductList } from "@/components/admin/ProductList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductTabs } from "@/components/admin/ProductTabs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cn } from "@/lib/utils";

import { ProductSearchForm } from "@/components/admin/ProductSearchForm";
import { ExportProductsModal } from "@/components/admin/ExportProductsModal";
import { ImportProductsModal } from "@/components/admin/ImportProductsModal";

export const dynamic = 'force-dynamic';

interface SearchParams {
    q?: string;
    tab?: string;
    page?: string;
}

export default async function AdminProductsPage(props: { searchParams: Promise<SearchParams> }) {
    const searchParams = await props.searchParams;
    const { q, tab, page = "1" } = searchParams;
    const brandId = (searchParams as any).brandId as string | undefined;
    const currentPage = Math.max(1, parseInt(page));
    const pageSize = 20;

    const session = await getServerSession(authOptions);

    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";
    const canEdit = isSuperAdmin || session?.user?.permissions?.some((p) => p.id === 'products' && p.access === 'editor');

    const where: any = {};

    if (q) {
        where.OR = [
            { name: { contains: q, mode: 'insensitive' } },
            { category: { name: { contains: q, mode: 'insensitive' } } }
        ];
    }

    if (tab && tab !== "All") {
        if (tab === "Active") where.stock = { gt: 0 };
        if (tab === "Draft") where.stock = { lte: 0 };
    }

    if (brandId && brandId !== "all") {
        where.brandId = brandId;
    }

    // OPTIMIZED: Parallel fetching with pagination
    const [products, totalCount, activeCount, draftCount, brands] = await Promise.all([
        prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
            take: pageSize,
            skip: (currentPage - 1) * pageSize,
        }),
        prisma.product.count({ where }),
        prisma.product.count({ where: { ...where, stock: { gt: 0 } } }),
        prisma.product.count({ where: { ...where, stock: { lte: 0 } } }),
        prisma.brand.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } })
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);
    const activeTab = tab || "All";

    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Products</h1>
                    <p className="text-[13px] text-gray-500">Manage your boutique inventory and collections.</p>
                </div>
                <div className="flex items-center gap-3">
                    {canEdit && (
                        <>
                            <ExportProductsModal brands={brands} />
                            <ImportProductsModal brands={brands} />
                            <Button asChild className="h-10 bg-black text-white hover:bg-[#333] px-6 rounded-lg text-[12px] font-semibold uppercase tracking-wider shadow-sm">
                                <Link href="/admin/products/new">
                                    Add product
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: "Total Inventory", value: totalCount, sub: "Unique Products", border: "border-gray-200 bg-white text-black" },
                    { label: "Active Operational", value: activeCount, sub: "In Stock", border: "border-gray-200 bg-white text-black" },
                    { label: "Draft / Pending", value: draftCount, sub: "Out of Stock", border: "border-gray-200 bg-white text-black" },
                ].map((stat, i) => (
                    <div key={i} className={`p-6 rounded-xl border ${stat.border} shadow-sm transition-all duration-300`}>
                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-4">{stat.label}</p>
                        <div className="flex flex-col gap-1">
                            <span className="text-[28px] font-bold text-black leading-none">{stat.value}</span>
                            <span className="text-[11px] font-medium text-gray-500 mt-1">{stat.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Interface */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                {/* Minimalist Tabs */}
                <div className="px-6 pt-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
                    <ProductTabs activeTab={activeTab} q={q} />

                    <div className="hidden lg:flex items-center gap-2 mb-4">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Viewing</span>
                        <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">{activeTab} Repository</span>
                    </div>
                </div>

                {/* Filter Sub-bar */}
                <div className="p-6">
                    <ProductSearchForm defaultValue={q} activeTab={activeTab} brands={brands} defaultBrandId={brandId} />
                </div>

                <div className="px-6 pb-6">
                    <ProductList products={products.map(p => ({
                        id: p.id,
                        name: p.name,
                        images: p.images,
                        category: { name: p.category?.name || "Uncategorized" },
                        price: Number(p.price),
                        stock: p.stock,
                        position: (p as any).position ?? 0
                    }))} />
                </div>

                {/* Pagination UI */}
                {totalPages > 1 && (
                    <div className="px-6 py-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            Showing <span className="text-black">{(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount)}</span> of {totalCount} Products
                        </p>
                        <div className="flex items-center gap-2">
                           <Button 
                             variant="outline" 
                             asChild 
                             className={cn("h-9 text-[10px] uppercase font-black px-4", currentPage <= 1 && "opacity-30 pointer-events-none")}
                           >
                              <Link href={`?page=${currentPage - 1}${tab ? `&tab=${tab}` : ''}${q ? `&q=${q}` : ''}`}>Previous</Link>
                           </Button>
                           <div className="flex items-center gap-1 mx-2">
                              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                                  const pageNum = i + 1;
                                  return (
                                    <Link 
                                        key={pageNum}
                                        href={`?page=${pageNum}${tab ? `&tab=${tab}` : ''}${q ? `&q=${q}` : ''}`}
                                        className={cn(
                                            "w-9 h-9 flex items-center justify-center rounded-lg text-[11px] font-black transition-all",
                                            currentPage === pageNum ? "bg-black text-white" : "hover:bg-gray-100 text-gray-400"
                                        )}
                                    >
                                        {pageNum}
                                    </Link>
                                  )
                              })}
                           </div>
                           <Button 
                             variant="outline" 
                             asChild 
                             className={cn("h-9 text-[10px] uppercase font-black px-4", currentPage >= totalPages && "opacity-30 pointer-events-none")}
                           >
                               <Link href={`?page=${currentPage + 1}${tab ? `&tab=${tab}` : ''}${q ? `&q=${q}` : ''}`}>Next</Link>
                           </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
