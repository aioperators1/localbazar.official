"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCategory, updateCategory } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ImageIcon, MoreHorizontal, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import Link from "next/link";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface Category {
    id: string;
    name: string;
}

interface CategoryFormProps {
    initialData?: any | null;
    categories: Category[];
}

import { motion } from "framer-motion";

export default function CategoryForm({ initialData, categories }: CategoryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(initialData?.image || "");

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const name = formData.get("name") as string;
        const nameAr = formData.get("nameAr") as string;
        const data = {
            name,
            nameAr,
            slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            image,
            parentId: formData.get("parentId") as string,
            description: formData.get("description") as string,
            descriptionAr: formData.get("descriptionAr") as string,
            featured: formData.get("featured") === "on",
            showInHomeTabs: formData.get("showInHomeTabs") === "on",
            orderInHomeTabs: parseInt(formData.get("orderInHomeTabs") as string) || 0,
            showInHomeCurated: formData.get("showInHomeCurated") === "on",
            orderInHomeCurated: parseInt(formData.get("orderInHomeCurated") as string) || 0,
        };

        let res;
        if (initialData?.id) {
            res = await updateCategory(initialData.id, data as any);
        } else {
            res = await createCategory(data as any);
        }

        if (res.success) {
            toast.success("ENTITY SYNCHRONIZED");
            router.push("/admin/categories");
            router.refresh();
        } else {
            toast.error(res.error || "SYNCHRONIZATION ERROR");
        }
        setLoading(false);
    }

    return (
        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto pb-32">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/60 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] p-10 space-y-8"
                >
                    <div className="flex items-center gap-3 border-b border-[#0F1113]/5 pb-6">
                        <div className="w-10 h-10 rounded-2xl bg-[#0F1113] flex items-center justify-center">
                            <Star className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-black text-[#0F1113] uppercase tracking-tight">Core Configuration</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2.5">
                                <Label htmlFor="name" className="text-[11px] font-black uppercase tracking-[0.2em] text-[#A1A1A1] ml-1">Collection Title (English)</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    defaultValue={initialData?.name}
                                    placeholder="e.g. SUMMER_COLLECTION"
                                    className="h-16 bg-white/60 border-none rounded-2xl px-6 text-[16px] font-bold focus:ring-[10px] focus:ring-black/5 transition-all outline-none shadow-inner"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="nameAr" className="text-[11px] font-black uppercase tracking-[0.2em] text-[#A1A1A1] mr-1 text-right block">اسم المجموعة (العربية)</Label>
                                <Input
                                    id="nameAr"
                                    name="nameAr"
                                    defaultValue={initialData?.nameAr}
                                    placeholder="مثال: مجموعة الصيف"
                                    dir="rtl"
                                    className="h-16 bg-white/60 border-none rounded-2xl px-6 text-[18px] font-bold focus:ring-[10px] focus:ring-black/5 transition-all outline-none shadow-inner text-right"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2.5">
                                <Label htmlFor="description" className="text-[11px] font-black uppercase tracking-[0.2em] text-[#A1A1A1] ml-1">Global Narrative (English)</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={initialData?.description || ""}
                                    placeholder="Formal collection description..."
                                    className="bg-white/60 border-none rounded-[32px] p-6 text-[14px] font-medium focus:ring-[10px] focus:ring-black/5 transition-all outline-none shadow-inner resize-none min-h-[160px]"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="descriptionAr" className="text-[11px] font-black uppercase tracking-[0.2em] text-[#A1A1A1] mr-1 text-right block">الوصف (العربية)</Label>
                                <Textarea
                                    id="descriptionAr"
                                    name="descriptionAr"
                                    defaultValue={initialData?.descriptionAr || ""}
                                    placeholder="وصف رسمي للمجموعة..."
                                    dir="rtl"
                                    className="bg-white/60 border-none rounded-[32px] p-6 text-[16px] font-medium focus:ring-[10px] focus:ring-black/5 transition-all outline-none shadow-inner resize-none min-h-[160px] text-right"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/60 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] p-10 space-y-8"
                >
                    <div className="flex items-center gap-3 border-b border-[#0F1113]/5 pb-6">
                        <div className="w-10 h-10 rounded-2xl bg-[#0F1113] flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-black text-[#0F1113] uppercase tracking-tight">Visual Asset</h2>
                    </div>
                    
                    <div className="bg-white/40 rounded-[32px] p-8 border border-white/40 shadow-inner">
                        <ImageUpload 
                            value={image ? [image] : []}
                            onChange={(urls) => setImage(urls[0] || "")}
                            onRemove={() => setImage("")}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/60 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] p-8 space-y-8"
                >
                    <Label className="text-[14px] font-black text-[#0F1113] uppercase tracking-[0.1em] border-b border-[#0F1113]/5 pb-4 block">Organization</Label>
                    
                    <div className="space-y-2.5">
                        <Label htmlFor="parentId" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A1A1] ml-1">Parent Node</Label>
                        <select
                            id="parentId"
                            name="parentId"
                            defaultValue={initialData?.parentId || ""}
                            className="w-full h-14 bg-white/60 border-none rounded-2xl px-5 text-[13px] font-black uppercase tracking-widest focus:ring-[10px] focus:ring-black/5 transition-all outline-none appearance-none shadow-inner"
                        >
                            <option value="">MASTER_NODE (ROOT)</option>
                            {categories.filter(c => c.id !== initialData?.id).map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-between bg-[#F6F8F9] p-4 rounded-2xl border border-[#E3E3E3]">
                        <div className="flex flex-col">
                            <Label className="text-[11px] font-black uppercase tracking-widest text-[#0F1113]">Featured State</Label>
                            <span className="text-[9px] text-[#A1A1A1] font-bold uppercase tracking-wider">Priority Visibility</span>
                        </div>
                        <Switch name="featured" defaultChecked={initialData?.featured} />
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/60 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] p-8 space-y-8"
                >
                    <Label className="text-[14px] font-black text-[#0F1113] uppercase tracking-[0.1em] border-b border-[#0F1113]/5 pb-4 block">Deployment Logic</Label>
                    
                    <div className="space-y-6">
                        <div className="space-y-4 p-5 bg-[#F6F8F9] rounded-[24px] border border-[#E3E3E3] transition-all hover:bg-white">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <Label className="text-[11px] font-black uppercase tracking-widest text-[#0F1113]">NEW_ARRIVALS_TAB</Label>
                                    <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider mt-1">Live Home Feed</span>
                                </div>
                                <Switch name="showInHomeTabs" defaultChecked={initialData?.showInHomeTabs} />
                            </div>
                            <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#0F1113]/5">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A1A1]">Sync Order</Label>
                                <Input 
                                    name="orderInHomeTabs" 
                                    type="number" 
                                    defaultValue={initialData?.orderInHomeTabs || 0}
                                    className="h-10 w-20 text-[13px] font-black px-4 rounded-xl border-[#E3E3E3] shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 p-5 bg-[#F6F8F9] rounded-[24px] border border-[#E3E3E3] transition-all hover:bg-white">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <Label className="text-[11px] font-black uppercase tracking-widest text-[#0F1113]">COLLECTIONS_GRID</Label>
                                    <span className="text-[9px] text-[#0F1113] font-bold uppercase tracking-wider mt-1">Curated Interface</span>
                                </div>
                                <Switch name="showInHomeCurated" defaultChecked={initialData?.showInHomeCurated} />
                            </div>
                            <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#0F1113]/5">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A1A1]">Sync Order</Label>
                                <Input 
                                    name="orderInHomeCurated" 
                                    type="number" 
                                    defaultValue={initialData?.orderInHomeCurated || 0}
                                    className="h-10 w-20 text-[13px] font-black px-4 rounded-xl border-[#E3E3E3] shadow-inner"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-4"
                >
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-20 bg-[#0F1113] hover:bg-[#2A2A2A] text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-black/20"
                    >
                        {loading ? (
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                <span>SYNCHRONIZING...</span>
                            </div>
                        ) : (initialData ? "COMMIT UPDATES" : "INITIALIZE COLLECTION")}
                    </Button>
                    <div className="mt-8 flex justify-center">
                       <Link href="/admin/categories" className="text-[11px] text-[#A1A1A1] font-black uppercase tracking-[0.3em] hover:text-rose-600 transition-colors">
                          Terminate Session
                       </Link>
                    </div>
                </motion.div>
            </div>
        </form>
    );
}
