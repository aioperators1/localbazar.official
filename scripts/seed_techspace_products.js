const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();
const data = require(path.join(__dirname, '../techspace_products.js'));

async function main() {
    console.log(`Loading ${data.length} products from techspace_products.js...`);

    // Categories should already exist from seed.ts, but let's make sure
    const laptopsCat = await prisma.category.findUnique({ where: { slug: 'laptops' } }) || await prisma.category.create({ data: { name: 'Laptops', slug: 'laptops' } });
    const componentsCat = await prisma.category.findUnique({ where: { slug: 'components' } }) || await prisma.category.create({ data: { name: 'Components', slug: 'components' } });
    const peripheralsCat = await prisma.category.findUnique({ where: { slug: 'peripherals' } }) || await prisma.category.create({ data: { name: 'Peripherals', slug: 'peripherals' } });
    const monitorsCat = await prisma.category.findUnique({ where: { slug: 'monitors' } }) || await prisma.category.create({ data: { name: 'Monitors', slug: 'monitors' } });
    const pcgamerCat = await prisma.category.findUnique({ where: { slug: 'pc-gamer' } }) || await prisma.category.create({ data: { name: 'PC Gamer', slug: 'pc-gamer' } });

    const catMap = {
        'pc-gamer': pcgamerCat.id,
        'ecrans': monitorsCat.id,
        'peripheriques': peripheralsCat.id,
        'pc-portable': laptopsCat.id,
        'composants': componentsCat.id
    };

    let addedCount = 0;

    for (const p of data) {
        // categoryId in json is a slug like "composants"
        let catId = catMap[p.categoryId] || componentsCat.id;

        const exists = await prisma.product.findUnique({ where: { slug: p.slug } });
        if (!exists) {
            await prisma.product.create({
                data: {
                    name: p.name,
                    slug: p.slug,
                    description: p.description,
                    price: p.price,
                    stock: p.stock || 15,
                    images: p.images, // It's already JSON stringified in techspace_products.js
                    categoryId: catId,
                    brand: p.brand || "Techspace",
                    featured: p.featured || true,
                }
            });
            addedCount++;
        }
    }

    console.log(`Added ${addedCount} products!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
