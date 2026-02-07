
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking database counts...');

    const total = await prisma.product.count();
    console.log(`Total Products: ${total}`);

    const byCategory = await prisma.product.groupBy({
        by: ['categoryId'],
        _count: {
            id: true
        }
    });

    console.log('Products by Category ID:');
    for (const group of byCategory) {
        if (!group.categoryId) {
            console.log(`- null: ${group._count.id}`);
            continue;
        }
        const cat = await prisma.category.findUnique({ where: { id: group.categoryId } });
        console.log(`- ${cat?.name} (${cat?.slug}): ${group._count.id}`);
    }

    const featured = await prisma.product.count({ where: { featured: true } });
    console.log(`Featured Products: ${featured}`);

    const approved = await prisma.product.count({ where: { status: 'APPROVED' } });
    console.log(`Approved Products: ${approved}`);

    const latest = await prisma.product.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { name: true, category: { select: { name: true } } }
    });
    console.log('Latest Products:');
    latest.forEach(p => console.log(`- [${p.category?.name}] ${p.name}`));
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
