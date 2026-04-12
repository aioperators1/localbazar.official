"use client";

import { Pencil, Trash, MoreHorizontal, AlertCircle, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct, deleteProducts, duplicateProduct } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface AdminProduct {
    id: string;
    name: string;
    images: string; // JSON string of images
    category: { name: string };
    price: number;
    stock: number;
}

import { usePermissions } from "@/hooks/use-permissions";
import { motion, AnimatePresence } from "framer-motion";

export function ProductList({ products }: { products: AdminProduct[] }) {
    const { canEdit } = usePermissions();
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | string[] | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleDuplicate = async (id: string) => {
        if (!canEdit('products')) return toast.error("ACCESS DENIED: EDITOR PERMISSION REQUIRED");
        try {
            setIsDuplicating(id);
            toast.loading("CLONING ENTITY...", { id: "duplicate-product" });
            const res = await duplicateProduct(id);
            if (res.success) {
                toast.success("ENTITY CLONED SUCCESSFULLY", { id: "duplicate-product" });
                router.refresh();
            } else {
                toast.error(`Error: ${res.error || "Cloning failed"}`, { id: "duplicate-product" });
            }
        } catch (error) {
            console.error("Duplication error:", error);
            toast.error("Process interrupted", { id: "duplicate-product" });
        } finally {
            setIsDuplicating(null);
        }
    };

    const handleDelete = async () => {
        if (!productToDelete) return;
        
        try {
            setIsDeleting(true);
            const isBulk = Array.isArray(productToDelete);
            toast.loading(isBulk ? "TERMINATING SELECTION..." : "TERMINATING ENTITY...", { id: "delete-product" });
            
            const res = isBulk 
                ? await deleteProducts(productToDelete)
                : await deleteProduct(productToDelete as string);
            
            if (res.success) {
                toast.success(isBulk ? `${productToDelete.length} ENTITIES REMOVED` : "ENTITY REMOVED", { id: "delete-product" });
                setIsDeleteDialogOpen(false);
                setProductToDelete(null);
                if (isBulk) setSelectedIds([]);
                router.refresh();
            } else {
                toast.error(`Error: ${res.error || "Execution failed"}`, { id: "delete-product" });
            }
        } catch (error) {
            console.error("Deletion error:", error);
            toast.error("Process interrupted", { id: "delete-product" });
        } finally {
            setIsDeleting(false);
        }
    };

    const confirmDelete = (id: string) => {
        setProductToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const confirmBulkDelete = () => {
        if (selectedIds.length === 0) return;
        setProductToDelete(selectedIds);
        setIsDeleteDialogOpen(true);
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === products.length && products.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(products.map(p => p.id));
        }
    };

    return (
        <div className="relative">
            {/* Table Container with Glassmorphism */}
            <div className="overflow-hidden w-full glass-table rounded-[32px] border-white/5 shadow-2xl overflow-x-auto">
                <table className="w-full text-left text-[12px] border-collapse min-w-[800px]">
                    <thead className="bg-white/[0.02] border-b border-white/5">
                        <tr>
                            <th className="py-8 px-4 pl-8 w-[60px]">
                                {canEdit('products') && (
                                    <div className="flex items-center justify-center">
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 rounded-lg border-white/10 bg-white/5 cursor-pointer accent-white transition-all"
                                            checked={products.length > 0 && selectedIds.length === products.length}
                                            onChange={toggleSelectAll}
                                        />
                                    </div>
                                )}
                            </th>
                            <th className="py-8 px-4 pro-label">Product Identity</th>
                            <th className="py-8 px-4 pro-label text-center">Status</th>
                            <th className="py-8 px-4 pro-label text-center">Inventory</th>
                            <th className="py-8 px-4 pro-label">Classification</th>
                            <th className="py-8 px-4 pro-label">Market Value</th>
                            <th className="py-8 px-4 text-right pr-8 pro-label">
                                <div className="flex items-center justify-end gap-4 h-6">
                                    <AnimatePresence mode="wait">
                                        {canEdit('products') && selectedIds.length > 0 ? (
                                            <motion.button 
                                                key="bulk-delete"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                onClick={confirmBulkDelete}
                                                className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2 shadow-xl shadow-rose-900/20"
                                            >
                                                <Trash className="w-3.5 h-3.5" />
                                                PURGE ({selectedIds.length})
                                            </motion.button>
                                        ) : (
                                            <motion.span 
                                                key="label"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="opacity-100"
                                            >
                                                Operations
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {products.map((product, idx) => {
                            const getFirstImage = (images: string) => {
                                try {
                                    if (!images) return "https://placehold.co/400x400?text=Product";
                                    const parsed = JSON.parse(images);
                                    if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
                                    if (typeof parsed === 'string' && parsed.trim() !== '') return parsed;
                                    return images; // Fallback to raw string
                                } catch {
                                    return images || "https://placehold.co/400x400?text=Product";
                                }
                            };

                            const imageUrl = getFirstImage(product.images);
                            const isDraft = product.stock <= 0;

                            return (
                                <motion.tr 
                                    key={product.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={cn(
                                        "group transition-all duration-300",
                                        selectedIds.includes(product.id) ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"
                                    )}
                                >
                                    <td className="py-6 px-4 pl-8">
                                        {canEdit('products') && (
                                            <div className="flex items-center justify-center">
                                                <input 
                                                    type="checkbox" 
                                                    className="w-5 h-5 rounded-lg border-white/10 bg-white/5 cursor-pointer accent-white transition-all"
                                                    checked={selectedIds.includes(product.id)}
                                                    onChange={() => toggleSelect(product.id)}
                                                />
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-6 px-4">
                                        <div className="flex items-center gap-5">
                                            <div className="relative w-16 h-16 rounded-[20px] bg-white/[0.03] border border-white/10 overflow-hidden shrink-0 shadow-sm group-hover:scale-105 group-hover:rotate-2 transition-all duration-500">
                                                <ProductImage
                                                    src={imageUrl}
                                                    alt={product.name}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-black text-white text-[14px] uppercase tracking-tight line-clamp-1 group-hover:text-blue-400 transition-colors uppercase italic">{product.name}</span>
                                                <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.1em]">ID_{product.id.slice(-8).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4 text-center">
                                        <span className={cn(
                                            "inline-flex items-center px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm",
                                            isDraft 
                                                ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" 
                                                : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full mr-2 animate-pulse", isDraft ? "bg-rose-500" : "bg-emerald-500")} />
                                            {isDraft ? "Suspended" : "Operational"}
                                        </span>
                                    </td>
                                    <td className="py-6 px-4 text-center">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <span className={cn(
                                                "text-[14px] font-black tracking-tighter",
                                                product.stock < 5 ? "text-rose-500" : "text-white"
                                            )}>
                                                {product.stock} <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest ml-1">Units</span>
                                            </span>
                                            <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden flex shadow-inner">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className={cn("h-full rounded-full", product.stock < 5 ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" : "bg-white shadow-[0_0_8px_rgba(255,255,255,0.2)]")}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4">
                                        <span className="text-white font-black uppercase tracking-tight text-[11px] bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                                            {product.category.name}
                                        </span>
                                    </td>
                                    <td className="py-6 px-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-black tracking-tighter text-[16px] italic whitespace-nowrap">
                                                {formatPrice(product.price)}
                                            </span>
                                            <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Pricing Model</span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4 pr-8 text-right">
                                        {canEdit('products') && (
                                            <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                                <Button variant="ghost" size="icon" asChild className="h-11 w-11 text-white hover:bg-white hover:text-black hover:shadow-xl rounded-[14px] transition-all active:scale-90 border border-transparent hover:border-white/20">
                                                    <Link href={`/admin/products/${product.id}`}>
                                                        <Pencil className="w-[18px] h-[18px]" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={isDuplicating === product.id}
                                                    onClick={() => handleDuplicate(product.id)}
                                                    className="h-11 w-11 text-blue-400 hover:text-white hover:bg-blue-600 rounded-[14px] transition-all active:scale-90 border border-transparent hover:border-blue-600 shadow-blue-900/20"
                                                >
                                                    {isDuplicating === product.id ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <Copy className="w-[18px] h-[18px]" />}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => confirmDelete(product.id)}
                                                    className="h-11 w-11 text-rose-500 hover:text-white hover:bg-rose-600 rounded-[14px] transition-all active:scale-90 border border-transparent hover:border-rose-600 shadow-rose-900/20"
                                                >
                                                    <Trash className="w-[18px] h-[18px]" />
                                                </Button>
                                            </div>
                                        )}
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-32 text-center bg-white/[0.02]"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-8 h-8 text-white/20" />
                        </div>
                        <p className="text-white font-black uppercase tracking-[0.2em] text-[13px]">Repository Empty</p>
                        <p className="text-white/40 text-[11px] mt-2 font-bold uppercase tracking-widest">Initialize catalog by adding new entities.</p>
                    </motion.div>
                )}
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="max-w-[440px] rounded-[32px] border border-white/10 p-10 shadow-3xl bg-[#050505]/95 backdrop-blur-2xl">
                    <DialogHeader className="items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mb-2">
                             <Trash className="w-10 h-10" />
                        </div>
                        <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter italic">
                            {Array.isArray(productToDelete) ? `Purge ${productToDelete.length} Entities?` : "Confirm Termination?"}
                        </DialogTitle>
                        <DialogDescription className="text-[14px] text-white/40 font-medium leading-relaxed">
                            {Array.isArray(productToDelete) 
                                ? "This operation will permanently erase the selected product identities from the central repository. This process is irreversible."
                                : "This operation will permanently erase the product identity from the central repository. This process is irreversible."
                            }
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-10 flex-col sm:flex-row gap-4">
                        <Button 
                            variant="ghost" 
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isDeleting}
                            className="flex-1 h-14 bg-white/5 text-white text-[12px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
                        >
                            Abort
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1 h-14 bg-rose-600 hover:bg-rose-700 text-white text-[12px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-900/20 transition-all"
                        >
                            {isDeleting ? "Processing..." : "Confirm Purge"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function ProductImage({ src, alt }: { src: string, alt: string }) {
    const [imgSrc, setImgSrc] = useState(src);
    const fallback = "https://placehold.co/400x400?text=Luxury+Product";

    return (
        <Image
            src={imgSrc || fallback}
            alt={alt}
            fill
            className="object-contain p-2 group-hover:scale-110 transition-transform duration-700"
            unoptimized
            onError={() => setImgSrc(fallback)}
        />
    );
}
