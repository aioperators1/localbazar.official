import { prisma } from "@/lib/prisma";
import { Plus, Download, Upload, Search } from "lucide-react";
import Link from "next/link";
import { ProductList } from "@/components/admin/ProductList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductTabs } from "@/components/admin/ProductTabs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

interface SearchParams {
    q?: string;
    tab?: string;
}

export default async function AdminProductsPage(props: { searchParams: Promise<SearchParams> }) {
    const searchParams = await props.searchParams;
    const { q, tab } = searchParams;
    const session = await getServerSession(authOptions);

    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";
    const canEdit = isSuperAdmin || session?.user?.permissions?.some((p) => p.id === 'products' && p.access === 'editor');

    const where: any = {};
    
    if (q) {
        where.OR = [
            { name: { contains: q } },
            { category: { name: { contains: q } } }
        ];
    }

    if (tab && tab !== "All") {
        if (tab === "Active") where.stock = { gt: 0 };
        if (tab === "Draft") where.stock = { lte: 0 };
    }

    const products = await prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' }
    });

    const allStats = await prisma.product.findMany({
        select: {
            stock: true,
            price: true,
        }
    });

    const totalProducts = allStats.length;
    const activeProducts = allStats.filter(p => p.stock > 0).length;
    const draftProducts = allStats.filter(p => p.stock <= 0).length;

    const activeTab = tab || "All";

    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Products</h1>
                    <p className="text-[13px] text-white/40 font-medium uppercase tracking-[0.2em]">Manage your boutique inventory and collections.</p>
                </div>
                <div className="flex items-center gap-3">
                    {canEdit && (
                        <>
                            <Button variant="outline" className="h-10 text-[11px] border-white/10 bg-white/5 text-white hover:bg-white hover:text-black font-black uppercase tracking-widest px-5 rounded-full transition-all shadow-sm">
                                <Download className="w-3.5 h-3.5 mr-2.5 opacity-40" /> Export
                            </Button>
                            <Button variant="outline" className="h-10 text-[11px] border-white/10 bg-white/5 text-white hover:bg-white hover:text-black font-black uppercase tracking-widest px-5 rounded-full transition-all shadow-sm">
                                <Upload className="w-3.5 h-3.5 mr-2.5 opacity-40" /> Import
                            </Button>
                            <Button asChild className="h-10 bg-black text-white hover:bg-[#333] px-6 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-black/10 active:scale-95">
                                <Link href="/admin/products/new">
                                   Add product
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Ultra Pro Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: "Total Inventory", value: totalProducts, sub: "Unique Products", border: "border-indigo-500/10" },
                    { label: "Active Operational", value: activeProducts, sub: "In Stock", border: "border-emerald-500/10" },
                    { label: "Draft / Pending", value: draftProducts, sub: "Out of Stock", border: "border-amber-500/10" },
                ].map((stat, i) => (
                    <div key={i} className={`glass-card p-8 rounded-3xl border ${stat.border} shadow-sm group hover:border-white/20 transition-all duration-500`}>
                        <p className="pro-label mb-4 group-hover:text-white transition-colors">{stat.label}</p>
                        <div className="flex flex-col gap-1">
                            <span className="text-[28px] font-black text-white tracking-tighter leading-none">{stat.value}</span>
                            <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest mt-1">{stat.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Premium Repository Interface */}
            <div className="glass-table rounded-[40px] border-white/5 shadow-2xl overflow-hidden flex flex-col">
                {/* Minimalist Tabs */}
                <div className="px-8 pt-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <ProductTabs activeTab={activeTab} q={q} />

                    <div className="hidden lg:flex items-center gap-2 mb-6">
                        <span className="pro-label text-white/10">Viewing</span>
                        <span className="pro-label text-white/60">{activeTab} Repository</span>
                    </div>
                </div>

                {/* Refined Filter Sub-bar */}
                <div className="p-6 lg:p-10 bg-white/[0.01]">
                    <form className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative flex-1 group w-full">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                            <Input 
                                name="q"
                                defaultValue={q}
                                placeholder="Search products, categories, or IDs..." 
                                className="pl-14 h-14 text-[13px] bg-white/[0.03] border-white/10 rounded-2xl focus:bg-white/10 focus:ring-4 focus:ring-white/5 transition-all placeholder:text-white/20 text-white font-medium tracking-tight shadow-inner" 
                            />
                            <input type="hidden" name="tab" value={activeTab} />
                        </div>
                        <Button type="submit" className="h-14 px-10 bg-white text-black hover:bg-white/80 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all w-full sm:w-auto active:scale-95 shadow-lg shadow-white/5">
                            Search
                        </Button>
                    </form>
                </div>

                <div className="px-6 lg:px-10 pb-10">
                    <ProductList products={products.map(p => ({
                        id: p.id,
                        name: p.name,
                        images: p.images,
                        category: { name: p.category?.name || "Uncategorized" },
                        price: Number(p.price),
                        stock: p.stock
                    }))} />
                </div>
            </div>
        </div>
    );
}
