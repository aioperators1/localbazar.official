"use client";

import { useState } from "react";
import { Image as ImageIcon, Plus, Trash2, Edit2, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBrand, deleteBrand, updateBrand } from "@/lib/actions/admin";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Brand = {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    description: string | null;
    featured: boolean;
};

export default function BrandsClient({ initialBrands }: { initialBrands: any[] }) {
    const [brands, setBrands] = useState<any[]>(initialBrands);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        logo: "",
        description: "",
        featured: false
    });

    const resetForm = () => {
        setFormData({ name: "", slug: "", logo: "", description: "", featured: false });
        setIsEditing(null);
        setIsCreating(false);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setFormData({ 
            ...formData, 
            name: val,
            slug: isEditing ? formData.slug : val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        });
    };

    const handleCreate = async () => {
        if (!formData.name) return toast.error("Brand name is required");
        setLoading(true);
        const res = await createBrand(formData);
        if (res.success) {
            toast.success("Brand created successfully");
            resetForm();
            window.location.reload();
        } else {
            toast.error("Error creating brand");
        }
        setLoading(false);
    };

    const handleUpdate = async (id: string) => {
        setLoading(true);
        const res = await updateBrand(id, formData);
        if (res.success) {
            toast.success("Brand updated successfully");
            resetForm();
            window.location.reload();
        } else {
            toast.error("Error updating brand");
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        setLoading(true);
        const res = await deleteBrand(id);
        if (res.success) {
            toast.success("Deleted successfully");
            setBrands(brands.filter(b => b.id !== id));
        } else {
            toast.error("Error deleting");
        }
        setLoading(false);
    };

    const startEditing = (brand: any) => {
        setFormData({
            name: brand.name,
            slug: brand.slug,
            logo: brand.logo || "",
            description: brand.description || "",
            featured: brand.featured
        });
        setIsEditing(brand.id);
        setIsCreating(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-[#303030]">Luxury Brands</h1>
                {!isCreating && (
                    <Button onClick={() => setIsCreating(true)} className="bg-black text-white hover:bg-[#303030] h-9 rounded-[8px] font-bold text-[13px]">
                        <Plus className="w-4 h-4 mr-2" /> Add brand
                    </Button>
                )}
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded-[12px] border border-[#E3E3E3] shadow-sm space-y-6 animate-in fade-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[13px] font-medium">Brand Name</Label>
                                <Input 
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    placeholder="e.g. Local Bazar"
                                    className="h-10 border-[#D2D2D2]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[13px] font-medium">Slug</Label>
                                <Input 
                                    value={formData.slug}
                                    onChange={e => setFormData({...formData, slug: e.target.value})}
                                    placeholder="local-bazar"
                                    className="h-10 border-[#D2D2D2] font-mono text-[12px]"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[13px] font-medium">Logo URL</Label>
                                <Input 
                                    value={formData.logo}
                                    onChange={e => setFormData({...formData, logo: e.target.value})}
                                    placeholder="https://..."
                                    className="h-10 border-[#D2D2D2]"
                                />
                            </div>
                            <div className="flex items-center gap-3 pt-8">
                                <input 
                                    type="checkbox" 
                                    checked={formData.featured}
                                    onChange={e => setFormData({...formData, featured: e.target.checked})}
                                    className="w-4 h-4 accent-black"
                                    id="featured"
                                />
                                <Label htmlFor="featured" className="text-[13px] cursor-pointer">Featured Brand</Label>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[13px] font-medium">Description</Label>
                        <Textarea 
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            placeholder="A brief story about the brand..."
                            className="min-h-[100px] border-[#D2D2D2]"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={resetForm} disabled={loading} className="h-10 px-6">Cancel</Button>
                        <Button
                            onClick={() => isEditing ? handleUpdate(isEditing) : handleCreate()}
                            disabled={loading}
                            className="h-10 px-8 bg-black hover:bg-[#303030] text-white"
                        >
                            {loading ? "Saving..." : (isEditing ? "Save Changes" : "Create Brand")}
                        </Button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {brands.map(brand => (
                    <div key={brand.id} className="bg-white border border-[#E3E3E3] rounded-[12px] p-5 shadow-sm hover:border-[#D2D2D2] transition-all group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-[#F9F9F9] rounded-lg flex items-center justify-center border border-[#F1F1F1] overflow-hidden shrink-0">
                                {brand.logo ? (
                                    <Image src={brand.logo} alt={brand.name} width={48} height={48} className="object-contain p-1" unoptimized />
                                ) : (
                                    <Tag className="w-5 h-5 text-[#D2D2D2]" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-[#303030] leading-none truncate">{brand.name}</h3>
                                <p className="text-[11px] text-[#616161] mt-1 font-mono">{brand.slug}</p>
                            </div>
                        </div>
                        {brand.description && (
                            <p className="text-[12px] text-[#616161] line-clamp-2 mb-4 h-8 overflow-hidden">{brand.description}</p>
                        )}
                        <div className="flex items-center gap-2 pt-2">
                            <Button variant="outline" size="sm" onClick={() => startEditing(brand)} className="flex-1 h-8 text-[11px] font-bold">
                                <Edit2 className="w-3 h-3 mr-1.5" /> Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(brand.id)} className="w-8 h-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
