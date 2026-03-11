"use client";

import { useState } from "react";
import { Image as ImageIcon, Plus, Trash2, Edit2, Check, X, Link as LinkIcon, MoreHorizontal, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBanner, deleteBanner, updateBanner } from "@/lib/actions/admin";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Banner = {
    id: string;
    title: string;
    subtitle: string | null;
    image: string;
    link: string| null;
    active: boolean;
    order: number;
};

export default function BannersClient({ initialBanners }: { initialBanners: Banner[] }) {
    const [banners, setBanners] = useState<Banner[]>(initialBanners);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        image: "",
        link: "",
        active: true,
        order: 0
    });

    const resetForm = () => {
        setFormData({ title: "", subtitle: "", image: "", link: "", active: true, order: 0 });
        setIsEditing(null);
        setIsCreating(false);
    };

    const handleCreate = async () => {
        if (!formData.title || !formData.image) return toast.error("Title and image are required");
        setLoading(true);
        const res = await createBanner(formData);
        if (res.success) {
            toast.success("Banner created successfully");
            resetForm();
            window.location.reload();
        } else {
            toast.error("Error creating banner");
        }
        setLoading(false);
    };

    const handleUpdate = async (id: string) => {
        setLoading(true);
        const res = await updateBanner(id, formData);
        if (res.success) {
            toast.success("Banner updated successfully");
            resetForm();
            window.location.reload();
        } else {
            toast.error("Error updating banner");
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this banner?")) return;
        setLoading(true);
        const res = await deleteBanner(id);
        if (res.success) {
            toast.success("Banner deleted successfully");
            setBanners(banners.filter(b => b.id !== id));
        } else {
            toast.error("Error deleting banner");
        }
        setLoading(false);
    };

    const startEditing = (banner: Banner) => {
        setFormData({
            title: banner.title,
            subtitle: banner.subtitle || "",
            image: banner.image,
            link: banner.link || "",
            active: banner.active,
            order: banner.order
        });
        setIsEditing(banner.id);
        setIsCreating(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-[#303030]">Storefront Banners</h1>
                    {!isCreating && (
                        <Button onClick={() => setIsCreating(true)} className="bg-black text-white hover:bg-[#303030] h-9 rounded-[8px] px-4 font-bold text-[13px]">
                            <Plus className="w-4 h-4 mr-2" /> Create banner
                        </Button>
                    )}
                </div>
            </div>

            {isCreating && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-5 rounded-[12px] border border-[#E3E3E3] shadow-sm space-y-4">
                            <h2 className="text-[14px] font-bold text-[#303030]">
                                {isEditing ? "Edit banner" : "New banner"}
                            </h2>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-medium text-[#303030]">Title</Label>
                                    <Input
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Banner Title"
                                        className="bg-white border-[#D2D2D2] h-9 rounded-[8px] text-[13px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-medium text-[#303030]">Subtitle (Optional)</Label>
                                    <Input
                                        value={formData.subtitle}
                                        onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                                        placeholder="Optional caption"
                                        className="bg-white border-[#D2D2D2] h-9 rounded-[8px] text-[13px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-medium text-[#303030]">Link URL</Label>
                                    <Input
                                        value={formData.link}
                                        onChange={e => setFormData({ ...formData, link: e.target.value })}
                                        placeholder="/collection/new-arrivals"
                                        className="bg-white border-[#D2D2D2] h-9 rounded-[8px] text-[13px]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-[12px] border border-[#E3E3E3] shadow-sm space-y-4">
                            <Label className="text-[13px] font-medium text-[#303030]">Media</Label>
                            <div className="border-2 border-dashed border-[#D2D2D2] rounded-[8px] p-8 flex flex-col items-center justify-center text-center space-y-4 hover:bg-[#F9F9F9] transition-colors cursor-pointer group">
                                <Input 
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="Paste Image URL here..."
                                    className="text-[12px] h-8 max-w-xs text-center border-none shadow-none focus:ring-0 bg-transparent"
                                />
                                <Button type="button" variant="secondary" className="h-8 text-[12px] bg-white border-[#D2D2D2] hover:bg-[#F1F1F1] rounded-[6px] shadow-sm">
                                    Upload new
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-[12px] border border-[#E3E3E3] shadow-sm space-y-4">
                            <Label className="text-[13px] font-semibold text-[#303030]">Organization</Label>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label className="text-[12px] text-[#616161]">Display order</Label>
                                    <Input
                                        type="number"
                                        value={formData.order}
                                        onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        className="h-8 text-[12px] border-[#D2D2D2] rounded-[6px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] text-[#616161]">Visibility</Label>
                                    <select
                                        className="w-full h-8 bg-white border border-[#D2D2D2] rounded-[6px] px-2 text-[12px] focus:ring-1 focus:ring-black outline-none"
                                        value={formData.active ? "true" : "false"}
                                        onChange={e => setFormData({ ...formData, active: e.target.value === "true" })}
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Hidden</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button variant="outline" onClick={resetForm} disabled={loading} className="flex-1 h-10 border-[#D2D2D2] text-[#303030] rounded-[8px] text-[13px] font-medium">Cancel</Button>
                            <Button
                                onClick={() => isEditing ? handleUpdate(isEditing) : handleCreate()}
                                disabled={loading}
                                className="flex-1 bg-black text-white hover:bg-[#303030] h-10 rounded-[8px] text-[13px] font-bold"
                            >
                                {loading ? "Saving..." : (isEditing ? "Save changes" : "Publish banner")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.length === 0 && !isCreating ? (
                    <div className="col-span-full bg-white border border-[#E3E3E3] p-12 text-center rounded-[12px] shadow-sm">
                        <ImageIcon className="w-10 h-10 text-[#D2D2D2] mx-auto mb-3" />
                        <h3 className="text-[#616161] font-medium">No banners configured yet.</h3>
                    </div>
                ) : (
                    banners.map(banner => (
                        <div key={banner.id} className="bg-white border border-[#E3E3E3] rounded-[12px] shadow-sm overflow-hidden group hover:border-[#D2D2D2] transition-all flex flex-col">
                            <div className="aspect-[16/9] relative bg-[#F1F1F1] overflow-hidden">
                                <Image
                                    src={banner.image}
                                    alt={banner.title}
                                    fill
                                    className={cn("object-cover transition-transform duration-500 group-hover:scale-105", !banner.active && "opacity-50 grayscale")}
                                    unoptimized
                                />
                                {!banner.active && (
                                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded-full border border-[#E3E3E3] text-[10px] font-bold text-[#616161] flex items-center gap-1 shadow-sm">
                                        <X className="w-2.5 h-2.5" /> Hidden
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex flex-1 flex-col">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <h3 className="font-bold text-[#303030] text-[14px] line-clamp-1">{banner.title}</h3>
                                    <span className="shrink-0 text-[10px] font-medium bg-[#F1F1F1] px-1.5 py-0.5 rounded text-[#616161]">#{banner.order}</span>
                                </div>
                                {banner.subtitle && <p className="text-[#616161] text-[12px] line-clamp-2 mb-4 flex-1">{banner.subtitle}</p>}
                                
                                <div className="flex items-center gap-2 mt-auto">
                                    <Button variant="outline" size="sm" onClick={() => startEditing(banner)} className="flex-1 h-8 text-[11px] font-bold border-[#D2D2D2] text-[#303030] hover:bg-[#F1F1F1]">
                                        <Edit2 className="w-3 h-3 mr-1.5" /> Edit
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDelete(banner.id)} className="h-8 w-8 text-[#616161] hover:text-rose-600 hover:bg-rose-50 border-[#D2D2D2]">
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
