"use client";

import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Image from "next/image";
import Link from "next/link";

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
        if (!confirm("Are you sure you want to delete this product?")) return;

        const res = await deleteProduct(id);
        if (res.success) {
            toast.success("Product deleted successfully");
            router.refresh();
        } else {
            toast.error("Failed to delete product");
        }
    };

    return (
        <div className="bg-zinc-950/50 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden shadow-2xl relative">
            {/* Tech Deco Lines */}
            <div className="absolute top-0 left-0 w-20 h-1 bg-indigo-500/50" />
            <div className="absolute bottom-0 right-0 w-20 h-1 bg-indigo-500/50" />

            <table className="w-full text-left text-sm">
                <thead className="bg-white/5 border-b border-white/10 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                        <th className="p-4 pl-6">Product</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right pr-6">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {products.map((product) => {
                        let imageUrl = "https://placehold.co/100x100";
                        try {
                            const parsed = JSON.parse(product.images);
                            imageUrl = Array.isArray(parsed) ? (parsed[0] || imageUrl) : (parsed || imageUrl);
                        } catch {
                            imageUrl = product.images || imageUrl;
                        }

                        return (
                            <tr key={product.id} className="group hover:bg-white/5 transition-all duration-300">
                                <td className="p-4 pl-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 rounded-lg bg-black/50 overflow-hidden border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                                            <Image
                                                src={imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                        <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">{product.name}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded border border-white/10 bg-white/5 text-[10px] font-mono text-zinc-400 uppercase">
                                        {product.category.name}
                                    </span>
                                </td>
                                <td className="p-4 text-white font-black tracking-tight">
                                    {new Intl.NumberFormat('en-MA', { style: 'currency', currency: 'MAD' }).format(Number(product.price))}
                                </td>
                                <td className="p-4 text-zinc-500 font-mono text-xs">{product.stock} Units</td>
                                <td className="p-4">
                                    {product.stock > 0 ? (
                                        <div className="inline-flex items-center gap-2">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            </span>
                                            <span className="text-emerald-500 text-xs font-bold uppercase tracking-wider text-shadow-glow">Active</span>
                                        </div>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider border border-red-500/20">
                                            Out of Stock
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 pr-6 flex gap-2 justify-end">
                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full">
                                        <Link href={`/admin/products/${product.id}`}>
                                            <Pencil className="w-3 h-3" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(product.id)}
                                        className="h-8 w-8 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-full"
                                    >
                                        <Trash className="w-3 h-3" />
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
