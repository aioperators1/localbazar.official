import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductList } from "@/components/admin/ProductList";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Products</h1>
                    <p className="text-muted-foreground mt-1">Manage your storefront inventory.</p>
                </div>
                <Button asChild className="gap-2">
                    <Link href="/admin/products/new">
                        <Plus className="w-4 h-4" /> Add Product
                    </Link>
                </Button>
            </div>

            <ProductList products={products.map(p => ({
                id: p.id,
                name: p.name,
                images: p.images,
                category: { name: p.category.name },
                price: Number(p.price),
                stock: p.stock
            }))} />
        </div>
    );
}
