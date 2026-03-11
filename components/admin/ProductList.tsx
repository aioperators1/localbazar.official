"use client";

import { Pencil, Trash, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";

interface AdminProduct {
    id: string;
    name: string;
    images: string;
    category: { name: string };
    price: number | string;
    stock: number;
}

export function ProductList({ products }: { products: AdminProduct[] }) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this product from the catalog?")) return;

        const res = await deleteProduct(id);
        if (res.success) {
            toast.success("Product removed");
            router.refresh();
        } else {
            toast.error("Failed to remove product");
        }
    };

    return (
        <div className="overflow-x-auto w-full bg-white rounded-xl border border-[#E3E3E3] shadow-sm overflow-hidden">
            <table className="w-full text-left text-[12px] border-collapse">
                <thead className="bg-[#F9F9F9] border-b border-[#E3E3E3] sticky top-0 z-10">
                    <tr>
                        <th className="p-4 pl-6 font-black text-[#616161] uppercase tracking-widest w-[40px]">
                            <input type="checkbox" className="rounded-[4px] border-[#D2D2D2]" />
                        </th>
                        <th className="p-4 font-black text-[#616161] uppercase tracking-widest">Product Entity</th>
                        <th className="p-4 font-black text-[#616161] uppercase tracking-widest text-center">Status</th>
                        <th className="p-4 font-black text-[#616161] uppercase tracking-widest text-center">Availability</th>
                        <th className="p-4 font-black text-[#616161] uppercase tracking-widest">Class</th>
                        <th className="p-4 font-black text-[#616161] uppercase tracking-widest">Value</th>
                        <th className="p-4 text-right pr-6 font-black text-[#616161] uppercase tracking-widest">Operations</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E3E3]">
                    {products.map((product) => {
                        let imageUrl = "https://placehold.co/100x100";
                        try {
                            if (product.images) {
                                const parsed = JSON.parse(product.images);
                                const first = Array.isArray(parsed) ? parsed[0] : parsed;
                                if (first && typeof first === 'string' && first.trim() !== '') {
                                    imageUrl = first;
                                } else if (typeof product.images === 'string' && product.images.trim() !== '') {
                                    imageUrl = product.images;
                                }
                            }
                        } catch {
                            if (product.images && typeof product.images === 'string' && product.images.trim() !== '') {
                                imageUrl = product.images;
                            }
                        }

                        if (!imageUrl || (!imageUrl.startsWith('/') && !imageUrl.startsWith('http'))) {
                            imageUrl = "https://placehold.co/100x100";
                        }

                        const isDraft = product.stock <= 0;

                        return (
                            <tr key={product.id} className="group hover:bg-[#F9F9F9] transition-all duration-200">
                                <td className="p-4 pl-6">
                                    <input type="checkbox" className="rounded-[4px] border-[#D2D2D2]" />
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 rounded-lg bg-white border border-[#E3E3E3] overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                                            <Image
                                                src={imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-contain p-1.5"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-black text-[#303030] text-[13px] uppercase tracking-tight line-clamp-1">{product.name}</span>
                                            <span className="text-[10px] text-[#616161] font-bold uppercase tracking-widest opacity-60">ID: {product.id.slice(-8)}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={cn(
                                        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                        isDraft 
                                            ? "bg-rose-50 text-rose-600 border border-rose-100" 
                                            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                    )}>
                                        {isDraft ? "Draft" : "Active"}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex flex-col items-center">
                                        <span className={cn(
                                            "text-[13px] font-black",
                                            product.stock < 5 ? "text-rose-600" : "text-[#303030]"
                                        )}>
                                            {product.stock}
                                        </span>
                                        <div className="w-12 h-1.5 bg-[#F1F1F1] rounded-full mt-1 overflow-hidden">
                                            <div 
                                                className={cn("h-full rounded-full transition-all", product.stock < 5 ? "bg-rose-500" : "bg-[#303030]")}
                                                style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="text-[#616161] font-bold uppercase tracking-tight">{product.category.name}</span>
                                </td>
                                <td className="p-4">
                                    <span className="text-[#303030] font-black italic tracking-tighter text-[14px]">
                                        {formatPrice(product.price)}
                                    </span>
                                </td>
                                <td className="p-4 pr-6 text-right">
                                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" asChild className="h-9 w-9 text-[#303030] hover:bg-white hover:shadow-md rounded-lg transition-all">
                                            <Link href={`/admin/products/${product.id}`}>
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(product.id)}
                                            className="h-9 w-9 text-[#616161] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {products.length === 0 && (
                <div className="py-20 text-center text-[#616161] font-medium bg-white">
                    No products found. Start by adding a new one.
                </div>
            )}
        </div>
    );
}
