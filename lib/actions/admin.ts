"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PagePermission } from "@/types/next-auth";

// --- AUTHORIZATION HELPER ---
async function checkPermission(pageId: string, level: 'visitor' | 'editor' = 'editor') {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return false;
    
    const role = session.user.role;
    if (role === 'SUPER_ADMIN') return true;
    
    const permissions = session.user.permissions;
    const permissionList: PagePermission[] = Array.isArray(permissions) ? permissions : [];
        
    const perm = permissionList.find((p) => p.id === pageId);
    if (!perm) return false;
    
    if (level === 'editor' && perm.access !== 'editor') {
        return false;
    }
    
    return true;
}

// --- DASHBOARD STATS ---
type ProductInput = {
    name: string;
    nameAr?: string;
    slug: string;
    description: string;
    descriptionAr?: string;
    price: string | number;
    stock: string | number;
    categoryId: string;
    image: string | string[]; // Can be single URL or array
    brandId?: string;
    brandName?: string;
    sku: string;
    specs?: string;
    sizes?: string;
    colors?: string;
    materials?: string;
    materialsAr?: string;
    careInstructions?: string;
    careInstructionsAr?: string;
};

interface SimpleUser {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
}

interface OrderWithUser {
    id: string;
    total: { toNumber(): number } | Prisma.Decimal; // Use Prisma.Decimal but Number() it
    createdAt: Date;
    updatedAt: Date;
    status: string;
    user: SimpleUser | null;
}

export async function getDashboardStats() {
    try {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const [
            totalRevenue, 
            totalOrders, 
            totalProducts, 
            recentOrders,
            totalUsers,
            
            thisMonthRevenue,
            lastMonthRevenue,
            
            thisMonthOrders,
            lastMonthOrders,
            
            thisMonthUsers,
            lastMonthUsers
        ] = await Promise.all([
            prisma.order.aggregate({ 
                _sum: { total: true },
                where: { status: { not: 'CANCELLED' } } 
            }),
            prisma.order.count(),
            prisma.product.count(),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: true }
            }),
            prisma.user.count({ where: { role: 'USER' } }),
            
            prisma.order.aggregate({ 
                where: { createdAt: { gte: startOfThisMonth }, status: { not: 'CANCELLED' } },
                _sum: { total: true } 
            }),
            prisma.order.aggregate({ 
                where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth }, status: { not: 'CANCELLED' } },
                _sum: { total: true } 
            }),
            
            prisma.order.count({ where: { createdAt: { gte: startOfThisMonth } } }),
            prisma.order.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } } }),
            
            prisma.user.count({ where: { role: 'USER', createdAt: { gte: startOfThisMonth } } }),
            prisma.user.count({ where: { role: 'USER', createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } } })
        ]);

        const calcTrend = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? { change: "+100%", trend: "up" } : { change: "0%", trend: "neutral" };
            const diff = ((current - previous) / previous) * 100;
            return {
                change: `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`,
                trend: diff > 0 ? "up" : diff < 0 ? "down" : "neutral"
            };
        };

        const revenueCurrent = Number(thisMonthRevenue._sum.total || 0);
        const revenuePrevious = Number(lastMonthRevenue._sum.total || 0);

        return {
            revenue: Number(totalRevenue._sum.total || 0),
            orders: totalOrders,
            products: totalProducts,
            users: totalUsers,
            recentOrders: (recentOrders as unknown as OrderWithUser[]).map((order) => ({
                ...order,
                total: Number(order.total),
                createdAt: order.createdAt.toISOString(),
                updatedAt: order.updatedAt.toISOString(),
            })),
            trends: {
                revenue: calcTrend(revenueCurrent, revenuePrevious),
                orders: calcTrend(thisMonthOrders, lastMonthOrders),
                users: calcTrend(thisMonthUsers, lastMonthUsers)
            }
        };
    } catch (error) {
        console.error("Stats Error:", error);
        return { 
            revenue: 0, orders: 0, products: 0, users: 0, recentOrders: [],
            trends: {
                revenue: { change: "0%", trend: "neutral" },
                orders: { change: "0%", trend: "neutral" },
                users: { change: "0%", trend: "neutral" }
            }
        };
    }
}

