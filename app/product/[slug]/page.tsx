import { getProductBySlug } from "@/lib/actions/product";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            title: "Product Not Found",
        };
    }

    // Parse image if it's a JSON array
    let mainImage = product.images;
    try {
        if (mainImage && mainImage.startsWith('[')) {
            const parsed = JSON.parse(mainImage);
            mainImage = parsed[0];
        }
    } catch {
        // Fallback
    }

    return {
        title: product.name,
        description: product.description.substring(0, 160),
        openGraph: {
            title: product.name,
            description: product.description.substring(0, 160),
            images: mainImage ? [mainImage] : [],
        },
    };
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    // Parse images
    let images: string[] = [];
    try {
        if (product.images && product.images.startsWith('[')) {
            images = JSON.parse(product.images);
        } else if (product.images) {
            images = [product.images];
        }
    } catch {
        images = ["https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000"];
    }

    if (images.length === 0) {
        images = ["https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000"];
    }

    // Product is already partially serialized by getProductBySlug
    const serializedProduct = {
        ...product,
    };

    return <ProductPageClient product={serializedProduct} images={images} />;
}
