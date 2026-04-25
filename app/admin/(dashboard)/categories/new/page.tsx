import { getAdminCategories } from "@/lib/actions/admin";
import CategoryForm from "@/components/admin/CategoryForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function NewCategoryPage() {
    const categories = await getAdminCategories();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-[#303030]">Create collection</h1>
                </div>
            </div>

            <CategoryForm categories={categories} />
        </div>
    );
}
