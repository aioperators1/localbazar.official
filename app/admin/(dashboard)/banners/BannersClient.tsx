"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, X, Image as ImageIcon, Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBanner, deleteBanner, updateBanner } from "@/lib/actions/admin";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/admin/ImageUpload";

type Banner = {
    id: string;
    title: string;
    titleAr?: string | null;
    subtitle: string | null;
    subtitleAr?: string | null;
    description?: string | null;
    descriptionAr?: string | null;
    image: string;
    mobileImage: string | null;
    link: string | null;
    active: boolean;
    order: number;
};

export default function BannersClient({ initialBanners }: { initialBanners: Banner[] }) {
    const [banners, setBanners] = useState<Banner[]>(initialBanners);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        titleAr: "",
        subtitle: "",
        subtitleAr: "",
        description: "",
        descriptionAr: "",
        image: "",
        mobileImage: "",
        link: "",
        active: true,
        order: 0
    });

    const resetForm = () => {
        setFormData({ title: "", titleAr: "", subtitle: "", subtitleAr: "", description: "", descriptionAr: "", image: "", mobileImage: "", link: "", active: true, order: 0 });
        setIsEditing(null);
        setIsCreating(false);
    };

    const startEditing = (banner: Banner) => {
        setFormData({
            title: banner.title || "",
            titleAr: banner.titleAr || "",
            subtitle: banner.subtitle || "",
            subtitleAr: banner.subtitleAr || "",
            description: banner.description || "",
            descriptionAr: banner.descriptionAr || "",
            image: banner.image || "",
            mobileImage: banner.mobileImage || "",
            link: banner.link || "",
            active: banner.active,
            order: banner.order || 0
        });
        setIsEditing(banner.id);
        setIsCreating(true);
    };

    const handleSave = async () => {
        if (!formData.title || !formData.image) {
            return toast.error("Title and image are required");
        }
        setLoading(true);
        try {
            const res = isEditing 
                ? await updateBanner(isEditing, formData)
                : await createBanner(formData);
            
            if (res.success) {
                toast.success(isEditing ? "Banner updated" : "Banner created");
                resetForm();
                setTimeout(() => window.location.reload(), 500);
            } else {
                toast.error(res.error || "Failed to save banner");
            }
        } catch (error: any) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this banner?")) return;
        setLoading(true);
        const res = await deleteBanner(id);
        if (res.success) {
            toast.success("Banner deleted");
            setBanners(banners.filter(b => b.id !== id));
        } else {
            toast.error("Failed to delete banner");
        }
        setLoading(false);
    };

    if (isCreating) {
        return (
            <div className="space-y-8 pb-20 max-w-4xl mx-auto">
                <div className="flex items-center justify-between bg-white p-4 border border-gray-200 rounded-lg sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={resetForm} className="h-9 w-9">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <h2 className="text-sm font-bold text-black uppercase">{isEditing ? "Edit Banner" : "Create New Banner"}</h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase">{formData.title || "Untitled"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" onClick={resetForm} className="text-xs font-bold uppercase text-gray-500">Cancel</Button>
                        <Button onClick={handleSave} disabled={loading} className="bg-black text-white hover:bg-gray-800 text-xs font-bold uppercase px-6 h-9">
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? "Saving..." : "Save Banner"}
                        </Button>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Label className="text-[11px] font-bold text-gray-500 uppercase">Banner Title (EN)</Label>
                            <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="h-10 text-sm" placeholder="e.g. Summer Collection" />
                        </div>
                        <div className="space-y-4">
                            <Label className="text-[11px] font-bold text-gray-500 uppercase block text-right">عنوان البانر (AR)</Label>
                            <Input value={formData.titleAr} onChange={e => setFormData({...formData, titleAr: e.target.value})} dir="rtl" className="h-10 text-sm text-right" placeholder="مثال: مجموعة الصيف" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Label className="text-[11px] font-bold text-gray-500 uppercase">Subtitle (EN)</Label>
                            <Input value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="h-10 text-sm" />
                        </div>
                        <div className="space-y-4">
                            <Label className="text-[11px] font-bold text-gray-500 uppercase block text-right">العنوان الفرعي (AR)</Label>
                            <Input value={formData.subtitleAr} onChange={e => setFormData({...formData, subtitleAr: e.target.value})} dir="rtl" className="h-10 text-sm text-right" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-[11px] font-bold text-gray-500 uppercase">Banner Link</Label>
                        <Input value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="h-10 text-sm" placeholder="/category/electronics" />
                    </div>

                    <div className="h-px bg-gray-100" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-[11px] font-bold text-gray-500 uppercase">Desktop Banner Image</Label>
                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Recommended: 1920x600px</span>
                            </div>
                            <ImageUpload 
                                value={formData.image ? [formData.image] : []}
                                onChange={(urls: string[]) => setFormData({ ...formData, image: urls[0] || "" })}
                                onRemove={() => setFormData({ ...formData, image: "" })}
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-[11px] font-bold text-gray-500 uppercase">Mobile Banner Image</Label>
                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Recommended: 800x1000px</span>
                            </div>
                            <ImageUpload 
                                value={formData.mobileImage ? [formData.mobileImage] : []}
                                onChange={(urls: string[]) => setFormData({ ...formData, mobileImage: urls[0] || "" })}
                                onRemove={() => setFormData({ ...formData, mobileImage: "" })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-gray-500 uppercase">Display Order</Label>
                            <Input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="h-10" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[11px] font-bold text-gray-500 uppercase">Status</Label>
                            <select 
                                className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-black"
                                value={formData.active ? "true" : "false"}
                                onChange={e => setFormData({...formData, active: e.target.value === "true"})}
                            >
                                <option value="true">Active (Visible)</option>
                                <option value="false">Hidden</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-black tracking-tight">Promotional Banners</h1>
                    <p className="text-[13px] text-gray-500 mt-1">Manage the hero banners displayed on your storefront.</p>
                </div>
                <Button 
                    onClick={() => setIsCreating(true)} 
                    className="bg-black text-white hover:bg-gray-900 h-10 rounded-lg px-6 font-bold text-[13px] shadow-sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Banner
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner: any) => (
                    <div key={banner.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
                        <div className="aspect-[2/1] relative bg-gray-50">
                            <Image 
                                src={banner.image || "https://placehold.co/800x400?text=No+Image"} 
                                alt={banner.title} 
                                fill 
                                className={cn("object-cover", !banner.active && "opacity-50 grayscale")}
                                unoptimized
                            />
                            {!banner.active && (
                                <div className="absolute top-3 right-3 bg-gray-900/80 text-white text-[10px] font-bold px-2 py-1 rounded">
                                    INACTIVE
                                </div>
                            )}
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-black text-[15px]">{banner.title}</h3>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order: {banner.order}</span>
                            </div>
                            {banner.subtitle && (
                                <p className="text-gray-500 text-[12px] line-clamp-2 mb-6 flex-1 italic">&quot;{banner.subtitle}&quot;</p>
                            )}
                            <div className="flex items-center gap-2 mt-auto">
                                <Button 
                                    onClick={() => startEditing(banner)} 
                                    className="flex-1 bg-gray-50 hover:bg-black hover:text-white text-black border border-gray-200 h-9 text-xs font-bold"
                                >
                                    <Edit2 className="w-3.5 h-3.5 mr-2" /> Edit
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={() => handleDelete(banner.id)} 
                                    className="w-9 h-9 p-0 text-gray-400 hover:text-red-600 hover:border-red-200"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                {banners.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                        <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">No Banners Found</h3>
                        <p className="text-[12px] text-gray-400 mt-1">Start by adding your first promotional banner.</p>
                        <Button onClick={() => setIsCreating(true)} variant="link" className="mt-4 text-black font-bold text-xs uppercase underline">Add Banner Now</Button>
                    </div>
                )}
            </div>
        </div>
    );
}

