import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewProductPage() {
    const rawCategories = await prisma.category.findMany({
        include: { parent: true },
        orderBy: { name: 'asc' }
    });

    const categories = rawCategories.map(cat => ({
        ...cat,
        createdAt: cat.createdAt.toISOString(),
        parent: cat.parent ? {
            ...cat.parent,
            createdAt: cat.parent.createdAt.toISOString()
        } : null
    }));

    return (
        <div className="space-y-6">
            {/* Shopify-style Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild className="h-8 w-8 rounded-[8px] border-[#D2D2D2] bg-white text-[#303030] hover:bg-[#F1F1F1]">
                            <Link href="/admin/products">
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        </Button>
                        <h1 className="text-xl font-bold text-[#303030]">Add product</h1>
                    </div>
                </div>
            </div>

            <ProductForm categories={categories} />
        </div>
    );
}
