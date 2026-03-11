import { prisma } from "@/lib/prisma";
import { Plus, Download, Upload, Search, Filter, SortAsc } from "lucide-react";
import Link from "next/link";
import { ProductList } from "@/components/admin/ProductList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-bold text-[#303030]">Products</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-8 text-[12px] border-[#D2D2D2] bg-white text-[#303030] hover:bg-[#F9F9F9] font-bold px-3 shadow-none">
                        <Download className="w-3.5 h-3.5 mr-2 text-[#616161]" /> Export
                    </Button>
                    <Button variant="outline" className="h-8 text-[12px] border-[#D2D2D2] bg-white text-[#303030] hover:bg-[#F9F9F9] font-bold px-3 shadow-none">
                        <Upload className="w-3.5 h-3.5 mr-2 text-[#616161]" /> Import
                    </Button>
                    <Button asChild className="h-8 bg-black text-white hover:bg-[#303030] px-4 rounded-[8px] text-[12px] font-bold transition-all shadow-none">
                        <Link href="/admin/products/new">
                           Add product
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-[12px] border border-[#E3E3E3] shadow-sm overflow-hidden flex flex-col">
                {/* Shopify-style Tabs / Filter Bar */}
                <div className="px-1 pt-1 border-b border-[#F1F1F1]">
                  <div className="flex items-center">
                    {["All", "Active", "Draft", "Archived"].map((tab, idx) => (
                      <button 
                        key={tab} 
                        className={`px-4 py-2 text-[13px] font-medium transition-all relative ${idx === 0 ? "text-[#303030] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#008060] after:rounded-full" : "text-[#616161] hover:bg-[#F9F9F9]"}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search & Filter Sub-bar */}
                <div className="p-3 flex items-center gap-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#616161]" />
                    <Input 
                      placeholder="Filter products" 
                      className="pl-8 h-8 text-[12px] bg-white border-[#D2D2D2] rounded-[8px] focus:ring-1 focus:ring-black" 
                    />
                  </div>
                  <Button variant="outline" className="h-8 w-8 p-0 border-[#D2D2D2] bg-white shadow-none">
                     <Filter className="w-3.5 h-3.5 text-[#616161]" />
                  </Button>
                  <Button variant="outline" className="h-8 w-8 p-0 border-[#D2D2D2] bg-white shadow-none">
                     <SortAsc className="w-3.5 h-3.5 text-[#616161]" />
                  </Button>
                </div>

                <ProductList products={products.map(p => ({
                    id: p.id,
                    name: p.name,
                    images: p.images,
                    category: { name: p.category.name },
                    price: Number(p.price),
                    stock: p.stock
                }))} />
            </div>
        </div>
    );
}
