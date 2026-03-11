"use client";

import { Pencil, Trash, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AdminCategory {
    id: string;
    name: string;
    slug: string;
    parent?: { name: string } | null;
    _count: { products: number };
}

export function CategoryList({ categories }: { categories: AdminCategory[] }) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this collection?")) return;

        const res = await deleteCategory(id);
        if (res.success) {
            toast.success("Collection removed");
            router.refresh();
        } else {
            toast.error("Failed to remove collection");
        }
    };

    return (
        <div className="bg-white rounded-[12px] border border-[#E3E3E3] shadow-sm overflow-hidden">
            <table className="w-full text-left text-[13px] border-collapse">
                <thead className="bg-[#f6f6f6] border-b border-[#E3E3E3]">
                    <tr>
                        <th className="p-3 pl-4 font-semibold text-[#303030]">Collection</th>
                        <th className="p-3 font-semibold text-[#303030]">Slug</th>
                        <th className="p-3 font-semibold text-[#303030]">Parent</th>
                        <th className="p-3 font-semibold text-[#303030]">Products</th>
                        <th className="p-3 text-right pr-4 font-semibold text-[#303030]">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E3E3]">
                    {categories.map((cat) => (
                        <tr key={cat.id} className="group hover:bg-[#F9F9F9] transition-colors">
                            <td className="p-3 pl-4">
                                <span className="font-bold text-[#303030]">{cat.name}</span>
                            </td>
                            <td className="p-3">
                                <span className="text-[#616161] font-mono text-[11px]">{cat.slug}</span>
                            </td>
                            <td className="p-3">
                                {cat.parent ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium bg-[#E3F2FD] text-[#0D47A1]">
                                        {cat.parent.name}
                                    </span>
                                ) : (
                                    <span className="text-[#616161] text-[12px]">Root</span>
                                )}
                            </td>
                            <td className="p-3">
                                <span className="text-[#616161] font-medium">{cat._count.products} Products</span>
                            </td>
                            <td className="p-3 pr-4 text-right">
                                <div className="flex gap-2 justify-end">
                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-[#616161] hover:bg-[#E3E3E3] rounded-[6px]">
                                        <Link href={`/admin/categories/${cat.id}`}>
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(cat.id)}
                                        className="h-8 w-8 text-[#616161] hover:text-rose-600 hover:bg-rose-50 rounded-[6px]"
                                    >
                                        <Trash className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {categories.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-12 text-center text-[#616161] font-medium">
                                No collections found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
