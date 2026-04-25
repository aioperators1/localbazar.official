"use client";

import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AdminCategory {
    id: string;
    name: string;
    nameAr?: string | null;
    slug: string;
    parent?: { name: string, nameAr?: string | null } | null;
    _count: { products: number };
    showInHomeTabs: boolean;
    showInHomeCurated: boolean;
}

export function CategoryList({ categories }: { categories: AdminCategory[] }) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        const res = await deleteCategory(id);
        if (res.success) {
            toast.success("Category deleted");
            router.refresh();
        } else {
            toast.error("Failed to delete category");
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="py-4 px-6 font-bold text-gray-700">Category Name</th>
                        <th className="py-4 px-6 font-bold text-gray-700">Slug</th>
                        <th className="py-4 px-6 font-bold text-gray-700">Parent</th>
                        <th className="py-4 px-6 font-bold text-gray-700 text-center">Products</th>
                        <th className="py-4 px-6 font-bold text-gray-700">Home Visibility</th>
                        <th className="py-4 px-6 text-right font-bold text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-6">
                                <div className="flex flex-col">
                                    <span className="font-bold text-black">{cat.name}</span>
                                    {cat.nameAr && (
                                        <span className="text-gray-400 text-xs font-medium" dir="rtl">{cat.nameAr}</span>
                                    )}
                                </div>
                            </td>
                            <td className="py-4 px-6">
                                <code className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs leading-relaxed">
                                    /{cat.slug}
                                </code>
                            </td>
                            <td className="py-4 px-6">
                                {cat.parent ? (
                                    <span className="text-xs font-bold text-gray-600 px-2 py-1 bg-gray-100 rounded">
                                        {cat.parent.name}
                                    </span>
                                ) : (
                                    <span className="text-gray-300 text-xs font-bold uppercase tracking-widest">Master</span>
                                )}
                            </td>
                            <td className="py-4 px-6 text-center">
                                <span className="font-bold text-black">{cat._count.products}</span>
                            </td>
                            <td className="py-4 px-6">
                                <div className="flex flex-wrap gap-2">
                                    {cat.showInHomeTabs && (
                                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-100 uppercase">Tabs</span>
                                    )}
                                    {cat.showInHomeCurated && (
                                        <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded border border-blue-100 uppercase">Curated</span>
                                    )}
                                    {!cat.showInHomeTabs && !cat.showInHomeCurated && (
                                        <span className="text-gray-300 text-[10px] font-bold uppercase italic">Internal</span>
                                    )}
                                </div>
                            </td>
                            <td className="py-4 px-6 text-right">
                                <div className="flex gap-2 justify-end">
                                    <Button variant="outline" size="icon" asChild className="h-9 w-9 border-gray-200">
                                        <Link href={`/admin/categories/${cat.id}`}>
                                            <Pencil className="w-4 h-4 text-gray-600" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleDelete(cat.id)}
                                        className="h-9 w-9 border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {categories.length === 0 && (
                        <tr>
                            <td colSpan={6} className="py-20 text-center text-gray-400 italic">
                                No categories found. 
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