// --- PRODUCT MANAGEMENT ---
export async function createProduct(data: ProductInput) {
    if (!(await checkPermission('products', 'editor'))) {
        return { success: false, error: "Access Denied: You do not have permission to manage products." };
    }
    try {
        if (!data.categoryId || data.categoryId === "") {
            return { success: false, error: "Category is required" };
        }

        await prisma.product.create({
            data: {
                name: data.name,
                nameAr: data.nameAr || null,
                slug: data.slug,
                description: data.description,
                descriptionAr: data.descriptionAr || null,
                price: parseFloat(String(data.price)),
                stock: parseInt(String(data.stock)),
                categoryId: data.categoryId,
                images: Array.isArray(data.image) ? JSON.stringify(data.image) : JSON.stringify([data.image]),
                brandId: data.brandId || null,
                brandName: data.brandName || null,
                sku: data.sku || null,
                specs: data.specs,
                sizes: data.sizes,
                colors: data.colors,
                materials: data.materials,
                materialsAr: data.materialsAr || null,
                careInstructions: data.careInstructions,
                careInstructionsAr: data.careInstructionsAr || null,
            }
        });
        revalidatePath('/admin/products');
        revalidatePath('/shop');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
    if (!(await checkPermission('products', 'editor'))) {
        return { success: false, error: "Access Denied: You do not have permission to modify products." };
    }
    try {
        if (data.categoryId === "") {
            return { success: false, error: "Category cannot be empty" };
        }

        // Destructure image specifically to handle the mapping to 'images'

        const { image, price, stock, specs, ...rest } = data;

        const updateData: Record<string, unknown> = {
            ...rest,
        };

        if (price !== undefined) {
            updateData.price = parseFloat(String(price));
        }

        if (stock !== undefined) {
            updateData.stock = parseInt(String(stock));
        }

        // Map 'image' input to 'images' database field
        if (image) {
            updateData.images = Array.isArray(image) ? JSON.stringify(image) : JSON.stringify([image]);
        }

        if (specs !== undefined) updateData.specs = specs;
        if (data.sizes !== undefined) updateData.sizes = data.sizes;
        if (data.colors !== undefined) updateData.colors = data.colors;
        if (data.materials !== undefined) updateData.materials = data.materials;
        if (data.materialsAr !== undefined) updateData.materialsAr = data.materialsAr;
        if (data.careInstructions !== undefined) updateData.careInstructions = data.careInstructions;
        if (data.careInstructionsAr !== undefined) updateData.careInstructionsAr = data.careInstructionsAr;
        if (data.nameAr !== undefined) updateData.nameAr = data.nameAr;
        if (data.descriptionAr !== undefined) updateData.descriptionAr = data.descriptionAr;

        // Normalize IDs and optional fields
        if (updateData.brandId === "") updateData.brandId = null;
        if (updateData.sellerId === "") updateData.sellerId = null;
        if (updateData.brandName === "") updateData.brandName = null;
        if (updateData.sku === "") updateData.sku = null;

        await prisma.product.update({
            where: { id },
            data: updateData
        });

        revalidatePath('/admin/products');
        revalidatePath('/shop');
        return { success: true };
    } catch (error) {
        console.error("Update Product Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function approveListing(productId: string) {
    if (!(await checkPermission('products', 'editor'))) {
        return { success: false, error: "Access Denied." };
    }
    try {
        await prisma.product.update({
            where: { id: productId },
            data: { status: "APPROVED" }
        });
        revalidatePath('/admin/products');
        return { success: true };
    } catch (error) {
        console.error("Approve Listing Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function deleteProduct(id: string) {
    if (!(await checkPermission('products', 'editor'))) {
        return { success: false, error: "Access Denied: You do not have permission to delete products." };
    }
    try {
        await prisma.product.delete({ where: { id } });
        revalidatePath('/admin/products');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

export async function deleteProducts(ids: string[]) {
    if (!(await checkPermission('products', 'editor'))) {
        return { success: false, error: "Access Denied: Unauthorized bulk operation." };
    }
    try {
        await prisma.product.deleteMany({
            where: {
                id: { in: ids }
            }
        });
        revalidatePath('/admin/products');
        return { success: true };
    } catch (error) {
        console.error("Bulk Delete Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function duplicateProduct(id: string) {
    if (!(await checkPermission('products', 'editor'))) {
        return { success: false, error: "Access Denied: Product duplication is restricted." };
    }
    try {
        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (!product) {
            return { success: false, error: "Product not found" };
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _, createdAt, updatedAt, views, ...rest } = product;

        await prisma.product.create({
            data: {
                ...rest,
                name: `${product.name} (Copy)`,
                slug: `${product.slug}-copy-${Math.random().toString(36).substring(7)}`,
                sku: product.sku ? `${product.sku}-COPY-${Math.random().toString(36).substring(3).toUpperCase()}` : null,
                status: "APPROVED"
            }
        });

        revalidatePath('/admin/products');
        revalidatePath('/shop');
        return { success: true };
    } catch (error) {
        console.error("Duplicate Product Error:", error);
        return { success: false, error: String(error) };
    }
}

// --- ORDER MANAGEMENT ---
export async function getAdminOrders() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true, items: true }
    });

    return orders.map((order) => ({
        ...order,
        total: Number(order.total),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: order.items.map((item) => ({
            ...item,
            price: Number(item.price)
        }))
    }));
}

export async function updateOrderStatus(orderId: string, status: string) {
    if (!(await checkPermission('orders', 'editor'))) {
        return { success: false, error: "Access Denied: You do not have permission to modify order status." };
    }
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
        revalidatePath('/admin/orders');
        revalidatePath('/orders');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

// --- CUSTOMER MANAGEMENT ---
export async function getAdminCustomers() {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'USER' },
            orderBy: { createdAt: 'desc' },
            include: {
                orders: {
                    select: { id: true, total: true }
                }
            }
        });

        return users.map((user) => ({
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            orders: user.orders.map((order) => ({
                ...order,
                total: Number(order.total)
            }))
        }));
    } catch (error) {
        console.error("Customers Error:", error);
        return [];
    }
}

// --- ANALYTICS ---
export async function getMonthlyRevenue() {
    try {
        const currentYear = new Date().getFullYear();
        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: new Date(`${currentYear}-01-01`),
                    lt: new Date(`${currentYear + 1}-01-01`)
                },
                status: { not: 'CANCELLED' }
            },
            select: {
                createdAt: true,
                total: true
            }
        });

        const monthlyData = new Array(12).fill(0).map((_, i) => ({
            name: new Date(0, i).toLocaleString('default', { month: 'short' }),
            total: 0
        }));

        orders.forEach((order) => {
            const month = new Date(order.createdAt).getMonth();
            monthlyData[month].total += Number(order.total);
        });

        return monthlyData;
    } catch (error) {
        console.error("Revenue Error:", error);
        return [];
    }
}

