import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewProductPage() {
    const categories = await prisma.category.findMany();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/products">
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Add New Product</h1>
                    <p className="text-muted-foreground text-sm">Create a new item in your inventory.</p>
                </div>
            </div>

            <ProductForm categories={categories} />
        </div>
    );
}
