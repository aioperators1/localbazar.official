"use client";

import { useState, useRef } from "react";
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
    ChevronLeft,
    Plus,
    Trash2,
    X,
    ImagePlus,
    Video,
    Paperclip,
    Loader2
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageUpload } from "./ImageUpload";

interface Category {
    id: string;
    name: string;
    parent?: { name: string } | null;
}

interface ProductData {
    id?: string;
    name: string;
    nameAr?: string | null;
    slug: string;
    price: number;
    stock: number;
    categoryId: string;
    images: string;
    brandId?: string | null;
    brandName?: string | null;
    sku?: string | null;
    description: string;
    descriptionAr?: string | null;
    specs?: string | null;
    sizes?: string | null;
    colors?: string | null;
    materials?: string | null;
    materialsAr?: string | null;
    careInstructions?: string | null;
    careInstructionsAr?: string | null;
}

interface ProductFormProps {
    categories: Category[];
    brands: any[];
    initialData?: ProductData | null;
}

export default function ProductForm({ categories, brands, initialData }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(initialData?.name || "");
    const [nameAr, setNameAr] = useState(initialData?.nameAr || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [descriptionAr, setDescriptionAr] = useState(initialData?.descriptionAr || "");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const textareaArRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingAttachment, setUploadingAttachment] = useState(false);
    
    // Parse specs for productType and tags
    const initialSpecs = (() => {
        try {
            return JSON.parse(initialData?.specs || "{}");
        } catch {
            return {};
        }
    })();
    
    const [productType, setProductType] = useState(initialSpecs.productType || "");
    const [tags, setTags] = useState(initialSpecs.tags || "");

    // Advanced Attributes State
    const [sizesList, setSizesList] = useState<string[]>(() => {
        try {
            return JSON.parse(initialData?.sizes || '["S", "M", "L", "XL"]');
        } catch {
            return ["S", "M", "L", "XL"];
        }
    });

    const [colorsList, setColorsList] = useState<{name: string, hex: string}[]>(() => {
        try {
            return JSON.parse(initialData?.colors || '[]');
        } catch {
            return [];
        }
    });

    const [newSize, setNewSize] = useState("");
    const [newColorName, setNewColorName] = useState("");
    const [newColorHex, setNewColorHex] = useState("#000000");

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
        if (!initialData) {
            setSlug(value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
        }
    };

    const [images, setImages] = useState<string[]>(() => {
        try {
            if (initialData?.images && initialData.images.startsWith('[')) {
                return JSON.parse(initialData.images);
            } else if (initialData?.images) {
                return [initialData.images];
            }
        } catch (e) {
            console.error("Image parse error", e);
        }
        return [];
    });


    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        
        // Clean up empty images
        const filteredImages = images.filter(img => img.trim() !== "");

        const data = {
            name: formData.get("name") as string,
            nameAr: formData.get("nameAr") as string,
            slug: formData.get("slug") as string,
            price: formData.get("price") as string,
            stock: formData.get("stock") as string,
            categoryId: formData.get("categoryId") as string,
            image: filteredImages, // Sending as array to the action
            brandId: formData.get("brandId") as string,
            brandName: formData.get("brandName") as string,
            sku: formData.get("sku") as string,
            description: description,
            descriptionAr: descriptionAr,
            specs: JSON.stringify({
                ...initialSpecs,
                productType,
                tags
            }),
            sizes: JSON.stringify(sizesList),
            colors: JSON.stringify(colorsList),
            materials: formData.get("materials") as string,
            materialsAr: formData.get("materialsAr") as string,
            careInstructions: formData.get("careInstructions") as string,
            careInstructionsAr: formData.get("careInstructionsAr") as string,
        };

        let res;
        if (initialData?.id) {
            res = await updateProduct(initialData.id, data);
        } else {
            res = await createProduct(data as any);
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

    const [lastFocusedRef, setLastFocusedRef] = useState<any>(textareaRef);

    const insertFormatting = (ref: any, tag: string, closingTag?: string) => {
        const textarea = ref.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(end);
        const selected = text.substring(start, end);

        const newText = before + `${tag}${selected}${closingTag || ""}` + after;
        
        if (ref === textareaRef) {
            setDescription(newText);
        } else {
            setDescriptionAr(newText);
        }
        
        // Focus back after state update
        setTimeout(() => {
            textarea.focus();
            const newPos = start + tag.length + selected.length + (closingTag?.length || 0);
            textarea.setSelectionRange(newPos, newPos);
        }, 0);
    };

    const handleAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingAttachment(true);
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Upload failed");
            
            const data = await res.json();
            const url = data.url;

            let tag = "";
            if (file.type.startsWith("image/")) {
                tag = `<img src="${url}" alt="Image" class="w-full rounded-lg my-4" />`;
            } else if (file.type.startsWith("video/")) {
                tag = `<video src="${url}" controls class="w-full rounded-lg my-4" />`;
            } else {
                tag = `<a href="${url}" target="_blank" class="text-[#303030] border-b border-black font-bold">Download Attachment</a>`;
            }

            insertFormatting(lastFocusedRef, tag);
            toast.success("Attachment added");
        } catch (error) {
            console.error("Attachment upload error:", error);
            toast.error("Failed to upload attachment");
        } finally {
            setUploadingAttachment(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <form onSubmit={onSubmit} className="relative space-y-6">
            {/* STICKY HEADER */}
            <div className="sticky top-0 z-[30] -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-3 bg-black/60 backdrop-blur-xl border-b border-white/5 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button type="button" variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10 rounded-lg">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex flex-col">
                        <h1 className="text-[14px] font-black text-white leading-none uppercase tracking-tight">
                            {initialData ? initialData.name : "Unsaved product"}
                        </h1>
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">Product Details</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button type="button" variant="ghost" onClick={() => router.back()} className="h-9 px-4 text-[13px] font-bold text-white/50 hover:text-white hover:bg-white/10 rounded-lg">
                        Discard
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={loading}
                        className="h-9 px-6 bg-white text-black hover:bg-neutral-200 rounded-lg font-black text-[13px] uppercase tracking-wider shadow-xl shadow-white/5 transition-all active:scale-95"
                    >
                        {loading ? "Saving..." : "Save Product"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
                {/* ── Main Column ─────────────────────────────── */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Title & Description */}
                    <div className="bg-[#0A0A0A]/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Title (English)</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        value={name}
                                        onChange={handleNameChange}
                                        placeholder="e.g. Handmade Silk Scarf"
                                        className="bg-white/5 border-white/10 text-white text-[13px] h-10 rounded-xl focus:ring-1 focus:ring-white/40 placeholder:text-white/20 font-bold transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nameAr" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-right block">العنوان (العربية)</Label>
                                    <Input
                                        id="nameAr"
                                        name="nameAr"
                                        value={nameAr}
                                        onChange={(e) => setNameAr(e.target.value)}
                                        placeholder="مثال: وشاح حريري مصنوع يدويًا"
                                        dir="rtl"
                                        className="bg-white/5 border-white/10 text-white text-[15px] h-10 rounded-xl focus:ring-1 focus:ring-white/40 placeholder:text-white/20 font-bold text-right transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center justify-between">
                                    URL Slug
                                    <span className="text-[9px] text-white/30 lowercase font-normal italic tracking-normal opacity-60">localbazar.qa/product/{slug}</span>
                                </Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    required
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="bg-black/20 border-white/5 text-white/60 text-[12px] h-9 rounded-xl focus:ring-1 focus:ring-white/20 font-mono transition-all"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Description (English)</Label>
                                <div className="border border-white/10 rounded-2xl overflow-hidden focus-within:ring-1 focus-within:ring-white/30 transition-all bg-black/20">
                                    {/* Toolbar */}
                                    <div className="flex items-center gap-1 p-2 bg-white/5 border-b border-white/5">
                                        <Button type="button" variant="ghost" size="icon" onClick={() => insertFormatting(textareaRef, "<b>", "</b>")} className="h-8 w-8 font-black text-xs text-white/40 hover:text-white hover:bg-white/10">B</Button>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => insertFormatting(textareaRef, "<i>", "</i>")} className="h-8 w-8 italic font-serif text-white/40 hover:text-white hover:bg-white/10">I</Button>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => {
                                                setLastFocusedRef(textareaRef);
                                                fileInputRef.current?.click();
                                            }} 
                                            className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
                                        >
                                            <ImageIcon className="w-4 h-4" />
                                        </Button>
                                        <div className="flex-1" />
                                    </div>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        ref={textareaRef}
                                        required
                                        value={description}
                                        onFocus={() => setLastFocusedRef(textareaRef)}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="border-none focus:ring-0 min-h-[150px] text-[13px] resize-none bg-transparent text-white/90 placeholder:text-white/10"
                                        placeholder="Describe l product..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descriptionAr" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-right block">الوصف (العربية)</Label>
                                <div className="border border-white/10 rounded-2xl overflow-hidden focus-within:ring-1 focus-within:ring-white/30 transition-all bg-black/20" dir="rtl">
                                    {/* Toolbar */}
                                    <div className="flex items-center gap-1 p-2 bg-white/5 border-b border-white/5">
                                        <Button type="button" variant="ghost" size="icon" onClick={() => insertFormatting(textareaArRef, "<b>", "</b>")} className="h-8 w-8 font-black text-xs text-white/40 hover:text-white hover:bg-white/10">B</Button>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => insertFormatting(textareaArRef, "<i>", "</i>")} className="h-8 w-8 italic font-serif text-white/40 hover:text-white hover:bg-white/10">I</Button>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => {
                                                setLastFocusedRef(textareaArRef);
                                                fileInputRef.current?.click();
                                            }} 
                                            className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
                                        >
                                            <ImageIcon className="w-4 h-4" />
                                        </Button>
                                        <div className="flex-1" />
                                    </div>
                                    <Textarea
                                        id="descriptionAr"
                                        name="descriptionAr"
                                        ref={textareaArRef}
                                        value={descriptionAr}
                                        onFocus={() => setLastFocusedRef(textareaArRef)}
                                        onChange={(e) => setDescriptionAr(e.target.value)}
                                        className="border-none focus:ring-0 min-h-[150px] text-[15px] resize-none bg-transparent text-white/90 placeholder:text-white/10 text-right"
                                        placeholder="صف هذا المنتج..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="bg-[#0A0A0A]/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Media Gallery</Label>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-white/5 bg-black/20 p-4">
                            <ImageUpload 
                                value={images.filter(img => img.trim() !== "")}
                                onChange={(urls: string[]) => setImages(urls)}
                                onRemove={(url: string) => setImages(images.filter(img => img !== url))}
                            />
                        </div>
                    </div>

                    {/* Specifications Accordion Replacement (Native for Form) */}
                    <div className="bg-[#0A0A0A]/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl p-6 space-y-6">
                        <Label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Detailed Specifications</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* SIZES MANAGEMENT */}
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] block">Available Sizes</Label>
                                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border border-white/10 rounded-2xl bg-black/20">
                                    {sizesList.map((size, index) => (
                                        <div key={index} className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg shadow-sm animate-in zoom-in-95">
                                            <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">{size}</span>
                                            <button 
                                                type="button" 
                                                onClick={() => setSizesList(sizesList.filter((_, i) => i !== index))}
                                                className="text-white/20 hover:text-rose-400 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {sizesList.length === 0 && <span className="text-[10px] text-white/20 italic">No sizes added</span>}
                                </div>
                                <div className="flex gap-2">
                                    <Input 
                                        value={newSize}
                                        onChange={(e) => setNewSize(e.target.value)}
                                        placeholder="e.g. EU 42"
                                        className="h-9 bg-white/5 border-white/10 text-white text-[13px] rounded-xl focus:ring-1 focus:ring-white/30 placeholder:text-white/10"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (newSize.trim()) {
                                                    setSizesList([...sizesList, newSize.trim()]);
                                                    setNewSize("");
                                                }
                                            }
                                        }}
                                    />
                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={() => {
                                            if (newSize.trim()) {
                                                setSizesList([...sizesList, newSize.trim()]);
                                                setNewSize("");
                                            }
                                        }}
                                        className="h-9 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl px-3"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* COLORS MANAGEMENT */}
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] block">Available Colors</Label>
                                <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border border-white/10 rounded-2xl bg-black/20">
                                    {colorsList.map((color, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-white/5 border border-white/10 px-2 py-1 rounded-lg shadow-sm pr-1 animate-in zoom-in-95">
                                            <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: color.hex }} />
                                            <span className="text-[10px] font-bold text-white/70 max-w-[60px] truncate uppercase tracking-tighter">{color.name}</span>
                                            <button 
                                                type="button" 
                                                onClick={() => setColorsList(colorsList.filter((_, i) => i !== index))}
                                                className="ml-1 text-white/20 hover:text-rose-400 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {colorsList.length === 0 && <span className="text-[10px] text-white/20 italic">No colors added</span>}
                                </div>
                                <div className="space-y-3 p-4 border border-dashed border-white/10 rounded-2xl bg-black/10">
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input 
                                            value={newColorName}
                                            onChange={(e) => setNewColorName(e.target.value)}
                                            placeholder="Color name"
                                            className="h-8 bg-white/5 border-white/10 text-white text-[11px] rounded-lg focus:ring-1 focus:ring-white/20"
                                        />
                                        <div className="flex gap-1">
                                            <Input 
                                                type="color"
                                                value={newColorHex}
                                                onChange={(e) => setNewColorHex(e.target.value)}
                                                className="h-8 w-10 p-0 border-white/10 rounded-lg overflow-hidden cursor-pointer"
                                            />
                                            <Input 
                                                value={newColorHex}
                                                onChange={(e) => setNewColorHex(e.target.value)}
                                                className="h-8 flex-1 bg-white/5 border-white/10 text-white text-[10px] font-mono rounded-lg"
                                            />
                                        </div>
                                    </div>
                                    <Button 
                                        type="button" 
                                        onClick={() => {
                                            if (newColorName.trim()) {
                                                setColorsList([...colorsList, { name: newColorName.trim(), hex: newColorHex }]);
                                                setNewColorName("");
                                            }
                                        }}
                                        className="w-full h-8 bg-white text-black hover:bg-neutral-200 text-[10px] font-black uppercase tracking-widest rounded-lg"
                                        variant="outline"
                                    >
                                        Add Color Variant
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                            <div className="space-y-4">
                                <Label className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">Materials / الخامات</Label>
                                <div className="space-y-3">
                                    <Input 
                                        id="materials" 
                                        name="materials" 
                                        defaultValue={initialData?.materials || ""} 
                                        placeholder="Materials (English)"
                                        className="bg-white/5 border-white/10 text-white h-10 rounded-xl text-[13px] placeholder:text-white/10"
                                    />
                                    <Input 
                                        id="materialsAr" 
                                        name="materialsAr" 
                                        defaultValue={initialData?.materialsAr || ""} 
                                        placeholder="الخامات (العربية)"
                                        dir="rtl"
                                        className="bg-white/5 border-white/10 text-white h-10 rounded-xl text-[14px] text-right placeholder:text-white/10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">Care Instructions / تعليمات العناية</Label>
                                <div className="space-y-3">
                                    <Input 
                                        id="careInstructions" 
                                        name="careInstructions" 
                                        defaultValue={initialData?.careInstructions || ""} 
                                        placeholder="Care Instructions (English)"
                                        className="bg-white/5 border-white/10 text-white h-10 rounded-xl text-[13px] placeholder:text-white/10"
                                    />
                                    <Input 
                                        id="careInstructionsAr" 
                                        name="careInstructionsAr" 
                                        defaultValue={initialData?.careInstructionsAr || ""} 
                                        placeholder="تعليمات العناية (العربية)"
                                        dir="rtl"
                                        className="bg-white/5 border-white/10 text-white h-10 rounded-xl text-[14px] text-right placeholder:text-white/10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-[#0A0A0A]/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl p-6 space-y-6">
                        <Label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Pricing</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Price</Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-black text-white/50 border-r border-white/10 pr-3">QAR</span>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        required
                                        defaultValue={initialData?.price}
                                        className="pl-16 bg-white/5 border-white/10 text-white h-11 rounded-xl text-[14px] font-black focus:ring-1 focus:ring-white/40 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="compare-at" className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Compare-at Price</Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-black text-white/20 border-r border-white/10 pr-3">QAR</span>
                                    <Input id="compare-at" className="pl-16 bg-black/20 border-white/10 text-white/50 h-11 rounded-xl text-[14px] font-bold" placeholder="0.00" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="bg-[#0A0A0A]/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Inventory</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-white/30 uppercase tracking-widest">Track Inventory</span>
                                <Switch defaultChecked className="data-[state=checked]:bg-white" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sku" className="text-[10px] text-white/30 font-bold uppercase tracking-wider">SKU</Label>
                                <Input
                                    id="sku"
                                    name="sku"
                                    defaultValue={initialData?.sku || ""}
                                    className="bg-white/5 border-white/10 text-white h-9 rounded-xl text-[13px] placeholder:text-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock" className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Quantity</Label>
                                <Input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    required
                                    defaultValue={initialData?.stock}
                                    className="bg-white/5 border-white/10 text-white h-9 rounded-xl text-[13px]"
                                />
                            </div>
                        </div>
                    </div>

                </div>
                {/* ── End Main Column ──────────────────────────── */}

                {/* ── Sidebar Column ───────────────────────────── */}
                <div className="space-y-6">

                    {/* Status */}
                    <div className="bg-[#0A0A0A]/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl p-6 space-y-4">
                        <Label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Status</Label>
                        <div className="relative">
                            <select
                                name="status"
                                defaultValue={initialData?.stock && initialData.stock > 0 ? "active" : "draft"}
                                className="w-full h-11 bg-white/5 border border-white/10 text-white rounded-xl px-4 text-[13px] font-bold focus:ring-1 focus:ring-white/40 outline-none appearance-none cursor-pointer hover:border-white/20 transition-all uppercase tracking-widest shadow-inner shadow-white/5"
                            >
                                <option value="active" className="bg-[#111] text-white">Active (Visible)</option>
                                <option value="draft" className="bg-[#111] text-white">Draft (Hidden)</option>
                            </select>
                            <div className="absolute right-3 top-3.5 pointer-events-none opacity-20 text-white">
                                <ChevronLeft className="w-4 h-4 -rotate-90" />
                            </div>
                        </div>
                        <p className="text-[9px] text-white/30 font-bold leading-relaxed tracking-wider uppercase">Active products are visible to customers in the store.</p>
                    </div>

                    {/* Category */}
                    <div className="bg-[#0A0A0A]/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl p-6 space-y-4">
                        <Label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Category</Label>
                        <div className="relative">
                            <select
                                name="categoryId"
                                defaultValue={initialData?.categoryId}
                                required
                                className="w-full h-11 bg-white/5 border border-white/10 text-white rounded-xl px-4 text-[12px] font-bold focus:ring-1 focus:ring-white/40 outline-none appearance-none cursor-pointer hover:border-white/20 transition-all tracking-wider"
                            >
                                <option value="" className="bg-[#111] text-white">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id} className="bg-[#111] text-white uppercase text-[10px]">
                                        {cat.parent ? `${cat.parent.name} → ${cat.name}` : cat.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-3.5 pointer-events-none opacity-20 text-white">
                                <ChevronLeft className="w-4 h-4 -rotate-90" />
                            </div>
                        </div>
                    </div>

                    {/* Organization */}
                    <div className="bg-[#0A0A0A]/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl p-6 space-y-6">
                        <Label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Organization</Label>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Select Brand</Label>
                                <div className="relative">
                                    <select
                                        name="brandId"
                                        defaultValue={initialData?.brandId || ""}
                                        className="w-full h-10 bg-white/5 border border-white/10 text-white rounded-xl px-4 text-[12px] font-bold focus:ring-1 focus:ring-white/40 outline-none appearance-none cursor-pointer hover:border-white/20 transition-all uppercase"
                                    >
                                        <option value="" className="bg-[#111] text-white">No Brand</option>
                                        {brands.map((brand) => (
                                            <option key={brand.id} value={brand.id} className="bg-[#111] text-white">
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-3 pointer-events-none opacity-20 text-white">
                                        <ChevronLeft className="w-4 h-4 -rotate-90" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Custom Brand Name</Label>
                                <Input 
                                    name="brandName"
                                    defaultValue={initialData?.brandName || ""}
                                    placeholder="e.g. Local Bazar" 
                                    className="h-9 bg-white/5 border-white/10 text-white text-[12px] rounded-xl focus:ring-1 focus:ring-white/30 placeholder:text-white/10 uppercase" 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Product Type</Label>
                                <Input 
                                    value={productType}
                                    onChange={(e) => setProductType(e.target.value)}
                                    placeholder="e.g. Accessories" 
                                    className="h-9 bg-white/5 border-white/10 text-white text-[12px] rounded-xl focus:ring-1 focus:ring-white/30 placeholder:text-white/10 uppercase" 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Tags</Label>
                                <Input 
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="luxury, qatari, exclusive" 
                                    className="h-9 bg-white/5 border-white/10 text-white text-[12px] rounded-xl focus:ring-1 focus:ring-white/30 placeholder:text-white/10 uppercase" 
                                />
                            </div>
                        </div>
                    </div>

                </div>
                {/* ── End Sidebar Column ───────────────────────── */}

            </div>
        </form>
    );
}
