"use server";

import { prisma } from "@/lib/prisma";

// FALLBACK DATA FOR ROBUSTNESS (When DB is unreachable)
const FALLBACK_PRODUCTS = [
  {
    id: 'fashion-001',
    name: "Robe du Soir 'Midnight' en Soie",
    slug: 'robe-soir-midnight-soie',
    description: "Une pièce maîtresse de notre collection Couture. Cette robe longue en soie sauvage capte la lumière avec une élégance mystérieuse. Silhouette fluide et finitions main.",
    price: 12500.00,
    stock: 3,
    inStock: true,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200'
    ]),
    featured: true,
    categoryId: 'evening-wear',
    category: { id: 'evening-wear', name: 'Couture', slug: 'evening-wear' },
    brand: "Local Bazar Couture",
    sizes: JSON.stringify(["36", "38", "40", "42"]),
    colors: JSON.stringify([
      { name: "Burgundy", hex: "#592C2F" },
      { name: "Midnight Black", hex: "#0a0a0a" }
    ]),
    materials: "100% Soie de Milan",
    careInstructions: "Nettoyage à sec uniquement. Manipuler avec soin.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true },
      include: { category: true },
      take: 8,
      orderBy: { createdAt: 'desc' }
    });
    if (products.length > 0) {
      return products.map(p => ({
        ...p,
        price: Number(p.price),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString()
      }));
    }
    return FALLBACK_PRODUCTS.filter(p => p.featured).slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return FALLBACK_PRODUCTS.filter(p => p.featured).slice(0, 4);
  }
}

export async function getAllProducts(
  categorySlug?: string,
  search?: string,
  filter?: string,
  minPrice?: number,
  maxPrice?: number,
  sort?: string
) {
  try {
    const where: any = {};

    if (categorySlug) {
      where.OR = [
        { categoryId: categorySlug },
        { category: { slug: categorySlug } }
      ];
    }

    if (search) {
      where.OR = [
        ...(where.OR || []),
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }

    if (filter === 'instock') {
      where.stock = { gt: 0 };
      where.inStock = true;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy
    });

    if (products.length > 0) {
      return products.map(p => ({
        ...p,
        price: Number(p.price),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        category: p.category ? {
          ...p.category,
          createdAt: p.category.createdAt.toISOString()
        } : null
      }));
    }

    if (categorySlug || search) return [];
    return FALLBACK_PRODUCTS;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return FALLBACK_PRODUCTS;
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    if (categories.length > 0) {
       return categories.map(c => ({
         ...c,
         createdAt: c.createdAt.toISOString()
       }));
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
  
  return [
    { id: 'evening-wear', name: 'Couture', slug: 'evening-wear', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200', parentId: null, createdAt: new Date().toISOString() },
    { id: 'suits', name: 'Tailleur', slug: 'suits', image: 'https://images.unsplash.com/photo-1594932224036-9c205771abb6?q=80&w=1200', parentId: null, createdAt: new Date().toISOString() },
    { id: 'traditional', name: 'Héritage', slug: 'traditional', image: 'https://images.unsplash.com/photo-1618333234972-62295c846ba8?q=80&w=1200', parentId: null, createdAt: new Date().toISOString() },
    { id: 'accessories', name: 'Accessoires', slug: 'accessories', image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=1200', parentId: null, createdAt: new Date().toISOString() },
    { id: 'essences', name: 'Parfums', slug: 'essences', image: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=1200', parentId: null, createdAt: new Date().toISOString() },
    { id: 'new-arrivals', name: 'Nouveautés', slug: 'new-arrivals', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200', parentId: null, createdAt: new Date().toISOString() }
  ];
}

export async function getProductById(id: string) {
  try {
    const p = await prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });
    if (p) {
      return {
        ...p,
        price: Number(p.price),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        category: p.category ? {
          ...p.category,
          createdAt: p.category.createdAt.toISOString()
        } : null
      };
    }
  } catch (error) {
    console.error("Failed to fetch product by id:", error);
  }
  return FALLBACK_PRODUCTS.find(p => p.id === id) || null;
}

export async function getProductBySlug(slug: string) {
  try {
    const p = await prisma.product.findUnique({
      where: { slug },
      include: { category: true }
    });
    if (p) {
       return {
         ...p,
         price: Number(p.price),
         salePrice: p.salePrice ? Number(p.salePrice) : null,
         createdAt: p.createdAt.toISOString(),
         updatedAt: p.updatedAt.toISOString(),
         category: p.category ? {
           ...p.category,
           createdAt: p.category.createdAt.toISOString()
         } : null
       };
    }
  } catch (error) {
    console.error("Failed to fetch product by slug:", error);
  }
  return FALLBACK_PRODUCTS.find(p => p.slug === slug) || null;
}

export async function getMarketplaceProducts() {
  return getAllProducts();
}
