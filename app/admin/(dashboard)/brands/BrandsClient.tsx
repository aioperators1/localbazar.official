"use client";

import { useState } from "react";
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

    const resetForm = () => {
        setFormData({ name: "", nameAr: "", slug: "", logo: "", description: "", descriptionAr: "", featured: false, showInHome: false });
        setIsEditing(null);
        setIsCreating(false);
    };

    const handleCreate = async () => {
        if (!canEdit('brands')) return toast.error("ACCESS DENIED: EDITOR PERMISSION REQUIRED");
        if (!formData.name) return toast.error("Brand name is required");
        setLoading(true);
        const res = await createBrand(formData);
        if (res.success) {
            toast.success("BRAND ENTITY INITIALIZED");
            resetForm();
            window.location.reload();
        } else {
            toast.error("INITIALIZATION FAILED");
        }
        setLoading(false);
    };

    const handleUpdate = async (id: string) => {
        if (!canEdit('brands')) return toast.error("ACCESS DENIED: EDITOR PERMISSION REQUIRED");
        setLoading(true);
        const res = await updateBrand(id, formData);
        if (res.success) {
            toast.success("ENTITY STATE SYNCHRONIZED");
            resetForm();
            window.location.reload();
        } else {
            toast.error("SYNCHRONIZATION ERROR");
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
        <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
            {/* 🌌 ULTRA PRO HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-[20px] flex items-center justify-center border border-white/10 shadow-2xl">
                            <Shield className="w-6 h-6 text-white/40" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Brand Ecosystem</h1>
                            <p className="text-[12px] font-bold text-white/30 uppercase tracking-[0.4em] mt-2 ml-1">Corporate Identity Registry</p>
                        </div>
                    </div>
                </div>
                {!isCreating && canEdit('brands') && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Button 
                            onClick={() => setIsCreating(true)} 
                            className="bg-white text-black hover:bg-white/90 h-14 px-10 rounded-[22px] font-black text-[12px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/5"
                        >
                            <Plus className="w-5 h-5 mr-3" /> Initialize Brand
                        </Button>
                    </motion.div>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isCreating && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                        className="glass-card p-12 rounded-[48px] border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] space-y-12 relative overflow-hidden bg-[#0A0A0A]/60 backdrop-blur-3xl"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="flex items-center justify-between relative z-10">
                             <div className="flex items-center gap-5">
                                 <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                     <Tag className="w-6 h-6 text-white/60" />
                                 </div>
                                 <div>
                                     <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">{isEditing ? "Synchronize Entity" : "Entity Specification"}</h2>
                                     <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Configure administrative parameters</p>
                                 </div>
                             </div>
                             <Button variant="ghost" onClick={resetForm} className="h-12 w-12 p-0 rounded-2xl hover:bg-white/5 text-white/20 hover:text-white transition-all">
                                 <X className="w-6 h-6" />
                             </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                            <div className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <Label className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70 ml-2">Brand Identity (EN)</Label>
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
                                            placeholder="e.g. LUXURY_ESTATE"
                                            className="h-16 bg-white/[0.03] border-white/5 rounded-2xl px-8 text-[16px] font-black text-white placeholder-white/10 focus:bg-white/[0.05] focus:border-white/20 focus:ring-4 focus:ring-white/5 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70 mr-2 text-right block">اسم العلامة التجارية (AR)</Label>
                                        <Input 
                                            value={formData.nameAr}
                                            onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                                            placeholder="مثال: العقارات الفاخرة"
                                            dir="rtl"
                                            className="h-16 bg-white/[0.03] border-white/5 rounded-2xl px-8 text-[20px] font-black text-white placeholder-white/10 focus:bg-white/[0.05] focus:border-white/20 focus:ring-4 focus:ring-white/5 transition-all outline-none text-right font-sans"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70 ml-2">Universal Slug Protocol</Label>
                                    <div className="relative group">
                                        <Input 
                                            value={formData.slug}
                                            onChange={e => setFormData({...formData, slug: e.target.value})}
                                            placeholder="luxury-estate"
                                            className="h-16 bg-white/[0.03] border-white/5 rounded-2xl pl-16 pr-8 text-[14px] font-black tracking-widest text-blue-400 focus:bg-white/[0.05] focus:border-white/20 transition-all outline-none"
                                        />
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 font-black text-[12px]">@</div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { id: 'featured', label: 'Global Recognition', sub: 'Set as featured premium ecosystem member', value: formData.featured, field: 'featured' },
                                        { id: 'showInHome', label: 'Home Page Matrix', sub: 'Display under main operations hero section', value: formData.showInHome, field: 'showInHome' }
                                    ].map((opt) => (
                                        <div 
                                            key={opt.id}
                                            onClick={() => setFormData({...formData, [opt.field]: !opt.value})}
                                            className={cn(
                                                "flex items-center gap-6 p-6 rounded-[28px] border transition-all cursor-pointer group/opt",
                                                opt.value 
                                                    ? "bg-white/5 border-white/20" 
                                                    : "bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/10"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                                                opt.value ? "bg-white text-black scale-110" : "bg-white/5 text-white/20 group-hover/opt:scale-110"
                                            )}>
                                                {opt.value ? <Zap className="w-5 h-5 fill-current" /> : <Info className="w-5 h-5" />}
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <Label className="text-white text-[14px] font-black uppercase tracking-widest cursor-pointer leading-none mb-1">{opt.label}</Label>
                                                <span className="text-white/20 text-[10px] font-bold uppercase tracking-[0.1em]">{opt.sub}</span>
                                            </div>
                                            <div className={cn(
                                                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                                opt.value ? "bg-white border-white" : "border-white/10"
                                            )}>
                                                {opt.value && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70 ml-2">Visual Logotype Asset</Label>
                                    <div className="bg-white/[0.02] rounded-[32px] p-10 border border-white/10 shadow-inner group/upload transition-all hover:bg-white/[0.04]">
                                        <ImageUpload 
                                            value={formData.logo ? [formData.logo] : []}
                                            onChange={(urls) => setFormData({...formData, logo: urls[urls.length - 1]})}
                                            onRemove={() => setFormData({...formData, logo: ""})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <Label className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70 ml-2">Corporate Narrative (EN)</Label>
                                        <Textarea 
                                            value={formData.description}
                                            onChange={e => setFormData({...formData, description: e.target.value})}
                                            placeholder="Formal executive brand description..."
                                            className="min-h-[140px] bg-white/[0.03] border-white/5 rounded-[28px] p-8 text-[15px] font-medium text-white/80 placeholder:text-white/10 focus:bg-white/[0.05] focus:border-white/20 transition-all outline-none resize-none leading-relaxed"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70 mr-2 text-right block">وصف العلامة التجارية (AR)</Label>
                                        <Textarea 
                                            value={formData.descriptionAr}
                                            onChange={e => setFormData({...formData, descriptionAr: e.target.value})}
                                            placeholder="وصف رسمي تنفيذي للعلامة التجارية..."
                                            dir="rtl"
                                            className="min-h-[140px] bg-white/[0.03] border-white/5 rounded-[28px] p-8 text-[18px] font-medium text-white/80 placeholder:text-white/10 focus:bg-white/[0.05] focus:border-white/20 transition-all outline-none resize-none leading-relaxed text-right font-sans"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-6 pt-12 border-t border-white/5 relative z-10">
                            <Button 
                                variant="ghost" 
                                onClick={resetForm} 
                                disabled={loading} 
                                className="h-16 px-12 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white hover:bg-white/5 transition-all"
                            >
                                Abort Mission
                            </Button>
                            <Button
                                onClick={() => isEditing ? handleUpdate(isEditing) : handleCreate()}
                                disabled={loading}
                                className="h-16 px-16 bg-white hover:bg-white/90 text-black rounded-[24px] font-black text-[12px] uppercase tracking-widest shadow-2xl shadow-white/5 hover:scale-105 active:scale-95 transition-all"
                            >
                                {loading ? "EXECUTING PROTOCOL..." : (isEditing ? "Synchronize State" : "Initialize Entity")}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 💎 ENTITY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {brands.map((brand, idx) => (
                    <motion.div 
                        key={brand.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        whileHover={{ y: -10 }}
                        className="glass-card border border-white/5 rounded-[40px] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] bg-white/[0.01] backdrop-blur-3xl group relative overflow-hidden flex flex-col h-full"
                    >
                         {/* Status indicators */}
                        <div className="absolute top-6 right-6 flex flex-col gap-2 items-end z-10">
                             {brand.featured && (
                                 <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-xl">Featured</div>
                             )}
                             {brand.showInHome && (
                                 <div className="bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-xl">Home Hub</div>
                             )}
                        </div>

                        <div className="flex flex-col items-center text-center gap-8 mb-10">
                            <div className="relative group/logo">
                                <div className="absolute -inset-4 bg-white/5 rounded-[48px] blur-2xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-700" />
                                <div className="relative w-28 h-28 bg-white/[0.03] rounded-[36px] flex items-center justify-center border border-white/10 overflow-hidden shadow-2xl transition-all duration-700 group-hover/logo:scale-110 group-hover/logo:rotate-3">
                                    {brand.logo ? (
                                        <Image 
                                            src={brand.logo} 
                                            alt={brand.name} 
                                            width={80} 
                                            height={80} 
                                            className="object-contain p-4 opacity-90 group-hover/logo:opacity-100 transition-all duration-700 group-hover/logo:scale-110" 
                                            unoptimized 
                                        />
                                    ) : (
                                        <Tag className="w-10 h-10 text-white/10" />
                                    )}
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <h3 className="font-black text-white text-[20px] uppercase tracking-tighter italic leading-none">{brand.name}</h3>
                                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                                    @{brand.slug}
                                </div>
                            </div>
                        </div>

                        <div className="mb-12 flex-1 relative">
                             <div className="absolute -left-4 -top-4 text-4xl text-white/5 font-serif">&quot;</div>
                             <p className="text-[14px] text-white/40 font-medium leading-[1.8] line-clamp-3 italic tracking-tight px-2">
                                 {brand.description || "Corporate narrative pending initialization for this operational entity."}
                             </p>
                        </div>

                        {canEdit('brands') && (
                            <div className="flex items-center gap-4 pt-8 border-t border-white/5">
                                <Button 
                                    variant="ghost" 
                                    onClick={() => startEditing(brand)} 
                                    className="flex-1 h-14 bg-white/[0.03] hover:bg-white hover:text-black border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all group/modify"
                                >
                                    <Edit2 className="w-4 h-4 mr-3 group-hover/modify:scale-110" /> Modify
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    onClick={() => handleDelete(brand.id)} 
                                    className="w-14 h-14 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/10 rounded-2xl transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {brands.length === 0 && (
                <div className="py-40 flex flex-col items-center justify-center gap-8 opacity-20 group">
                    <div className="w-24 h-24 rounded-[40px] bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-1000">
                        <Tag className="w-10 h-10" />
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-black text-white uppercase tracking-[0.5em] mb-2 leading-none">Registry Empty</p>
                        <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Awaiting brand ecosystem initialization</p>
                    </div>
                </div>
            )}
        </div>
    );
}
