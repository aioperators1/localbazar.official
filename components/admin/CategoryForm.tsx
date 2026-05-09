"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCategory, updateCategory } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Save, ArrowLeft } from "lucide-react";
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
            expressCheckout: formData.get("expressCheckout") === "on",
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
            toast.success("Category saved successfully");
            router.push("/admin/categories");
            router.refresh();
        } else {
            toast.error(res.error || "Failed to save category");
        }
        setLoading(false);
    }

    return (
        <form onSubmit={onSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* Header Sticky */}
            <div className="flex items-center justify-between bg-white p-4 border border-gray-200 rounded-lg shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild className="h-9 w-9">
                        <Link href="/admin/categories">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-sm font-bold text-black uppercase">{initialData ? "Edit Category" : "New Category"}</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{initialData?.name || "Initializing..."}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" asChild className="text-xs font-bold uppercase text-gray-500">
                        <Link href="/admin/categories">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-black text-white hover:bg-gray-800 text-xs font-bold uppercase px-6 h-9">
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "Saving..." : "Save Category"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">Basic Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[11px] font-bold text-gray-500 uppercase">Category Name (EN)</Label>
                                <Input id="name" name="name" required defaultValue={initialData?.name} className="h-10 text-sm" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nameAr" className="text-[11px] font-bold text-gray-500 uppercase block text-right">اسم الفئة (AR)</Label>
                                <Input id="nameAr" name="nameAr" defaultValue={initialData?.nameAr} dir="rtl" className="h-10 text-sm text-right" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-[11px] font-bold text-gray-500 uppercase">Description (EN)</Label>
                                <Textarea id="description" name="description" defaultValue={initialData?.description || ""} className="min-h-[100px] text-sm" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="descriptionAr" className="text-[11px] font-bold text-gray-500 uppercase block text-right">الوصف (AR)</Label>
                                <Textarea id="descriptionAr" name="descriptionAr" defaultValue={initialData?.descriptionAr || ""} dir="rtl" className="min-h-[100px] text-sm text-right" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">Category Image</h3>
                        <ImageUpload 
                            value={image ? [image] : []}
                            onChange={(urls) => setImage(urls[0] || "")}
                            onRemove={() => setImage("")}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">Organization</h3>
                        
                        <div className="space-y-2">
                            <Label htmlFor="parentId" className="text-[11px] font-bold text-gray-500 uppercase">Parent Category</Label>
                            <select
                                id="parentId"
                                name="parentId"
                                defaultValue={initialData?.parentId || ""}
                                className="w-full h-10 bg-white border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:border-black"
                            >
                                <option value="">None (Master Category)</option>
                                {categories.filter(c => c.id !== initialData?.id).map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <Label className="text-[11px] font-bold text-gray-500 uppercase">Featured Category</Label>
                            <Switch name="featured" defaultChecked={initialData?.featured} />
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <Label className="text-[11px] font-bold text-gray-500 uppercase">Express Checkout</Label>
                            <Switch name="expressCheckout" defaultChecked={initialData?.expressCheckout} />
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-3">Home Page Visibility</h3>
                        
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[11px] font-bold text-gray-700">Show in Tabs</Label>
                                    <Switch name="showInHomeTabs" defaultChecked={initialData?.showInHomeTabs} />
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Order</span>
                                    <Input name="orderInHomeTabs" type="number" defaultValue={initialData?.orderInHomeTabs || 0} className="h-8 w-20 text-xs" />
                                </div>
                            </div>

                            <div className="h-px bg-gray-50" />

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[11px] font-bold text-gray-700">Show in Curated Grid</Label>
                                    <Switch name="showInHomeCurated" defaultChecked={initialData?.showInHomeCurated} />
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Order</span>
                                    <Input name="orderInHomeCurated" type="number" defaultValue={initialData?.orderInHomeCurated || 0} className="h-8 w-20 text-xs" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

