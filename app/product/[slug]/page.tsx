import { getProductBySlug, getAllProducts } from "@/lib/actions/product";
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

    // Infer category if missing
    let catToFetch = product.categoryId || product.category?.slug;
    if (!catToFetch) {
        const n = product.name.toLowerCase();
        if (n.includes('pc gamer')) catToFetch = 'pc-gamer';
        else if (n.includes('rtx') || n.includes('rx ') || n.includes('geforce') || n.includes('radeon') || n.includes('gpu')) catToFetch = 'cartes-graphiques';
        else if (n.includes('ryzen') || n.includes('intel core') || n.includes('processeur')) catToFetch = 'processeurs';
        else if (n.includes('carte mère') || n.includes('b650') || n.includes('x670') || n.includes('z790') || n.includes('motherboard')) catToFetch = 'cartes-meres';
        else if (n.includes('ssd') || n.includes('ram') || n.includes('ddr5') || n.includes('grizzly') || n.includes('thermal')) catToFetch = 'composants';
        else if (n.includes('souris') || n.includes('clavier') || n.includes('casque') || n.includes('razer')) catToFetch = 'peripheriques';
        else if (n.includes('desk') || n.includes('bureau') || n.includes('cockpit') || n.includes('skilldesk')) catToFetch = 'chaises-bureaux';
        else if (n.includes('ecran') || n.includes('monitor') || n.includes('msi mag')) catToFetch = 'ecrans';
        else if (n.includes('portable') || n.includes('laptop')) catToFetch = 'pc-portable';
        else catToFetch = undefined; // Fallback to all if really can't figure it out
    }

    // Fetch similar products
    const allSimilar = await getAllProducts(catToFetch);

    // Scramble the identical array so identical products aren't always in identical position
    const shuffledSimilar = [...allSimilar].sort(() => 0.5 - Math.random());

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
                pImages = ["https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000"];
            }

            return {
                ...p,
                image: pImages.length > 0 ? pImages[0] : "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000"
            };
        });

    return <ProductPageClient product={serializedProduct} images={images} similarProducts={similarProducts} />;
}