// --- BANNER MANAGEMENT ---
export async function getAdminBanners() {
    try {
        const banners = await prisma.banner.findMany({
            orderBy: { order: 'asc' }
        });
        return banners.map((banner) => ({
            ...banner,
            createdAt: banner.createdAt.toISOString(),
            updatedAt: banner.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error("Get Banners Error:", error);
        return [];
    }
}

interface BannerInput {
    title: string;
    titleAr?: string | null;
    subtitle?: string | null;
    subtitleAr?: string | null;
    description?: string | null;
    descriptionAr?: string | null;
    image: string;
    mobileImage?: string | null;
    link?: string | null;
    active?: boolean;
    order?: number;
}

export async function createBanner(data: BannerInput) {
    try {
        await prisma.banner.create({
            data: {
                title: data.title,
                titleAr: data.titleAr || null,
                subtitle: data.subtitle || null,
                subtitleAr: data.subtitleAr || null,
                description: data.description || null,
                descriptionAr: data.descriptionAr || null,
                image: data.image,
                mobileImage: data.mobileImage || null,
                link: data.link || null,
                active: data.active ?? true,
                order: data.order ?? 0,
            }
        });
        revalidatePath('/');
        revalidatePath('/admin/banners');
        return { success: true };
    } catch (error) {
        console.error("Create Banner Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function updateBanner(id: string, data: BannerInput) {
    if (!(await checkPermission('banners', 'editor'))) {
        return { success: false, error: "Access Denied: Banner management is restricted." };
    }
    try {
        await prisma.banner.update({
            where: { id },
            data: {
                title: data.title,
                titleAr: data.titleAr || null,
                subtitle: data.subtitle || null,
                subtitleAr: data.subtitleAr || null,
                description: data.description || null,
                descriptionAr: data.descriptionAr || null,
                image: data.image,
                mobileImage: data.mobileImage || null,
                link: data.link || null,
                active: data.active,
                order: data.order,
            }
        });
        revalidatePath('/');
        revalidatePath('/admin/banners');
        return { success: true };
    } catch (error) {
        console.error("Update Banner Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function deleteBanner(id: string) {
    if (!(await checkPermission('banners', 'editor'))) {
        return { success: false, error: "Access Denied." };
    }
    try {
        await prisma.banner.delete({ where: { id } });
        revalidatePath('/');
        revalidatePath('/admin/banners');
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

// --- SETTINGS MANAGEMENT ---
export async function getAdminSettings() {
    try {
        const settings = await prisma.setting.findMany();
        return settings.reduce((acc: Record<string, string>, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});
    } catch (error) {
        console.error("Get Settings Error:", error);
        return {};
    }
}

export async function updateAdminSettings(data: Record<string, string>) {
    if (!(await checkPermission('settings', 'editor'))) {
        return { success: false, error: "Access Denied: Settings management is restricted." };
    }
    try {
        // Use a transaction to update all settings
        const updates = Object.entries(data).map(([key, value]) => {
            return prisma.setting.upsert({
                where: { key },
                update: { value },
                create: { key, value }
            });
        });

        await prisma.$transaction(updates);
        revalidatePath('/');
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error) {
        console.error("Update Settings Error:", error);
        return { success: false, error: String(error) };
    }
}

// --- CATEGORY MANAGEMENT ---
export async function getAdminCategories() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                parent: true,
                _count: { select: { products: true } }
            },
            orderBy: { name: 'asc' }
        });

        return categories.map((cat) => ({
            ...cat,
            nameAr: cat.nameAr || null,
            descriptionAr: cat.descriptionAr || null,
            createdAt: cat.createdAt.toISOString(),
            parent: cat.parent ? {
                ...cat.parent,
                nameAr: cat.parent.nameAr || null,
                createdAt: cat.parent.createdAt.toISOString()
            } : null
        }));
    } catch (error) {
        console.error("Get Categories Error:", error);
        return [];
    }
}

interface CategoryInput {
    name: string;
    nameAr?: string | null;
    slug: string;
    image?: string | null;
    parentId?: string | null;
    description?: string | null;
    descriptionAr?: string | null;
    featured?: boolean;
    showInHomeTabs?: boolean;
    orderInHomeTabs?: number;
    showInHomeCurated?: boolean;
    orderInHomeCurated?: number;
}

export async function createCategory(data: CategoryInput) {
    if (!(await checkPermission('categories', 'editor'))) {
        return { success: false, error: "Access Denied: Category management is restricted." };
    }
    try {
        await (prisma.category as unknown as { create: (o: unknown) => Promise<unknown> }).create({
            data: {
                name: data.name,
                nameAr: data.nameAr || null,
                slug: data.slug,
                image: data.image,
                parentId: data.parentId || null,
                description: data.description,
                descriptionAr: data.descriptionAr || null,
                featured: data.featured ?? false,
                showInHomeTabs: data.showInHomeTabs ?? false,
                orderInHomeTabs: data.orderInHomeTabs ?? 0,
                showInHomeCurated: data.showInHomeCurated ?? false,
                orderInHomeCurated: data.orderInHomeCurated ?? 0,
            }
        });
        revalidatePath('/');
        revalidatePath('/admin/categories');
        revalidatePath('/shop');
        return { success: true };
    } catch (error) {
        console.error("Create Category Error:", error);
        return { success: false, error: String(error) };
    }
}
export async function updateCategory(id: string, data: Partial<CategoryInput>) {
    if (!(await checkPermission('categories', 'editor'))) {
        return { success: false, error: "Access Denied: Category management is restricted." };
    }
    try {
        const { parentId, ...rest } = data;
        await (prisma.category as unknown as { update: (o: unknown) => Promise<unknown> }).update({
            where: { id },
            data: {
                ...rest,
                nameAr: data.nameAr || undefined,
                descriptionAr: data.descriptionAr || undefined,
                parentId: parentId || null
            }
        });
        revalidatePath('/');
        revalidatePath('/admin/categories');
        revalidatePath('/shop');
        return { success: true };
    } catch (error) {
        console.error("Update Category Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function deleteCategory(id: string) {
    if (!(await checkPermission('categories', 'editor'))) {
        return { success: false, error: "Access Denied: Category deletion is restricted." };
    }
    try {
        await prisma.category.delete({ where: { id } });
        revalidatePath('/admin/categories');
        revalidatePath('/shop');
        return { success: true };
    } catch (error) {
        console.error("Delete Category Error:", error);
        return { success: false, error: String(error) };
    }
}
// --- BRAND MANAGEMENT ---
export async function getAdminBrands() {
    try {
        const brands = await prisma.brand.findMany({
            orderBy: { name: 'asc' }
        });
        return brands;
    } catch (error) {
        console.error("Get Brands Error:", error);
        return [];
    }
}

export async function createBrand(data: { name: string, nameAr?: string, slug: string, logo?: string, description?: string, descriptionAr?: string, featured?: boolean, showInHome?: boolean }) {
    if (!(await checkPermission('brands', 'editor'))) {
        return { success: false, error: "Access Denied: Brand management is restricted." };
    }
    try {
        await prisma.brand.create({
            data: {
                name: data.name,
                nameAr: data.nameAr || null,
                slug: data.slug,
                logo: data.logo || null,
                description: data.description || null,
                descriptionAr: data.descriptionAr || null,
                featured: data.featured ?? false,
                showInHome: data.showInHome ?? false,
            }
        });
        revalidatePath('/admin/brands');
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

export async function updateBrand(id: string, data: Partial<{ name: string, nameAr: string, slug: string, logo: string, description: string, descriptionAr: string, featured: boolean, showInHome: boolean }>) {
    if (!(await checkPermission('brands', 'editor'))) {
        return { success: false, error: "Access Denied: Brand management is restricted." };
    }
    try {
        await prisma.brand.update({
            where: { id },
            data: {
                name: data.name,
                nameAr: data.nameAr || null,
                slug: data.slug,
                logo: data.logo || null,
                description: data.description || null,
                descriptionAr: data.descriptionAr || null,
                featured: data.featured,
                showInHome: data.showInHome,
            }
        });
        revalidatePath('/admin/brands');
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

export async function deleteBrand(id: string) {
    if (!(await checkPermission('brands', 'editor'))) {
        return { success: false, error: "Access Denied." };
    }
    try {
        await prisma.brand.delete({ where: { id } });
        revalidatePath('/admin/brands');
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

// --- VOUCHER MANAGEMENT ---
export async function getAdminVouchers() {
    try {
        const vouchers = await prisma.voucher.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                orders: {
                    select: {
                        id: true,
                        total: true,
                        createdAt: true,
                        user: {
                            select: { name: true, email: true }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 20
                }
            }
        });
        return vouchers.map((v) => ({
            ...v,
            value: Number(v.value),
            usedCount: v.orders.length,
            expiryDate: v.expiryDate?.toISOString() || null,
            createdAt: v.createdAt.toISOString(),
            updatedAt: v.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error("Get Vouchers Error:", error);
        return [];
    }
}

export async function createVoucher(data: { code: string, type: string, value: number, expiryDate?: string, usageLimit?: number, active?: boolean }) {
    if (!(await checkPermission('vouchers', 'editor'))) {
        return { success: false, error: "Access Denied." };
    }
    try {
        await prisma.voucher.create({
            data: {
                code: data.code.toUpperCase(),
                type: data.type,
                value: data.value,
                expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
                usageLimit: data.usageLimit || 0,
                active: data.active ?? true,
            }
        });
        revalidatePath('/admin/vouchers');
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

interface VoucherInput {
    code?: string;
    type?: string;
    value?: number | Prisma.Decimal;
    expiryDate?: string | Date | null;
    usageLimit?: number;
    active?: boolean;
}

export async function updateVoucher(id: string, data: Partial<VoucherInput>) {
    if (!(await checkPermission('vouchers', 'editor'))) {
        return { success: false, error: "Access Denied." };
    }
    try {
        const updateData: Record<string, unknown> = { ...data };
        if (data.expiryDate) updateData.expiryDate = new Date(data.expiryDate);
        if (data.code) updateData.code = data.code.toUpperCase();

        await prisma.voucher.update({
            where: { id },
            data: updateData as Prisma.VoucherUpdateInput
        });
        revalidatePath('/admin/vouchers');
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

export async function deleteVoucher(id: string) {
    if (!(await checkPermission('vouchers', 'editor'))) {
        return { success: false, error: "Access Denied." };
    }
    try {
        await prisma.voucher.delete({ where: { id } });
        revalidatePath('/admin/vouchers');
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

// --- TEAM MANAGEMENT ---
export async function getAdminTeamMembers() {
    try {
        const staff = await prisma.user.findMany({
            where: {
                role: { in: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF'] }
            },
            orderBy: { createdAt: 'desc' }
        });

        return staff.map((user) => ({
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            password: "" // Don't leak passwords on list
        }));
    } catch (error) {
        console.error("Team Members Error:", error);
        return [];
    }
}

interface TeamMemberInput {
    email: string;
    name: string;
    role: string;
    password: string;
    permissions?: string | PagePermission[] | null;
}

export async function createTeamMember(data: TeamMemberInput) {
    if (!(await checkPermission('team', 'editor'))) {
        return { success: false, error: "Access Denied: Team management is reserved for Superadmins." };
    }
    try {
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) return { success: false, error: "Email already in use" };

        const hashedPassword = await hash(data.password, 12);
        const permissionsStr = typeof data.permissions === 'string' 
            ? data.permissions 
            : data.permissions ? JSON.stringify(data.permissions) : null;

        await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword, 
                role: data.role || 'ADMIN',
                permissions: permissionsStr,
                username: data.email.split('@')[0] + Math.floor(Math.random() * 1000)
            }
        });

        revalidatePath('/admin/team');
        return { success: true };
    } catch (error) {
        console.error("Create Team Member Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function deleteTeamMember(id: string) {
    if (!(await checkPermission('team', 'editor'))) {
        return { success: false, error: "Access Denied." };
    }
    try {
        await prisma.user.delete({ where: { id } });
        revalidatePath('/admin/team');
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

export async function updateTeamMember(id: string, data: Partial<TeamMemberInput>) {
    if (!(await checkPermission('team', 'editor'))) {
        return { success: false, error: "Access Denied: Team modification is restricted." };
    }
    try {
        const permissionsStr = typeof data.permissions === 'string' 
            ? data.permissions 
            : data.permissions ? JSON.stringify(data.permissions) : undefined;

        const updateData: Prisma.UserUpdateInput = {
            name: data.name,
            email: data.email,
            role: data.role || 'ADMIN',
            permissions: permissionsStr,
        };

        if (data.password && data.password.trim() !== "") {
            updateData.password = await hash(data.password, 12);
        }

        await prisma.user.update({
            where: { id },
            data: updateData
        });

        revalidatePath('/admin/team');
        return { success: true };
    } catch (error) {
        console.error("Update Team Member Error:", error);
        return { success: false, error: String(error) };
    }
}
