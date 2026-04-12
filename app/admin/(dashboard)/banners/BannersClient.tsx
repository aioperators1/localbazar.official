"use client";

import { useState } from "react";
import { Image as ImageIcon, Plus, Trash2, Edit2, X, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBanner, deleteBanner, updateBanner } from "@/lib/actions/admin";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { usePermissions } from "@/hooks/use-permissions";

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
    const { canEdit } = usePermissions();
    const [banners, setBanners] = useState<Banner[]>(initialBanners);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
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

    const handleCreate = async () => {
        if (!canEdit('banners')) return toast.error("Access Denied: Editor permission required");
        if (!formData.title || !formData.image) return toast.error("Title and image are required");
        setLoading(true);
        const res = await createBanner(formData);
        if (res.success) {
            toast.success("Banner created successfully");
            resetForm();
            window.location.reload();
        } else {
            toast.error(res.error || "Error creating banner");
        }
        setLoading(false);
    };

    const handleUpdate = async (id: string) => {
        if (!canEdit('banners')) return toast.error("Access Denied: Editor permission required");
        setLoading(true);
        const res = await updateBanner(id, formData);
        if (res.success) {
            toast.success("Banner updated successfully");
            resetForm();
            window.location.reload();
        } else {
            toast.error(res.error || "Error updating banner");
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!canEdit('banners')) return toast.error("Access Denied: Editor permission required");
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
        if (!canEdit('banners')) return toast.error("Access Denied: Editor permission required");
        setFormData({
            title: banner.title,
            titleAr: banner.titleAr || "",
            subtitle: banner.subtitle || "",
            subtitleAr: banner.subtitleAr || "",
            description: banner.description || "",
            descriptionAr: banner.descriptionAr || "",
            image: banner.image,
            mobileImage: banner.mobileImage || "",
            link: banner.link || "",
            active: banner.active,
            order: banner.order
        });
        setIsEditing(banner.id);
        setIsCreating(true);
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-1000">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight italic">Visual Campaigns</h1>
                        <p className="text-[13px] text-white/40 font-medium mt-1">Orchestrate high-impact hero banners for the digital storefront.</p>
                    </div>
                    {!isCreating && canEdit('banners') && (
                        <Button 
                            onClick={() => setIsCreating(true)} 
                            className="bg-white text-black hover:bg-white/80 h-10 rounded-xl px-6 font-black text-[11px] uppercase tracking-widest shadow-xl shadow-white/5 transition-all"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Initialize Campaign
                        </Button>
                    )}
                </div>
            </div>

            {isCreating && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-6 duration-700">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card p-8 rounded-[32px] border border-white/5 shadow-2xl space-y-8 bg-white/[0.01]">
                            <h2 className="text-[14px] font-black text-white uppercase tracking-[0.2em] italic">
                                {isEditing ? "Modify Campaign Asset" : "New Visual Strategy"}
                            </h2>
                            <div className="grid gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black text-white/70 uppercase tracking-widest">Global Title (EN)</Label>
                                        <Input
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="IMPERIAL COLLECTION"
                                            className="bg-white/5 border-white/10 h-10 rounded-xl text-white text-[14px] uppercase tracking-tighter italic font-black placeholder:text-white/10 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black text-white/70 uppercase tracking-widest block text-right">العنوان الاستراتيجي (AR)</Label>
                                        <Input
                                            value={formData.titleAr}
                                            onChange={e => setFormData({ ...formData, titleAr: e.target.value })}
                                            placeholder="مجموعة النخبة"
                                            dir="rtl"
                                            className="bg-white/5 border-white/10 h-10 rounded-xl text-white text-[18px] text-right font-bold placeholder:text-white/10 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black text-white/70 uppercase tracking-widest">Subtitle (EN)</Label>
                                        <Input
                                            value={formData.subtitle}
                                            onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                                            placeholder="Elegance redefined for the modern elite."
                                            className="bg-white/5 border-white/10 h-10 rounded-xl text-white/80 text-[13px] font-medium placeholder:text-white/10 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black text-white/70 uppercase tracking-widest block text-right">العنوان الفرعي (AR)</Label>
                                        <Input
                                            value={formData.subtitleAr}
                                            onChange={e => setFormData({ ...formData, subtitleAr: e.target.value })}
                                            placeholder="إعادة تعريف الأناقة للنخبة الحديثة."
                                            dir="rtl"
                                            className="bg-white/5 border-white/10 h-10 rounded-xl text-white/80 text-[15px] text-right font-medium placeholder:text-white/10 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black text-white/70 uppercase tracking-widest">Strategic Narrative (EN)</Label>
                                        <textarea
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Detailed campaign narrative..."
                                            className="w-full flex min-h-[100px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[13px] text-white/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-black text-white/70 uppercase tracking-widest block text-right">السرد القصصي (AR)</Label>
                                        <textarea
                                            value={formData.descriptionAr}
                                            onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })}
                                            placeholder="سرد مفصل للحملة..."
                                            dir="rtl"
                                            className="w-full flex min-h-[100px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-white/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 text-right transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-white/70 uppercase tracking-widest">Hyperlink Destination</Label>
                                    <Input
                                        value={formData.link}
                                        onChange={e => setFormData({ ...formData, link: e.target.value })}
                                        placeholder="/collection/new-arrivals"
                                        className="bg-white/5 border-white/10 h-10 rounded-xl text-white/80 text-[13px] font-medium outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8 rounded-[32px] border border-white/5 shadow-2xl space-y-8 bg-white/[0.01]">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <ImageIcon className="w-5 h-5 text-white/40" />
                                </div>
                                <h3 className="text-[14px] font-black text-white uppercase tracking-[0.2em] italic">Responsive Media Assets</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Cinema Display</Label>
                                        <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">561x248px Optimal</span>
                                    </div>
                                    <ImageUpload 
                                        value={formData.image ? [formData.image] : []}
                                        onChange={(urls) => setFormData({ ...formData, image: urls[0] || "" })}
                                        onRemove={() => setFormData({ ...formData, image: "" })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Mobile Vertical</Label>
                                        <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">540x675px Optimal</span>
                                    </div>
                                    <ImageUpload 
                                        value={formData.mobileImage ? [formData.mobileImage] : []}
                                        onChange={(urls) => setFormData({ ...formData, mobileImage: urls[0] || "" })}
                                        onRemove={() => setFormData({ ...formData, mobileImage: "" })}
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-white/[0.02] p-6 rounded-2xl flex items-start gap-4 border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <p className="text-[11px] text-white/70 font-medium leading-relaxed uppercase tracking-tight italic">
                                    UPLOAD GUIDELINE: For maximum prestige, use high-resolution photography without baked-in text. The system dynamically overlays strategic copy for optimal accessibility.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="glass-card p-6 rounded-[32px] border border-white/5 shadow-2xl space-y-6 bg-white/[0.01]">
                            <Label className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-4 block italic">Campaign Parameters</Label>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Sequence Order</Label>
                                    <Input
                                        type="number"
                                        value={formData.order}
                                        onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        className="h-10 text-[13px] bg-white/5 border-white/10 rounded-xl text-white font-black italic outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Active State</Label>
                                    <select
                                        className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-[13px] text-white font-black italic focus:ring-1 focus:ring-white/20 outline-none appearance-none"
                                        value={formData.active ? "true" : "false"}
                                        onChange={e => setFormData({ ...formData, active: e.target.value === "true" })}
                                    >
                                        <option value="true" className="bg-[#0A0A0A]">Public Deployment</option>
                                        <option value="false" className="bg-[#0A0A0A]">Encrypted / Stealth</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-4">
                            <Button 
                                onClick={() => isEditing ? handleUpdate(isEditing) : handleCreate()}
                                disabled={loading}
                                className="w-full bg-white text-black hover:bg-white/80 h-12 rounded-xl text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-white/5 transition-all active:scale-95"
                            >
                                {loading ? "Synchronizing..." : (isEditing ? "Apply Global Changes" : "Deploy Campaign")}
                            </Button>
                            <Button variant="ghost" onClick={resetForm} disabled={loading} className="w-full h-12 text-white/40 hover:text-white hover:bg-white/5 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] transition-all">
                                Abort Mission
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {banners.length === 0 && !isCreating ? (
                    <div className="col-span-full py-32 text-center group">
                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-700">
                            <ImageIcon className="w-10 h-10 text-white/10 group-hover:text-white/40 transition-colors" />
                        </div>
                        <h3 className="text-white font-black uppercase tracking-[0.3em] text-[13px] italic">Strategic Void Detected</h3>
                        <p className="text-white/20 text-[11px] font-bold mt-2 uppercase tracking-widest">No active campaigns in the registry.</p>
                    </div>
                ) : (
                    banners.map(banner => (
                        <div key={banner.id} className="glass-card border border-white/5 rounded-[32px] shadow-2xl overflow-hidden group hover:border-white/20 transition-all duration-700 flex flex-col bg-white/[0.01]">
                            <div className="aspect-[16/9] relative bg-white/5 overflow-hidden">
                                <Image
                                    src={banner.image}
                                    alt={banner.title}
                                    fill
                                    className={cn("object-cover transition-transform duration-1000 group-hover:scale-110", !banner.active && "opacity-30 grayscale")}
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                
                                {!banner.active && (
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[9px] font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" /> Stealth Mode
                                    </div>
                                )}
                                
                                <div className="absolute bottom-4 left-6 z-10">
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] leading-none mb-1 block">Level {banner.order}</span>
                                    <h3 className="font-black text-white text-[18px] uppercase tracking-tighter italic leading-none">{banner.title}</h3>
                                </div>
                            </div>
                            <div className="p-8 flex flex-1 flex-col">
                                {banner.subtitle && (
                                    <p className="text-white/40 text-[12px] font-medium leading-relaxed italic mb-8 line-clamp-2">
                                        &quot;{banner.subtitle}&quot;
                                    </p>
                                )}
                                
                                {canEdit('banners') && (
                                    <div className="flex items-center gap-3 mt-auto">
                                        <Button 
                                            onClick={() => startEditing(banner)} 
                                            className="flex-1 h-10 text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 hover:bg-white hover:text-black border border-white/10 rounded-xl transition-all"
                                        >
                                            <Edit2 className="w-3.5 h-3.5 mr-2" /> Modify
                                        </Button>
                                        <Button 
                                            variant="ghost"
                                            onClick={() => handleDelete(banner.id)} 
                                            className="w-10 h-10 p-0 text-white/20 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl border border-white/5"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
