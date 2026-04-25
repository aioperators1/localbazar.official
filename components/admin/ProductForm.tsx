"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { slugify } from "@/lib/slugify";
import { createProduct, updateProduct } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
    ChevronLeft,
    Plus,
    X,
    Save
} from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { RichTextEditor } from "./RichTextEditor";

interface Category {
    id: string;
    name: string;
    parent?: { name: string } | null;
}

interface ProductData {
    id?: string;
    name: string;
    nameAr?: string;
    slug: string;
    price: number;
    salePrice?: number | null;
    stock: number;
    categoryId: string;
    images: string;
    brandId?: string;
    brandName?: string;
    sku?: string;
    description: string;
    descriptionAr?: string;
    specs?: string;
    sizes?: string;
    colors?: string;
    materials?: string;
    materialsAr?: string;
    careInstructions?: string;
    careInstructionsAr?: string;
    status?: string;
}

interface ProductFormProps {
    categories: Category[];
    brands: any[];
    initialData?: ProductData | null;
}

export default function ProductForm({ categories, brands, initialData }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [name, setName] = useState(String(initialData?.name || ""));
    const [nameAr, setNameAr] = useState(String(initialData?.nameAr || ""));
    const [slug, setSlug] = useState(String(initialData?.slug || ""));
    const [slugCustomized, setSlugCustomized] = useState(!!initialData?.slug);
    const [description, setDescription] = useState(String(initialData?.description || ""));
    const [descriptionAr, setDescriptionAr] = useState(String(initialData?.descriptionAr || ""));
    const [price, setPrice] = useState(initialData?.price || 0);
    const [salePrice, setSalePrice] = useState(initialData?.salePrice || 0);
    const [stock, setStock] = useState(initialData?.stock || 0);
    const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
    const [brandId, setBrandId] = useState(initialData?.brandId || "");
    const [brandName, setBrandName] = useState(String(initialData?.brandName || ""));
    const [sku, setSku] = useState(String(initialData?.sku || ""));
    const [status, setStatus] = useState(String(initialData?.status || "APPROVED"));

    // Auto-generate slug from name
    useEffect(() => {
        if (!initialData && !slugCustomized && name) {
            setSlug(slugify(name));
        }
    }, [name, slugCustomized, initialData]);
    
    const [images, setImages] = useState<string[]>(() => {
        try {
            const parsed = JSON.parse(initialData?.images || "[]");
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return initialData?.images ? [initialData.images] : [];
        }
    });

    const [sizesList, setSizesList] = useState<{name: string, price: number | null}[]>(() => {
        try {
            const parsed = JSON.parse(initialData?.sizes || "[]");
            return parsed.map((item: any) => {
                if (typeof item === 'string') return { name: item, price: null };
                return { name: item.name, price: item.price ?? null };
            });
        } catch {
            return [];
        }
    });

    const [colorsList, setColorsList] = useState<{name: string, hex: string}[]>(() => {
        try {
            return JSON.parse(initialData?.colors || "[]");
        } catch {
            return [];
        }
    });

    const [newSize, setNewSize] = useState("");
    const [newSizePrice, setNewSizePrice] = useState("");
    const [newColorName, setNewColorName] = useState("");
    const [newColorHex, setNewColorHex] = useState("#000000");

    const handleAddSize = () => {
        if (!newSize.trim()) return;
        const parsedPrice = newSizePrice ? Number(newSizePrice) : null;
        setSizesList([...sizesList, { name: newSize.trim(), price: parsedPrice }]);
        setNewSize("");
        setNewSizePrice("");
    };

    const handleAddColor = () => {
        if (!newColorName.trim()) return;
        setColorsList([...colorsList, { name: newColorName.trim(), hex: newColorHex }]);
        setNewColorName("");
    };

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);

        const data = {
            name,
            nameAr,
            slug,
            price: String(price),
            salePrice: salePrice > 0 ? String(salePrice) : null,
            stock: String(stock),
            categoryId,
            image: images,
            brandId,
            brandName,
            sku,
            description,
            descriptionAr,
            sizes: JSON.stringify(sizesList),
            colors: JSON.stringify(colorsList),
            status: status
        };

        try {
            const res = initialData?.id 
                ? await updateProduct(initialData.id, data as any)
                : await createProduct(data as any);

            if (res.success) {
                toast.success("Saved successfully");
                router.push("/admin/products");
                router.refresh();
            } else {
                toast.error(res.error || "Failed to save");
            }
        } catch (error) {
            console.error("Form Submit Error:", error);
            toast.error("An error occurred during submission");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8 pb-20">
            {/* Simple Top Bar */}
            <div className="flex items-center justify-between bg-white p-4 border border-gray-200 rounded-lg shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" size="icon" onClick={() => router.back()} className="h-9 w-9 border-gray-200">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h2 className="text-sm font-bold text-black uppercase tracking-tight">
                            {initialData ? "Edit Product" : "New Product"}
                        </h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{name || "Untitled"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button type="button" variant="ghost" onClick={() => router.back()} className="text-xs font-bold uppercase text-gray-500 hover:text-black">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-black text-white hover:bg-gray-800 text-xs font-bold uppercase px-6 h-9 rounded-md">
                        <Save className="w-3.5 h-3.5 mr-2" />
                        {loading ? "Saving..." : "Save Product"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm space-y-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-4">Basic Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold text-gray-600 uppercase">Product Name (EN)</Label>
                                <Input 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    className="border-gray-200 focus:border-black rounded-lg h-10 text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold text-gray-600 uppercase">Product Name (AR)</Label>
                                <Input 
                                    value={nameAr} 
                                    onChange={(e) => setNameAr(e.target.value)} 
                                    dir="rtl"
                                    className="border-gray-200 focus:border-black rounded-lg h-10 text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-gray-600 uppercase">URL Slug</Label>
                            <Input 
                                value={slug} 
                                onChange={(e) => {
                                    setSlug(e.target.value);
                                    setSlugCustomized(true);
                                }} 
                                className="border-gray-200 focus:border-black rounded-lg h-10 text-sm font-mono text-gray-500"
                            />
                        </div>

                        <div className="flex flex-col gap-8">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold text-gray-600 uppercase">Rich Description</Label>
                                <RichTextEditor 
                                    value={description} 
                                    onChange={(val: string) => setDescription(val)} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm space-y-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-4">Product Media</h3>
                        <ImageUpload 
                            value={images}
                            onChange={(urls: string[]) => setImages(urls)}
                            onRemove={(url: string) => setImages(images.filter((i: string) => i !== url))}
                        />
                    </div>

                    {/* Variants */}
                    <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm space-y-8">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-4">Variants & Specs</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Sizes */}
                            <div className="space-y-4">
                                <Label className="text-[11px] font-bold text-gray-600 uppercase">Sizes & Variant Pricing</Label>
                                <div className="flex flex-col gap-2">
                                    {sizesList.map((sizeObj: {name: string, price: number | null}, i: number) => (
                                        <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-200 px-3 py-2 rounded text-xs group">
                                            <div className="flex items-center gap-2">
                                                <span className="font-black uppercase">{sizeObj.name}</span>
                                                {sizeObj.price !== null && (
                                                    <span className="text-[10px] bg-white border border-gray-200 px-1.5 rounded font-black text-emerald-600 tracking-widest shadow-sm">
                                                        QAR {sizeObj.price}
                                                    </span>
                                                )}
                                            </div>
                                            <button type="button" onClick={() => setSizesList(sizesList.filter((_, idx: number) => idx !== i))}>
                                                <X className="w-3.5 h-3.5 text-gray-400 group-hover:text-black transition-colors" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-2 pt-2 border-t border-gray-50">
                                    <div className="flex gap-2">
                                        <Input value={newSize} onChange={(e) => setNewSize(e.target.value)} placeholder="Variant name (e.g. XL, 100ml)" className="h-9 text-xs flex-1 border-gray-200" />
                                        <Input type="number" value={newSizePrice} onChange={(e) => setNewSizePrice(e.target.value)} placeholder="Price (optional)" className="h-9 text-xs w-28 border-gray-200" />
                                    </div>
                                    <Button type="button" variant="outline" onClick={handleAddSize} className="h-9 text-[10px] font-bold uppercase w-full">
                                        Add Variant
                                    </Button>
                                </div>
                            </div>

                            {/* Colors */}
                            <div className="space-y-4">
                                <Label className="text-[11px] font-bold text-gray-600 uppercase">Colors</Label>
                                <div className="flex flex-wrap gap-2">
                                    {colorsList.map((color: {name: string, hex: string}, i: number) => (
                                        <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-2 py-1 rounded text-xs">
                                            <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: color.hex }} />
                                            <span className="font-bold">{color.name}</span>
                                            <button type="button" onClick={() => setColorsList(colorsList.filter((_, idx: number) => idx !== i))}>
                                                <X className="w-3 h-3 text-gray-400 hover:text-black" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <Input value={newColorName} onChange={(e) => setNewColorName(e.target.value)} placeholder="Color name..." className="h-9 text-xs flex-1" />
                                        <Input type="color" value={newColorHex} onChange={(e) => setNewColorHex(e.target.value)} className="h-9 w-12 p-1" />
                                    </div>
                                    <Button type="button" variant="outline" onClick={handleAddColor} className="h-9 text-[10px] font-bold uppercase">
                                        Add Color
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Content */}
                <div className="space-y-8">
                    {/* Organization card */}
                    <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-gray-600 uppercase">Category</Label>
                            <select 
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat: Category) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.parent ? `${cat.parent.name} > ${cat.name}` : cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-gray-600 uppercase">Brand Name</Label>
                            <select 
                                value={brandName}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setBrandName(val);
                                    if (!val) {
                                        setBrandId("");
                                    } else {
                                        const selectedBrand = brands.find((b: any) => b.name === val);
                                        if(selectedBrand) setBrandId(selectedBrand.id);
                                    }
                                }}
                                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
                            >
                                <option value="">Select Brand</option>
                                {brands.map((brand: any) => (
                                    <option key={brand.id} value={brand.name}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-gray-600 uppercase">SKU / ID</Label>
                            <Input value={sku} onChange={(e) => setSku(e.target.value)} className="h-10 text-sm font-mono" />
                        </div>

                        <div className="space-y-2 pt-4 border-t border-gray-100">
                            <Label className="text-[11px] font-bold text-gray-600 uppercase">Display status</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setStatus("APPROVED")}
                                    className={`py-2 px-3 text-[10px] font-bold rounded-lg border transition-all ${
                                        status === "APPROVED" 
                                        ? "bg-black text-white border-black" 
                                        : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    VISIBLE ON STORE
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatus("HIDDEN")}
                                    className={`py-2 px-3 text-[10px] font-bold rounded-lg border transition-all ${
                                        status === "HIDDEN" 
                                        ? "bg-[#FF3B30] text-white border-[#FF3B30]" 
                                        : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    HIDDEN FROM CUSTOMERS
                                </button>
                            </div>
                            <p className="text-[9px] text-gray-400 font-medium">Hidden products won't show in any public collections.</p>
                        </div>
                    </div>

                    {/* Inventory & Pricing card */}
                    <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold text-gray-600 uppercase">Current Price (QAR)</Label>
                                <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="h-10 text-sm font-bold border-gray-200 focus:border-black" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold text-gray-400 uppercase">Compare at Price (QAR)</Label>
                                <Input type="number" value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} className="h-10 text-sm font-medium border-gray-100 text-gray-400 focus:border-gray-300" />
                                <p className="text-[9px] text-gray-400 font-medium">Original price before discount (strike-through).</p>
                            </div>
                        </div>
                        <div className="space-y-2 pt-4 border-t border-gray-50">
                            <Label className="text-[11px] font-bold text-gray-600 uppercase">Inventory Stock</Label>
                            <Input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="h-10 text-sm font-bold border-gray-200 focus:border-black" />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
