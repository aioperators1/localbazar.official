import { getAdminCategories } from "@/lib/actions/admin";
import CategoryForm from "@/components/admin/CategoryForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const categories = await getAdminCategories();
    const { id } = await params;
    
    const category = await prisma.category.findUnique({
        where: { id }
    });

    if (!category) notFound();

    const serializedCategory = {
        ...category,
        createdAt: category.createdAt.toISOString()
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-[#303030]">{category.name}</h1>
                </div>
            </div>

            <CategoryForm initialData={serializedCategory} categories={categories} />
        </div>
    );
}
