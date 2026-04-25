"use client";

import { Pencil, Trash, Copy, MoreHorizontal, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProducts, duplicateProduct, updateProduct, updateProductBulkPositions } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface AdminProduct {
    id: string;
    name: string;
    images: string;
    category: { name: string };
    price: number;
    stock: number;
    position: number;
}

// Extract Sortable Row Component
function SortableProductRow({ product, selectedIds, toggleSelect, handleDuplicate, setProductToDelete, setIsDeleteDialogOpen, router }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: product.id });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: isDragging ? 'relative' as const : undefined,
        zIndex: isDragging ? 10 : 1,
        backgroundColor: isDragging ? 'white' : undefined,
    };

    let images: any = [];
    try {
        images = JSON.parse(product.images || "[]");
    } catch {
        // Handle plain URL strings or comma-separated URLs
        images = (product.images || "").split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    const imageUrl = Array.isArray(images) ? images[0] : (typeof images === 'string' ? images : "");
    const isOutOfStock = product.stock <= 0;

    return (
        <tr ref={setNodeRef} style={style} className="hover:bg-gray-50/50 transition-colors group">
            <td className="p-4 w-10">
                <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={selectedIds.includes(product.id)}
                    onChange={() => toggleSelect(product.id)}
                />
            </td>
            <td className="p-4 w-10 cursor-grab active:cursor-grabbing text-gray-300 hover:text-black transition-colors" {...attributes} {...listeners}>
                <GripVertical className="w-5 h-5" />
            </td>
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded border border-gray-100 bg-gray-50 relative overflow-hidden flex-shrink-0">
                        <Image 
                            src={imageUrl || "https://placehold.co/400x400?text=Product"} 
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-black">{product.name}</span>
                        <span className="text-[10px] text-gray-400">ID: {product.id.slice(-8).toUpperCase()}</span>
                    </div>
                </div>
            </td>
            <td className="p-4">
                <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    isOutOfStock ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                )}>
                    {isOutOfStock ? "Out of Stock" : "Active"}
                </span>
            </td>
            <td className="p-4">
                <span className={cn(
                    "text-xs font-bold",
                    product.stock < 5 ? "text-red-600" : "text-gray-600"
                )}>
                    {product.stock} Units
                </span>
            </td>
            <td className="p-4">
                <span className="text-[11px] font-bold text-gray-400 uppercase">{product.category.name}</span>
            </td>
            <td className="p-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        defaultValue={product.position}
                        key={product.position}
                        className="w-12 h-8 border border-gray-200 rounded px-2 text-xs font-bold focus:ring-1 focus:ring-black outline-none text-center"
                        onBlur={async (e) => {
                            const newPos = parseInt(e.target.value);
                            if (newPos === product.position) return;
                            
                            const res = await updateProduct(product.id, { position: newPos });
                            if (res.success) {
                                toast.success("Position updated");
                                router.refresh();
                            } else {
                                toast.error("Failed to update position");
                            }
                        }}
                    />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Rank</span>
                </div>
            </td>
            <td className="p-4 whitespace-nowrap">
                <span className="text-sm font-bold text-black">{formatPrice(product.price)}</span>
            </td>
            <td className="p-4 text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 focus:outline-none">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 z-[9999] bg-white border border-gray-200 shadow-xl p-1">
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${product.id}`} className="flex items-center gap-2 cursor-pointer font-bold text-xs">
                                <Pencil className="w-3.5 h-3.5" /> Edit Product
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => handleDuplicate(product.id)}
                            className="flex items-center gap-2 cursor-pointer font-bold text-xs"
                        >
                            <Copy className="w-3.5 h-3.5" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="flex items-center gap-2 cursor-pointer font-bold text-xs text-red-600 focus:text-red-600"
                            onClick={() => {
                                setProductToDelete(product.id);
                                setIsDeleteDialogOpen(true);
                            }}
                        >
                            <Trash className="w-3.5 h-3.5" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </tr>
    );
}


export function ProductList({ products }: { products: AdminProduct[] }) {
    const router = useRouter();
    const [items, setItems] = useState<AdminProduct[]>(products);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | string[] | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Sync local state when external data changes
    useEffect(() => {
        setItems(products);
    }, [products]);

    // DndKit Setup
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item: AdminProduct) => item.id === active.id);
            const newIndex = items.findIndex((item: AdminProduct) => item.id === over.id);
            
            // Optimistic fast UI update
            const newOrder = arrayMove(items, oldIndex, newIndex);
            setItems(newOrder);

            // Calculate precise positions based on current bounds safely.
            const minPos = Math.min(...newOrder.map((i: AdminProduct) => i.position));
            const updates = newOrder.map((item: AdminProduct, i: number) => ({
                id: item.id,
                position: minPos + i // Maintain local sequence globally
            }));

            // Sync with backend invisibly without blocking UI
            const res = await updateProductBulkPositions(updates);
            if (res.success) {
                toast.success("Order officially synchronized", { id: "reorder" });
            } else {
                toast.error("Failed to sync order", { id: "reorder" });
                setItems(products); // Revert on failure
            }
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds((prev: string[]) => 
            prev.includes(id) ? prev.filter((i: string) => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === items.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map((p: AdminProduct) => p.id));
        }
    };

    const handleDuplicate = async (id: string) => {
        toast.loading("Cloning product...");
        const res = await duplicateProduct(id);
        if (res.success) {
            toast.success("Product cloned", { id: "cloning" });
            router.refresh();
        } else {
            toast.error("Failed to clone");
        }
    };

    const handleDelete = async () => {
        if (!productToDelete) return;
        setIsDeleting(true);
        const ids = Array.isArray(productToDelete) ? productToDelete : [productToDelete];
        const res = await deleteProducts(ids);
        if (res.success) {
            toast.success("Products deleted");
            setIsDeleteDialogOpen(false);
            setSelectedIds([]);
            router.refresh();
        } else {
            toast.error(res.error || "Failed to delete");
        }
        setIsDeleting(false);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 w-10">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 cursor-pointer"
                                        checked={items.length > 0 && selectedIds.length === items.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="p-4 w-10"></th>
                                <th className="p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Inventory</th>
                                <th className="p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Position</th>
                                <th className="p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="p-4 text-right">
                                    {selectedIds.length > 0 && (
                                        <Button 
                                            variant="destructive" 
                                            size="sm" 
                                            className="h-8 text-[10px] font-bold"
                                            onClick={() => {
                                                setProductToDelete(selectedIds);
                                                setIsDeleteDialogOpen(true);
                                            }}
                                        >
                                            Delete ({selectedIds.length})
                                        </Button>
                                    )}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <SortableContext items={items.map((i: AdminProduct) => i.id)} strategy={verticalListSortingStrategy}>
                                {items.map((product: AdminProduct) => (
                                    <SortableProductRow 
                                        key={product.id} 
                                        product={product} 
                                        selectedIds={selectedIds} 
                                        toggleSelect={toggleSelect} 
                                        handleDuplicate={handleDuplicate}
                                        setProductToDelete={setProductToDelete}
                                        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                                        router={router}
                                    />
                                ))}
                            </SortableContext>
                        </tbody>
                    </table>
                </DndContext>
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the selected products.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete Permanently"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
