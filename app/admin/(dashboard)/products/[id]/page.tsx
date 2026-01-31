
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>
}

export default async function EditProductPage(props: EditProductPageProps) {
    const params = await props.params;

    const [product, categories] = await Promise.all([
        prisma.product.findUnique({
            where: { id: params.id },
        }),
        prisma.category.findMany()
    ]);

    if (!product) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Edit Product</h1>
                <p className="text-zinc-400">Update product details.</p>
            </div>

            <ProductForm
                categories={categories}
                initialData={{
                    ...product,
                    price: product.price.toNumber(), // Convert Decimal to number
                    stock: product.stock,
                    // Ensure nulls are handled if necessary, though the interface allows nulls for optional fields
                }}
            />
        </div>
    );
}
