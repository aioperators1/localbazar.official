import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";
import { ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>
}

export default async function EditProductPage(props: EditProductPageProps) {
    const params = await props.params;

    const prismaAny = prisma as any;
    const [product, categories, brands] = await Promise.all([
        prisma.product.findUnique({
            where: { id: params.id },
        }),
        prismaAny.category.findMany({
            include: { parent: true },
            orderBy: { name: 'asc' }
        }),
        prismaAny.brand.findMany({
            orderBy: { name: 'asc' }
        })
    ]);

    if (!product) {
        notFound();
    }

    const serializedProduct = {
        ...product,
        price: product.price.toNumber(),
        salePrice: product.salePrice ? product.salePrice.toNumber() : null,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
    };

    const serializedCategories = categories.map((cat: any) => ({
        ...cat,
        createdAt: cat.createdAt.toISOString(),
        parent: cat.parent ? {
            ...cat.parent,
            createdAt: cat.parent.createdAt.toISOString()
        } : null
    }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild className="h-8 w-8 rounded-[8px] border-[#D2D2D2] bg-white text-[#303030] hover:bg-[#F1F1F1]">
                            <Link href="/admin/products">
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        </Button>
                        <h1 className="text-xl font-bold text-[#303030]">{product.name}</h1>
                    </div>
                </div>
            </div>

            <ProductForm
                categories={serializedCategories}
                brands={brands}
                initialData={serializedProduct}
            />
        </div>
    );
}
