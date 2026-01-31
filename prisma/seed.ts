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

    // 2. Create Products
    const products = [
        {
            name: 'Razer Blade 16',
            slug: 'razer-blade-16',
            description: 'The world\'s first dual-mode mini-LED display. Equipped with RTX 4090.',
            price: 32990,
            stock: 10,
            images: JSON.stringify(['https://images.unsplash.com/photo-1624705002806-5d72df19c2ba?q=80&w=1000']),
            categoryId: laptops.id,
            brand: 'Razer',
            featured: true
        },
        {
            name: 'MacBook Pro M3 Max',
            slug: 'macbook-pro-m3-max',
            description: 'Mind-blowing standard. M3 Max chip. Up to 22 hours battery life.',
            price: 45900,
            stock: 15,
            images: JSON.stringify(['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000']),
            categoryId: laptops.id,
            brand: 'Apple',
            featured: true
        },
        {
            name: 'RTX 4090 SUPRIM X',
            slug: 'rtx-4090-suprim-x',
            description: 'The ultimate consumer graphics card. 24GB G6X memory.',
            price: 24900,
            stock: 5,
            images: JSON.stringify(['https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1000']),
            categoryId: components.id,
            brand: 'MSI',
            featured: true
        },
        {
            name: 'Logitech G Pro X 2',
            slug: 'logitech-g-pro-x-2',
            description: 'The new standard for gaming audio. Graphene drivers.',
            price: 1890,
            stock: 50,
            images: JSON.stringify(['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1000']),
            categoryId: audio.id,
            brand: 'Logitech',
            featured: false
        },
        {
            name: 'Keychron Q1 Pro',
            slug: 'keychron-q1-pro',
            description: 'Wireless QMK/VIA custom mechanical keyboard.',
            price: 2200,
            stock: 20,
            images: JSON.stringify(['https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000']),
            categoryId: peripherals.id,
            brand: 'Keychron',
            featured: false
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
