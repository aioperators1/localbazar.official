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

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const name = formData.get("name") as string;
        const data = {
            name,
            slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            image: formData.get("image") as string,
            parentId: formData.get("parentId") as string,
            description: formData.get("description") as string,
            featured: formData.get("featured") === "on",
        };

        let res;
        if (initialData?.id) {
            res = await updateCategory(initialData.id, data);
        } else {
            res = await createCategory(data);
        }

        if (res.success) {
            toast.success(initialData ? "Collection updated" : "Collection created");
            router.push("/admin/categories");
            router.refresh();
        } else {
            toast.error("Error saving collection");
        }
        setLoading(false);
    }

    return (
        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pb-20">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[12px] border border-[#E3E3E3] shadow-sm p-5 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-[13px] font-medium text-[#303030]">Title</Label>
                        <Input
                            id="name"
                            name="name"
                            required
                            defaultValue={initialData?.name}
                            placeholder="e.g. Summer Collection"
                            className="bg-white border-[#D2D2D2] text-[13px] h-9 rounded-[8px] focus:ring-1 focus:ring-black"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-[13px] font-medium text-[#303030]">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={initialData?.description || ""}
                            placeholder="Describe this collection for the customer..."
                            className="bg-white border-[#D2D2D2] text-[13px] min-h-[100px] rounded-[8px] focus:ring-1 focus:ring-black resize-none"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[12px] border border-[#E3E3E3] shadow-sm p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-[13px] font-medium text-[#303030]">Collection image</Label>
                    </div>
                    <div className="border-2 border-dashed border-[#D2D2D2] rounded-[8px] p-8 flex flex-col items-center justify-center text-center space-y-4 hover:bg-[#F9F9F9] transition-colors cursor-pointer group">
                        <Input 
                            id="image" 
                            name="image" 
                            defaultValue={initialData?.image || ""}
                            placeholder="Paste Image URL here..."
                            className="text-[12px] h-8 max-w-xs text-center border-none shadow-none focus:ring-0 bg-transparent"
                        />
                        <div className="flex gap-4">
                            <Button type="button" variant="secondary" className="h-8 text-[12px] bg-white border-[#D2D2D2] hover:bg-[#F1F1F1] rounded-[6px] shadow-sm">
                                Upload image
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                <div className="bg-white rounded-[12px] border border-[#E3E3E3] shadow-sm p-4 space-y-4">
                    <Label className="text-[13px] font-semibold text-[#303030]">Category organization</Label>
                    <div className="space-y-2">
                        <Label htmlFor="parentId" className="text-[12px] text-[#616161]">Parent collection</Label>
                        <select
                            id="parentId"
                            name="parentId"
                            defaultValue={initialData?.parentId || ""}
                            className="w-full h-9 bg-white border border-[#D2D2D2] rounded-[8px] px-3 text-[13px] focus:ring-1 focus:ring-black outline-none appearance-none"
                        >
                            <option value="">No parent (Root)</option>
                            {categories.filter(c => c.id !== initialData?.id).map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <Label className="text-[12px] text-[#616161]">Featured collection</Label>
                        <Switch name="featured" defaultChecked={initialData?.featured} />
                    </div>
                </div>

                <div className="pt-4 border-t border-[#E3E3E3]">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 bg-black text-white hover:bg-[#303030] rounded-[8px] font-bold text-[14px] transition-all"
                    >
                        {loading ? "Saving..." : (initialData ? "Save collection" : "Create collection")}
                    </Button>
                    <div className="mt-4 flex justify-center">
                       <Link href="/admin/categories" className="text-[12px] text-rose-600 font-bold hover:underline">
                          Discard
                       </Link>
                    </div>
                </div>
            </div>
        </form>
    );
}
