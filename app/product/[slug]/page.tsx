import { getProductBySlug, getAllProducts } from "@/lib/actions/product";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";
import JsonLd from "@/components/store/JsonLd";

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
        images = ["https://images.unsplash.com/photo-1594932224036-9c205771abb6?q=80&w=1000"];
    }

    if (images.length === 0) {
        images = ["https://images.unsplash.com/photo-1594932224036-9c205771abb6?q=80&w=1000"];
    }

    // Product is already partially serialized by getProductBySlug
    const serializedProduct = {
        ...product,
    };

    // Infer category if missing (Fashion focus)
    let catToFetch = product.categoryId || product.category?.slug;
    if (!catToFetch) {
        const n = product.name.toLowerCase();
        if (n.includes('couture') || n.includes('robe') || n.includes('dress')) catToFetch = 'evening-wear';
        else if (n.includes('tailleur') || n.includes('suit') || n.includes('costume')) catToFetch = 'suits';
        else if (n.includes('héritage') || n.includes('traditional') || n.includes('heritage')) catToFetch = 'traditional';
        else if (n.includes('accessoire') || n.includes('sac') || n.includes('bag')) catToFetch = 'accessories';
        else catToFetch = undefined; 
    }

    // Fetch similar products
    const allSimilar = await getAllProducts(catToFetch);

    // Scramble the identical array so identical products aren't always in identical position
    const shuffledSimilar = allSimilar;

    // Filter out the current product and take only first 5
    const similarProducts = shuffledSimilar
        .filter((p: any) => p.id !== product.id)
        .slice(0, 5)
        .map((p: any) => {
            let pImages: string[] = [];
            try {
                if (p.images && p.images.startsWith('[')) {
                    pImages = JSON.parse(p.images);
                } else if (p.images) {
                    pImages = [p.images];
                }
            } catch {
                pImages = ["https://images.unsplash.com/photo-1594932224036-9c205771abb6?q=80&w=1000"];
            }

            return {
                ...p,
                image: pImages.length > 0 ? pImages[0] : "https://images.unsplash.com/photo-1594932224036-9c205771abb6?q=80&w=1000"
            };
        });

    // structured data for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": images,
        "description": product.description,
        "sku": (product as any).sku || product.id,
        "brand": {
            "@type": "Brand",
            "name": product.brandName || "Local Bazar"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://localbazar.com/product/${product.slug}`,
            "priceCurrency": "QAR",
            "price": Number(product.price),
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        }
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <ProductPageClient product={serializedProduct} images={images} similarProducts={similarProducts} />
        </>
    );
}
