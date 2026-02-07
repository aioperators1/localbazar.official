import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const pcProduct = await prisma.product.findFirst({
        where: { name: { contains: 'PC' } },
        include: { category: true }
    });

    if (pcProduct) {
        console.log('PC Product:', pcProduct.name);
        console.log('Brand:', pcProduct.brand);
        console.log('Specs:', pcProduct.specs);
    } else {
        console.log('No PC product found yet.');
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
