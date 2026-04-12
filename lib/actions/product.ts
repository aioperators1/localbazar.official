"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Product, Category } from "@/lib/types";

// FALLBACK DATA FOR ROBUSTNESS (When DB is unreachable)
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'fashion-001',
    name: "Velvet Couture Abaya",
    slug: 'velvet-couture-abaya',
    description: "A signature piece of Doha elegance. Crafted from premium Italian velvet with gold thread embroidery. Silhouette elegant and hand-finished.",
    price: 4500.00,
    salePrice: null,
    stock: 5,
    inStock: true,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200'
    ]),
    featured: true,
    categoryId: 'abayas',
    category: { id: 'abayas', name: 'Abayas', slug: 'abayas', image: null, parentId: null, createdAt: new Date().toISOString() },
    brandName: "Local Bazar Signature",
    sizes: JSON.stringify(["S", "M", "L", "XL"]),
    colors: JSON.stringify([
      { name: "Black", hex: "#000000" },
      { name: "Gold", hex: "#D4AF37" }
    ]),
    materials: "Premium Velvet",
    careInstructions: "Dry clean only.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function getFeaturedProducts(): Promise<Product[]> {
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
        updatedAt: p.updatedAt.toISOString(),
        category: p.category ? {
            ...p.category,
            createdAt: p.category.createdAt.toISOString()
        } : null
      })) as unknown as Product[];
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
  sort?: string,
  brandSlug?: string
): Promise<Product[]> {
  try {
    const where: Prisma.ProductWhereInput = {};

    if (categorySlug) {
      where.OR = [
        { categoryId: categorySlug },
        { category: { slug: categorySlug } }
      ];
    }

    if (brandSlug) {
      where.brand = { slug: brandSlug };
    }

    if (search) {
      const searchCondition: Prisma.ProductWhereInput = {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } }
        ]
      };
      
      if (where.AND) {
        where.AND = Array.isArray(where.AND) ? [...where.AND, searchCondition] : [where.AND, searchCondition];
      } else {
        where.AND = [searchCondition];
      }
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

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
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
      })) as unknown as Product[];
    }

    if (categorySlug || search || brandSlug) return [];
    return FALLBACK_PRODUCTS;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return FALLBACK_PRODUCTS;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    if (categories.length > 0) {
       return categories.map(c => ({
         ...c,
         createdAt: c.createdAt.toISOString()
       })) as unknown as Category[];
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
  
  return [
    { id: 'abayas', name: 'Abayas', slug: 'abayas', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200', parentId: null, createdAt: new Date().toISOString() },
    { id: 'dresses-jalabiyas', name: 'Dresses & Jalabiyas', slug: 'dresses-jalabiyas', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200', parentId: null, createdAt: new Date().toISOString() },
    { id: 'men', name: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1594932224036-9c205771abb6?q=80&w=1200', parentId: null, createdAt: new Date().toISOString() },
    { id: 'perfumes-oud', name: 'Perfumes & Oud', slug: 'perfumes-oud', image: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=1200', parentId: null, createdAt: new Date().toISOString() },
    { id: 'jewelry', name: 'Jewelry', slug: 'jewelry', image: 'https://images.unsplash.com/photo-1610812383719-38379010461f?q=80&w=1200', parentId: null, createdAt: new Date().toISOString() },
    { id: 'accessories', name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=1200', parentId: null, createdAt: new Date().toISOString() }
  ];
}

export async function getProductById(id: string): Promise<Product | null> {
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
      } as unknown as Product;
    }
  } catch (error) {
    console.error("Failed to fetch product by id:", error);
  }
  return FALLBACK_PRODUCTS.find(p => p.id === id) || null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
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
       } as unknown as Product;
    }
  } catch (error) {
    console.error("Failed to fetch product by slug:", error);
  }
  return FALLBACK_PRODUCTS.find(p => p.slug === slug) || null;
}

export async function getMarketplaceProducts(): Promise<Product[]> {
  return getAllProducts();
}
