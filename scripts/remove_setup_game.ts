    
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning "Setup Game" from database...');

    // 1. Update Brand
    const brandUpdate = await prisma.product.updateMany({
        where: { brand: 'Setup Game' },
        data: { brand: 'Generic' }
    });
    console.log(`Updated ${brandUpdate.count} products from brand "Setup Game" to "Generic".`);

    // 2. Remove "Setup Game" from Names
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: 'Setup Game' } },
                { description: { contains: 'Setup Game' } }
            ]
        }
    });

    console.log(`Found ${products.length} products with "Setup Game" in name or description.`);

    for (const p of products) {
        const newName = p.name.replace(/Setup Game/gi, '').trim();
        const newDesc = p.description.replace(/Setup Game/gi, 'ElectroSilam').trim();

        await prisma.product.update({
            where: { id: p.id },
            data: {
                name: newName || "Gaming PC", // Fallback if name becomes empty
                description: newDesc
            }
        });
        console.log(`Cleaned: ${p.name} -> ${newName}`);
    }

    console.log('Cleanup complete.');
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
