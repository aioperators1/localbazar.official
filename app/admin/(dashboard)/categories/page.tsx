import { getAdminCategories } from "@/lib/actions/admin";
import { CategoryList } from "@/components/admin/CategoryList";
import { Button } from "@/components/ui/button";
import { Plus, FolderTree } from "lucide-react";
import Link from "next/link";

export default async function AdminCategoriesPage() {
    const categories = await getAdminCategories();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-[#303030]">Collections</h1>
                    <Button asChild className="bg-black text-white hover:bg-[#303030] h-9 rounded-[8px] px-4 font-bold text-[13px]">
                        <Link href="/admin/categories/new" className="flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add collection
                        </Link>
                    </Button>
                </div>
            </div>

            <CategoryList categories={categories} />
        </div>
    );
}
