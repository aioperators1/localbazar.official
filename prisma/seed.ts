import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database for Local Bazar Doha Hub...')

    // 0. Create Management Hierarchy
    const defaultPassword = await hash('localbazaraio', 12)
    
    // Super Admin (Boutique Core Control)
    await prisma.user.upsert({
        where: { username: 'superadmin' },
        update: { password: defaultPassword, role: 'SUPER_ADMIN', email: 'super@localbazar.com' },
        create: {
            email: 'super@localbazar.com',
            name: 'Super Admin',
            password: defaultPassword,
            role: 'SUPER_ADMIN',
            username: 'superadmin'
        }
    })

    // Admin (Store Management)
    await prisma.user.upsert({
        where: { username: 'admin' },
        update: { password: defaultPassword, role: 'ADMIN', email: 'admin@localbazar.com' },
        create: {
            email: 'admin@localbazar.com',
            name: 'Store Admin',
            password: defaultPassword,
            role: 'ADMIN',
            username: 'admin'
        }
    })

    // Manager (Operations Management)
    await prisma.user.upsert({
        where: { username: 'manager' },
        update: { password: defaultPassword, role: 'MANAGER', email: 'manager@localbazar.com' },
        create: {
            email: 'manager@localbazar.com',
            name: 'Operations Manager',
            password: defaultPassword,
            role: 'MANAGER',
            username: 'manager'
        }
    })

    // Staff (Floor/Concierge Staff)
    await prisma.user.upsert({
        where: { username: 'staff' },
        update: { password: defaultPassword, role: 'STAFF', email: 'staff@localbazar.com' },
        create: {
            email: 'staff@localbazar.com',
            name: 'Concierge Staff',
            password: defaultPassword,
            role: 'STAFF',
            username: 'staff'
        }
    })
    console.log('Management hierarchy seeded.')

    // 1. Create Luxury Categories (Doha Hub Style)
    const categories = [
        { name: 'Abayas', slug: 'abayas', image: 'https://images.unsplash.com/photo-1585487000160-afffbfc767ab?q=80&w=1200' },
        { name: 'Dresses & Jalabiyas', slug: 'dresses-jalabiyas', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200' },
        { name: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1594932224036-9c205771abb6?q=80&w=1200' },
        { name: 'Perfumes & Oud', slug: 'perfumes-oud', image: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=1200' },
        { name: 'Jewelry', slug: 'jewelry', image: 'https://images.unsplash.com/photo-1610812383719-38379010461f?q=80&w=1200' },
        { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=1200' }
    ]

    const seededCategories = []
    for (const cat of categories) {
        const c = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name, image: cat.image },
            create: cat
        })
        seededCategories.push(c)
    }
    console.log('Categories seeded.')

    // 2. Create Luxury Products
    const products = [
        {
            name: "Velvet Couture Abaya",
            slug: 'velvet-couture-abaya',
            description: "A signature piece of Doha elegance. Crafted from premium Italian velvet with gold thread embroidery.",
            price: 4500,
            stock: 5,
            images: JSON.stringify(['https://images.unsplash.com/photo-1585487000160-afffbfc767ab?q=80&w=1200']),
            categoryId: seededCategories.find(c => c.slug === 'abayas')?.id || '',
            brandName: 'Local Bazar Signature',
            featured: true
        },
        {
            name: "Silk Jalabiya 'Midnight Bloom'",
            slug: 'silk-jalabiya-midnight',
            description: "Hand-painted silk jalabiya featuring floral patterns for exclusive evenings.",
            price: 3200,
            stock: 3,
            images: JSON.stringify(['https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200']),
            categoryId: seededCategories.find(c => c.slug === 'dresses-jalabiyas')?.id || '',
            brandName: 'Local Bazar Couture',
            featured: true
        },
        {
            name: "Oud Royale Extrait",
            slug: 'oud-royale-extrait',
            description: "Pure Cambodian Oud aged for 20 years. A fragrance for the true connoisseur.",
            price: 1800,
            stock: 12,
            images: JSON.stringify(['https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=1200']),
            categoryId: seededCategories.find(c => c.slug === 'perfumes-oud')?.id || '',
            brandName: 'Local Bazar Parfums',
            featured: true
        }
    ]

    for (const p of products) {
        if (!p.categoryId) continue
        await prisma.product.upsert({
            where: { slug: p.slug },
            update: { 
                ...p,
                price: Number(p.price)
            },
            create: {
                ...p,
                price: Number(p.price)
            }
        })
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
