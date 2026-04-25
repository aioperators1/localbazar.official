"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, Tag, Shield, Zap, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBrand, deleteBrand, updateBrand } from "@/lib/actions/admin";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { motion, AnimatePresence } from "framer-motion";
import { usePermissions } from "@/hooks/use-permissions";

type Brand = {
    id: string;
    name: string;
    nameAr?: string | null;
    slug: string;
    logo: string | null;
    description: string | null;
    descriptionAr?: string | null;
    featured: boolean;
    showInHome: boolean;
};

export default function BrandsClient({ initialBrands }: { initialBrands: Brand[] }) {
    const { canEdit } = usePermissions();
    const [brands, setBrands] = useState<Brand[]>(initialBrands);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        nameAr: "",
        slug: "",
        logo: "",
        description: "",
        descriptionAr: "",
        featured: false,
        showInHome: false
    });

    const [nameError, setNameError] = useState<string | null>(null);

    // Real-time duplicate name check
    useEffect(() => {
        if (!formData.name.trim()) {
            setNameError(null);
            return;
        }
        const duplicate = brands.find(
            b => b.name.toLowerCase() === formData.name.trim().toLowerCase() && b.id !== isEditing
        );
        if (duplicate) {
            setNameError(`This name is already used by another brand. Please choose a different name.`);
        } else {
            setNameError(null);
        }
    }, [formData.name, brands, isEditing]);

    const resetForm = () => {
        setFormData({ name: "", nameAr: "", slug: "", logo: "", description: "", descriptionAr: "", featured: false, showInHome: false });
        setIsEditing(null);
        setIsCreating(false);
    };

    const handleCreate = async () => {
        if (!canEdit('brands')) return toast.error("ACCESS DENIED: EDITOR PERMISSION REQUIRED");
        if (!formData.name) return toast.error("Brand name is required");
        if (nameError) return toast.error(nameError);
        setLoading(true);
        const res = await createBrand(formData);
        if (res.success) {
            toast.success("BRAND ENTITY INITIALIZED");
            resetForm();
            window.location.reload();
        } else {
            toast.error(res.error || "INITIALIZATION FAILED");
        }
        setLoading(false);
    };

    const handleUpdate = async (id: string) => {
        if (!canEdit('brands')) return toast.error("ACCESS DENIED: EDITOR PERMISSION REQUIRED");
        if (nameError) return toast.error(nameError);
        setLoading(true);
        const res = await updateBrand(id, formData);
        if (res.success) {
            toast.success("ENTITY STATE SYNCHRONIZED");
            resetForm();
            window.location.reload();
        } else {
            toast.error(res.error || "SYNCHRONIZATION ERROR");
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!canEdit('brands')) return toast.error("ACCESS DENIED: EDITOR PERMISSION REQUIRED");
        if (!confirm("Permanent termination of this brand entity?")) return;
        setLoading(true);
        const res = await deleteBrand(id);
        if (res.success) {
            toast.success("TERMINATION SUCCESSFUL");
            setBrands(brands.filter(b => b.id !== id));
        } else {
            toast.error("TERMINATION INTERRUPTED");
        }
        setLoading(false);
    };

    const startEditing = (brand: Brand) => {
        if (!canEdit('brands')) return toast.error("ACCESS DENIED: EDITOR PERMISSION REQUIRED");
        setFormData({
            name: brand.name,
            nameAr: brand.nameAr || "",
            slug: brand.slug,
            logo: brand.logo || "",
            description: brand.description || "",
            descriptionAr: brand.descriptionAr || "",
            featured: brand.featured || false,
            showInHome: brand.showInHome || false
        });
        setIsEditing(brand.id);
        setIsCreating(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-8 pb-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Brands</h1>
                    <p className="text-[13px] text-gray-500">Manage brand identities and information.</p>
                </div>
                {!isCreating && canEdit('brands') && (
                    <Button 
                        onClick={() => setIsCreating(true)} 
                        className="bg-black text-white hover:bg-gray-800 h-10 px-6 rounded-lg text-[12px] font-semibold uppercase tracking-wider shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Brand
                    </Button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isCreating && (
                    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <Tag className="w-5 h-5 text-gray-500" />
                                 <div>
                                     <h2 className="text-[16px] font-bold text-black tracking-tight">{isEditing ? "Edit Brand" : "New Brand"}</h2>
                                 </div>
                             </div>
                             <Button variant="ghost" onClick={resetForm} className="h-8 w-8 p-0 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md">
                                 <X className="w-5 h-5" />
                             </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[12px] font-semibold text-gray-700">Brand Name (EN)</Label>
                                        <Input 
                                            value={formData.name}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setFormData({ 
                                                    ...formData, 
                                                    name: val,
                                                    slug: isEditing ? formData.slug : val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                                                });
                                            }}
                                            placeholder="e.g. Acme Studio"
                                            className={cn(
                                                "bg-white border-gray-200 h-10 text-[13px] text-black rounded-lg outline-none",
                                                nameError && "border-red-400 focus:border-red-500 focus:ring-red-500"
                                            )}
                                        />
                                        {nameError && (
                                            <p className="text-[11px] text-red-500 font-medium mt-1">{nameError}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[12px] font-semibold text-gray-700 block text-right">اسم العلامة التجارية (AR)</Label>
                                        <Input 
                                            value={formData.nameAr}
                                            onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                                            placeholder="استوديو اكمي"
                                            dir="rtl"
                                            className="bg-white border-gray-200 h-10 text-[14px] text-black rounded-lg text-right outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold text-gray-700">URL Slug</Label>
                                    <Input 
                                        value={formData.slug}
                                        onChange={e => setFormData({...formData, slug: e.target.value})}
                                        placeholder="acme-studio"
                                        className="bg-gray-50 border-gray-200 h-10 text-[13px] text-black rounded-lg outline-none"
                                    />
                                </div>
                                
                                <div className="space-y-3">
                                    {[
                                        { id: 'featured', label: 'Featured Brand', sub: 'Highlight this brand in related lists', value: formData.featured, field: 'featured' },
                                        { id: 'showInHome', label: 'Show on Homepage', sub: 'Display this brand globally on the front page', value: formData.showInHome, field: 'showInHome' }
                                    ].map((opt) => (
                                        <div 
                                            key={opt.id}
                                            onClick={() => setFormData({...formData, [opt.field]: !opt.value})}
                                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer"
                                        >
                                            <div className="flex-1">
                                                <Label className="text-[13px] font-bold text-black cursor-pointer">{opt.label}</Label>
                                                <p className="text-[11px] text-gray-500 mt-1">{opt.sub}</p>
                                            </div>
                                            <div className={cn(
                                                "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                                                opt.value ? "bg-black border-black" : "bg-white border-gray-300"
                                            )}>
                                                {opt.value && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold text-gray-700">Brand Logo</Label>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <ImageUpload 
                                            value={formData.logo ? [formData.logo] : []}
                                            onChange={(urls) => setFormData({...formData, logo: urls[urls.length - 1]})}
                                            onRemove={() => setFormData({...formData, logo: ""})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[12px] font-semibold text-gray-700">Description (EN)</Label>
                                        <Textarea 
                                            value={formData.description}
                                            onChange={e => setFormData({...formData, description: e.target.value})}
                                            placeholder="Brand details..."
                                            className="min-h-[100px] bg-white border-gray-200 rounded-lg p-3 text-[13px] text-black outline-none resize-y"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[12px] font-semibold text-gray-700 block text-right">الوصف (AR)</Label>
                                        <Textarea 
                                            value={formData.descriptionAr}
                                            onChange={e => setFormData({...formData, descriptionAr: e.target.value})}
                                            placeholder="تفاصيل العلامة التجارية..."
                                            dir="rtl"
                                            className="min-h-[100px] bg-white border-gray-200 rounded-lg p-3 text-[14px] text-black outline-none resize-y text-right"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                            <Button 
                                variant="ghost" 
                                onClick={resetForm} 
                                disabled={loading} 
                                className="h-10 px-6 rounded-lg text-[12px] font-semibold text-gray-500 hover:text-black hover:bg-gray-100"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => isEditing ? handleUpdate(isEditing) : handleCreate()}
                                disabled={loading}
                                className="h-10 px-8 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold text-[12px]"
                            >
                                {loading ? "Saving..." : (isEditing ? "Save Brand" : "Create Brand")}
                            </Button>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {brands.map((brand) => (
                    <div 
                        key={brand.id}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col relative"
                    >
                         {/* Status indicators */}
                        <div className="absolute top-4 right-4 flex flex-col gap-1.5 items-end">
                             {brand.featured && (
                                 <div className="bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider">Featured</div>
                             )}
                             {brand.showInHome && (
                                 <div className="bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider">Home</div>
                             )}
                        </div>

                        <div className="flex flex-col items-center text-center gap-4 mb-6">
                            <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200 overflow-hidden">
                                {brand.logo ? (
                                    <Image 
                                        src={brand.logo} 
                                        alt={brand.name} 
                                        width={64} 
                                        height={64} 
                                        className="object-contain p-2" 
                                        unoptimized 
                                    />
                                ) : (
                                    <Tag className="w-8 h-8 text-gray-300" />
                                )}
                            </div>
                            
                            <div className="space-y-1">
                                <h3 className="font-bold text-black text-[16px]">{brand.name}</h3>
                                <div className="text-[11px] font-medium text-gray-500">
                                    @{brand.slug}
                                </div>
                            </div>
                        </div>

                        <div className="mb-6 flex-1">
                             <p className="text-[12px] text-gray-500 line-clamp-3 text-center">
                                 {brand.description || "No description provided."}
                             </p>
                        </div>

                        {canEdit('brands') && (
                            <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
                                <Button 
                                    variant="outline" 
                                    onClick={() => startEditing(brand)} 
                                    className="flex-1 h-8 bg-gray-50 hover:bg-gray-100 border-gray-200 text-black text-[11px] font-semibold"
                                >
                                    <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    onClick={() => handleDelete(brand.id)} 
                                    className="w-8 h-8 p-0 text-gray-400 hover:bg-red-50 hover:text-red-600 border border-gray-200 rounded-md"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {brands.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center gap-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                    <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                        <Tag className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-[14px] font-bold text-black mb-1">No Brands Found</p>
                        <p className="text-[12px] text-gray-500">Add a new brand to see it here</p>
                    </div>
                </div>
            )}
        </div>
    );
}
