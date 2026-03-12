import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Categories
    const categories = [
        { name: "العبايات", slug: "abayas" },
        { name: "فساتين و الجلابيات", slug: "dresses-jalabiyas" },
        { name: "رجالي", slug: "men" },
        { name: "عطور و بخور و دهن عود", slug: "perfumes-oud" },
        { name: "أطفال", slug: "kids" },
        { name: "مجوهرات", slug: "jewelry" },
        { name: "اكسسوارات", slug: "accessories" }
    ];

    console.log("Updating categories...");
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name },
            create: { name: cat.name, slug: cat.slug }
        });
    }

    // 2. Brands (Example list)
    const brands = [
        "Local Bazar",
        "Elegance",
        "Heritage",
        "Oud Master",
        "Golden Touch"
    ];

    console.log("Updating brands...");
    for (const brandName of brands) {
        const slug = brandName.toLowerCase().replace(/ /g, '-');
        await (prisma as any).brand.upsert({
            where: { slug },
            update: { name: brandName },
            create: { name: brandName, slug }
        });
    }

    console.log("Seed complete.");
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
