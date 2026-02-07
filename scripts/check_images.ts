import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const pcProduct = await prisma.product.findFirst({
        where: { name: { contains: 'PC' } },
    });

    if (pcProduct) {
        console.log('Images JSON:', pcProduct.images);
        try {
            const images = JSON.parse(pcProduct.images);
            console.log('Parsed Image 0:', images[0]);
        } catch (e) {
            console.log('Failed to parse images JSON');
        }
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
