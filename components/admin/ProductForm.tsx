"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
    Image as ImageIcon, 
    List, 
    Link as LinkIcon, 
    Code,
    ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
    id: string;
    name: string;
    parent?: { name: string } | null;
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
    specs?: string | null;
    sizes?: string | null;
    colors?: string | null;
    materials?: string | null;
    careInstructions?: string | null;
}

interface ProductFormProps {
    categories: Category[];
    initialData?: ProductData | null;
}

export default function ProductForm({ categories, initialData }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(initialData?.name || "");
    const [slug, setSlug] = useState(initialData?.slug || "");

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
        if (!initialData) {
            setSlug(value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
        }
    };

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get("name") as string,
            slug: formData.get("slug") as string,
            price: formData.get("price") as string,
            stock: formData.get("stock") as string,
            categoryId: formData.get("categoryId") as string,
            image: formData.get("image") as string,
            brand: formData.get("brand") as string,
            sku: formData.get("sku") as string,
            description: formData.get("description") as string,
            specs: initialData?.specs || "{}",
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
            toast.error(initialData ? "Failed to update" : "Failed to create");
            console.error(res);
        }
        setLoading(false);
    }

    return (
        <form onSubmit={onSubmit} className="relative space-y-6">
            {/* STICKY HEADER */}
            <div className="sticky top-0 z-[30] -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-3 bg-[#F1F1F1]/80 backdrop-blur-md border-b border-[#E3E3E3] mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button type="button" variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 text-[#616161] hover:bg-white rounded-lg">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex flex-col">
                        <h1 className="text-[14px] font-black text-[#303030] leading-none uppercase tracking-tight">
                            {initialData ? initialData.name : "Unsaved product"}
                        </h1>
                        <span className="text-[10px] font-bold text-[#616161] uppercase tracking-[0.2em] mt-1">Product Details</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button type="button" variant="ghost" onClick={() => router.back()} className="h-9 px-4 text-[13px] font-bold text-[#616161] hover:bg-white rounded-lg">
                        Discard
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={loading}
                        className="h-9 px-6 bg-[#303030] text-white hover:bg-black rounded-lg font-black text-[13px] uppercase tracking-wider shadow-lg shadow-black/10"
                    >
                        {loading ? "Saving..." : "Save Product"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
                {/* ── Main Column ─────────────────────────────── */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Title & Description */}
                    <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[11px] font-black text-[#616161] uppercase tracking-widest">Title</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    value={name}
                                    onChange={handleNameChange}
                                    placeholder="e.g. Handmade Silk Scarf"
                                    className="bg-white border-[#D2D2D2] text-[13px] h-10 rounded-lg focus:ring-1 focus:ring-black font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-[11px] font-black text-[#616161] uppercase tracking-widest flex items-center justify-between">
                                    URL Slug
                                    <span className="text-[9px] text-[#616161] lowercase font-normal italic tracking-normal opacity-60">localbazar.qa/product/{slug}</span>
                                </Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    required
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="bg-[#F9F9F9] border-[#D2D2D2] text-[12px] h-9 rounded-lg focus:ring-1 focus:ring-black font-mono"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-[11px] font-black text-[#616161] uppercase tracking-widest">Description</Label>
                            <div className="border border-[#D2D2D2] rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-black transition-all bg-[#F9F9F9]">
                                {/* Toolbar */}
                                <div className="flex items-center gap-1 p-2 bg-white border-b border-[#E3E3E3]">
                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 font-black text-xs text-[#616161] hover:text-[#303030]">B</Button>
                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 italic font-serif text-[#616161] hover:text-[#303030]">I</Button>
                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 underline text-[#616161] hover:text-[#303030]">U</Button>
                                    <div className="w-[1px] h-4 bg-[#E3E3E3] mx-1" />
                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-[#616161] hover:text-[#303030]"><List className="w-4 h-4" /></Button>
                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-[#616161] hover:text-[#303030]"><LinkIcon className="w-4 h-4" /></Button>
                                    <div className="flex-1" />
                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-[#616161] hover:text-[#303030]"><Code className="w-4 h-4" /></Button>
                                </div>
                                <Textarea
                                    id="description"
                                    name="description"
                                    required
                                    defaultValue={initialData?.description}
                                    className="border-none focus:ring-0 min-h-[200px] text-[13px] resize-none bg-transparent"
                                    placeholder="Describe this product..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-6 space-y-4">
                        <Label className="text-[11px] font-black text-[#616161] uppercase tracking-widest">Media</Label>
                        <div className="relative border-2 border-dashed border-[#E3E3E3] rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 hover:border-[#303030] hover:bg-[#F9F9F9] transition-all cursor-pointer group">
                            <div className="w-12 h-12 rounded-full bg-[#F1F1F1] flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ImageIcon className="w-6 h-6 text-[#616161]" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[13px] font-bold text-[#303030]">Drop image or paste URL</p>
                                <p className="text-[11px] text-[#616161]">JPEG, PNG, WEBP supported</p>
                            </div>
                            <Input 
                                id="image" 
                                name="image" 
                                defaultValue={initialData?.images}
                                placeholder="https://..."
                                className="text-[12px] h-9 max-w-sm text-center border-[#D2D2D2] bg-white rounded-lg focus:ring-1 focus:ring-black"
                            />
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-6 space-y-6">
                        <Label className="text-[11px] font-black text-[#616161] uppercase tracking-widest">Pricing</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-[11px] text-[#616161] font-bold">Price</Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-black text-[#303030] border-r border-[#E3E3E3] pr-3">QAR</span>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        required
                                        defaultValue={initialData?.price}
                                        className="pl-16 bg-white border-[#D2D2D2] h-11 rounded-lg text-[14px] font-black focus:ring-1 focus:ring-black"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="compare-at" className="text-[11px] text-[#616161] font-bold">Compare-at Price</Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-black text-[#616161] border-r border-[#E3E3E3] pr-3">QAR</span>
                                    <Input id="compare-at" className="pl-16 bg-[#F9F9F9] border-[#D2D2D2] h-11 rounded-lg text-[14px] font-bold" placeholder="0.00" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-[11px] font-black text-[#616161] uppercase tracking-widest">Inventory</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] text-[#616161]">Track quantity</span>
                                <Switch defaultChecked />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sku" className="text-[12px] text-[#616161] font-bold">SKU</Label>
                                <Input
                                    id="sku"
                                    name="sku"
                                    defaultValue={initialData?.sku || ""}
                                    className="bg-white border-[#D2D2D2] h-9 rounded-lg text-[13px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock" className="text-[12px] text-[#616161] font-bold">Quantity</Label>
                                <Input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    required
                                    defaultValue={initialData?.stock}
                                    className="bg-white border-[#D2D2D2] h-9 rounded-lg text-[13px]"
                                />
                            </div>
                        </div>
                    </div>

                </div>
                {/* ── End Main Column ──────────────────────────── */}

                {/* ── Sidebar Column ───────────────────────────── */}
                <div className="space-y-6">

                    {/* Status */}
                    <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-5 space-y-4">
                        <Label className="text-[11px] font-black text-[#616161] uppercase tracking-widest">Status</Label>
                        <Select defaultValue="active">
                            <SelectTrigger className="w-full h-10 bg-white border-[#D2D2D2] rounded-lg text-[13px] font-bold">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active (Visible)</SelectItem>
                                <SelectItem value="draft">Draft (Hidden)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-[10px] text-[#616161]">Active products are visible in the store.</p>
                    </div>

                    {/* Category */}
                    <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-5 space-y-4">
                        <Label className="text-[11px] font-black text-[#616161] uppercase tracking-widest">Category</Label>
                        <div className="relative">
                            <select
                                name="categoryId"
                                defaultValue={initialData?.categoryId}
                                required
                                className="w-full h-10 bg-white border border-[#D2D2D2] rounded-lg px-4 text-[13px] font-bold focus:ring-1 focus:ring-black outline-none appearance-none cursor-pointer hover:border-[#303030] transition-colors"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.parent ? `${cat.parent.name} → ${cat.name}` : cat.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-3 pointer-events-none opacity-40">
                                <ChevronLeft className="w-4 h-4 -rotate-90" />
                            </div>
                        </div>
                    </div>

                    {/* Organization */}
                    <div className="bg-white rounded-xl border border-[#E3E3E3] shadow-sm p-5 space-y-4">
                        <Label className="text-[11px] font-black text-[#616161] uppercase tracking-widest">Organization</Label>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] text-[#616161] font-bold">Brand</Label>
                                <Input 
                                    name="brand"
                                    defaultValue={initialData?.brand || ""}
                                    placeholder="e.g. Local Bazar" 
                                    className="h-9 text-[13px] border-[#D2D2D2] rounded-lg bg-[#F9F9F9] focus:ring-1 focus:ring-black font-bold" 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] text-[#616161] font-bold">Product Type</Label>
                                <Input placeholder="e.g. Accessories" className="h-9 text-[13px] border-[#D2D2D2] rounded-lg bg-[#F9F9F9] focus:ring-1 focus:ring-black" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] text-[#616161] font-bold">Tags</Label>
                                <Input placeholder="luxury, qatari, exclusive" className="h-9 text-[13px] border-[#D2D2D2] rounded-lg bg-[#F9F9F9] focus:ring-1 focus:ring-black" />
                            </div>
                        </div>
                    </div>

                </div>
                {/* ── End Sidebar Column ───────────────────────── */}

            </div>
        </form>
    );
}
