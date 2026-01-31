"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Category {
    id: string;
    name: string;
}

interface ProductData {
    id?: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    categoryId: string;
    images: string;
    brand?: string | null;
    sku?: string | null;
    description: string;
}

interface ProductFormProps {
    categories: Category[];
    initialData?: ProductData | null;
}

export default function ProductForm({ categories, initialData }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);

        // Helper to get image URL from form
        const rawImage = formData.get("image") as string;

        // If editing, we might need to handle existing images better, but for now assuming it's a string URL
        const imageToSave = rawImage;

        const data = {
            name: formData.get("name") as string,
            slug: (formData.get("name") as string).toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            price: formData.get("price") as string,
            stock: formData.get("stock") as string,
            categoryId: formData.get("categoryId") as string,
            image: imageToSave,
            brand: formData.get("brand") as string,
            sku: formData.get("sku") as string,
            description: formData.get("description") as string,
        };

        let res;
        if (initialData?.id) {
            res = await updateProduct(initialData.id, data);
        } else {
            res = await createProduct(data);
        }

        if (res.success) {
            toast.success(initialData ? "Product updated successfully" : "Product created successfully");
            router.push("/admin/products");
            router.refresh();
        } else {
            toast.error(initialData ? "Failed to update product" : "Failed to create product");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            console.error((res as any).error);
        }
        setLoading(false);
    }

    // Helper to extract first image if stored as JSON array
    const getDefaultImage = (images: string) => {
        try {
            const parsed = JSON.parse(images);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
            return images; // Fallback if it's not an array
        } catch {
            return images; // Fallback if not JSON
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6 max-w-2xl bg-zinc-900/50 p-8 rounded-xl border border-white/5 backdrop-blur-md">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                        id="name"
                        name="name"
                        required
                        defaultValue={initialData?.name}
                        placeholder="e.g. MacBook Pro"
                        className="bg-black/40 border-white/10"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                        id="brand"
                        name="brand"
                        defaultValue={initialData?.brand || ''}
                        placeholder="e.g. Apple"
                        className="bg-black/40 border-white/10"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Price (MAD)</Label>
                    <Input
                        id="price"
                        name="price"
                        type="number"
                        required
                        defaultValue={initialData?.price}
                        placeholder="0.00"
                        className="bg-black/40 border-white/10"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                        id="stock"
                        name="stock"
                        type="number"
                        required
                        defaultValue={initialData?.stock}
                        placeholder="0"
                        className="bg-black/40 border-white/10"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                    id="sku"
                    name="sku"
                    required
                    defaultValue={initialData?.sku || ''}
                    placeholder="PROD-001"
                    className="bg-black/40 border-white/10"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <select
                    id="categoryId"
                    name="categoryId"
                    defaultValue={initialData?.categoryId}
                    className="flex h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    required
                >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                    id="image"
                    name="image"
                    required
                    defaultValue={initialData ? getDefaultImage(initialData.images) : ''}
                    placeholder="https://..."
                    className="bg-black/40 border-white/10"
                />
                <p className="text-xs text-muted-foreground">Paste a direct image link (e.g., Unsplash)</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    required
                    defaultValue={initialData?.description}
                    placeholder="Product details..."
                    className="bg-black/40 border-white/10 min-h-[100px]"
                />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? (initialData ? "Updating..." : "Creating...") : (initialData ? "Update Product" : "Create Product")}
            </Button>
        </form>
    );
}
