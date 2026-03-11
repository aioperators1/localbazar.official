import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Clean up existing data (optional, but good for idempotency)
    // await prisma.orderItem.deleteMany()
    // await prisma.order.deleteMany()
    // await prisma.review.deleteMany()
    // await prisma.product.deleteMany()
    // await prisma.category.deleteMany()

    // 0. Create Admin User
    // 0. Create Admin User
    const password = await hash('electrolwfjwn12381nd', 12)
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {
            password,
            role: 'ADMIN',
            email: 'admin@electro-islam.com'
        },
        create: {
            email: 'admin@electro-islam.com',
            name: 'Admin User',
            password,
            role: 'ADMIN',
            username: 'admin'
        }
    })
    console.log({ admin })

    // 1. Create Categories
    const laptops = await prisma.category.upsert({
        where: { slug: 'laptops' },
        update: {},
        create: { name: 'Laptops', slug: 'laptops', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000' }
    })

    const components = await prisma.category.upsert({
        where: { slug: 'components' },
        update: {},
        create: { name: 'Components', slug: 'components', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1000' }
    })

    const audio = await prisma.category.upsert({
        where: { slug: 'audio' },
        update: {},
        create: { name: 'Audio', slug: 'audio', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000' }
    })

    const peripherals = await prisma.category.upsert({
        where: { slug: 'peripherals' },
        update: {},
        create: { name: 'Peripherals', slug: 'peripherals', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000' }
    })
    const monitors = await prisma.category.upsert({
        where: { slug: 'monitors' },
        update: {},
        create: { name: 'Monitors', slug: 'monitors', image: 'https://techspace.ma/cdn/shop/files/MSIMAG274QF_1000x.png' }
    })

    const pcgamer = await prisma.category.upsert({
        where: { slug: 'pc-gamer' },
        update: {},
        create: { name: 'PC Gamer', slug: 'pc-gamer', image: 'https://techspace.ma/cdn/shop/files/PCGAMER01.10.2025_d84ff562-927d-4ea8-990f-3f64463a7b0c_1000x.png' }
    })
    // 2. Create Products
    const products = [
        {
            name: 'MSI Modern 14 C13M',
            slug: 'msi-modern-14-c13m',
            description: 'Compact et puissant, parfait pour la productivité. i5-1335U/8GB.',
            price: 5490,
            stock: 12,
            images: JSON.stringify(['https://techspace.ma/cdn/shop/files/MSIModern14C13M-1450MA_b7e596e5-8d0f-4001-bc71-6826d299d563_1000x.png']),
            categoryId: laptops.id,
            brand: 'MSI',
            featured: true
        },
        {
            name: 'PC Gamer Techspace R7',
            slug: 'pc-gamer-techspace-r7',
            description: 'Une bête de course pour le gaming 4K. R7 5700X/512GB.',
            price: 12990,
            stock: 8,
            images: JSON.stringify(['https://techspace.ma/cdn/shop/files/PCGAMER01.10.2025_d84ff562-927d-4ea8-990f-3f64463a7b0c_1000x.png']),
            categoryId: pcgamer.id,
            brand: 'Techspace',
            featured: true
        },
        {
            name: 'MSI MAG 274QF 2K',
            slug: 'msi-mag-274qf-2k',
            description: '27" Fast IPS 180Hz 2K pour une fluidité extrême.',
            price: 4200,
            stock: 20,
            images: JSON.stringify(['https://techspace.ma/cdn/shop/files/MSIMAG274QF_1000x.png']),
            categoryId: monitors.id,
            brand: 'MSI',
            featured: true
        },
        {
            name: 'RTX 5070 WINDFORCE',
            slug: 'rtx-5070-windforce',
            description: 'La nouvelle génération de puissance graphique.',
            price: 9900,
            stock: 15,
            images: JSON.stringify(['https://techspace.ma/cdn/shop/files/GigabyteGeForceRTX5070WINDFORCEOCSFF12G_EXCLUSIVITEWEB_1000x.png']),
            categoryId: components.id,
            brand: 'Gigabyte',
            featured: true
        }
    ]

    for (const p of products) {
        const exists = await prisma.product.findUnique({ where: { slug: p.slug } })
        if (!exists) {
            await prisma.product.create({ data: p })
        }
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
