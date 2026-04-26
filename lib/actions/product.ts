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
      where: { featured: true, status: 'APPROVED' },
      include: { category: true },
      take: 8,
      orderBy: [
        { position: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    if (products.length > 0) {
      return products.map((p: any) => ({
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
    return FALLBACK_PRODUCTS.filter((p: any) => p.featured).slice(0, 4);
  } catch (error: any) {
    console.error("Failed to fetch featured products:", error);
    return FALLBACK_PRODUCTS.filter((p: any) => p.featured).slice(0, 4);
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
    const where: Prisma.ProductWhereInput = {
      status: 'APPROVED'
    };

    if (categorySlug) {
      where.OR = [
        { categoryId: categorySlug },
        { category: { slug: categorySlug } }
      ];
    }

    if (brandSlug) {
      // Find the brand first to get its proper name
      const brand = await prisma.brand.findUnique({ where: { slug: brandSlug } });
      
      if (brand) {
        where.OR = [
          ...(where.OR || []),
          { brandId: brand.id },
          { brandName: { contains: brand.name, mode: 'insensitive' } }
        ];
      } else {
        // Fallback for non-existent brands in model or custom slugs
        where.brandName = { contains: brandSlug.replace(/-/g, ' '), mode: 'insensitive' };
      }
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

    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [
      { position: 'asc' },
      { createdAt: 'desc' }
    ];

    if (sort === 'price_asc') {
      orderBy = [{ price: 'asc' }];
    } else if (sort === 'price_desc') {
      orderBy = [{ price: 'desc' }];
    } else if (sort === 'newest') {
      orderBy = [{ createdAt: 'desc' }];
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy
    });

    if (products.length > 0) {
      return products.map((p: any) => ({
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
  } catch (error: any) {
    console.error("Failed to fetch products:", error);
    return FALLBACK_PRODUCTS;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return categories.map((c: any) => ({
      ...c,
      createdAt: c.createdAt.toISOString()
    })) as unknown as Category[];
  } catch (error: any) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' }
    });
    return brands.map((b: any) => ({
      ...b,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString()
    }));
  } catch (error: any) {
    console.error("Failed to fetch brands:", error);
    return [];
  }
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
  } catch (error: any) {
    console.error("Failed to fetch product by id:", error);
  }
  return FALLBACK_PRODUCTS.find(p => p.id === id) || null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    // 1. Try Slug
    let p = await prisma.product.findUnique({
      where: { slug },
      include: { category: true }
    });

    // 2. Fallback to ID if not found by slug
    if (!p) {
      p = await prisma.product.findUnique({
        where: { id: slug },
        include: { category: true }
      });
    }

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
  } catch (error: any) {
    console.error("Failed to fetch product by slug/id:", error);
  }
  return FALLBACK_PRODUCTS.find(p => p.slug === slug || p.id === slug) || null;
}

export async function getMarketplaceProducts(): Promise<Product[]> {
  return getAllProducts();
}
