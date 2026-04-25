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
    salePrice?: string | number | null;
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
    position?: number | string;
    status?: string;
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
                where: { status: { notIn: ['CANCELLED', 'DRAFT', 'FAILED'] } }
            }),
            prisma.order.count({ where: { status: { notIn: ['DRAFT', 'FAILED'] } } }),
            prisma.product.count(),
            prisma.order.findMany({
                where: { status: { notIn: ['DRAFT', 'FAILED'] } },
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: true }
            }),
            prisma.user.count({ where: { role: 'USER' } }),

            prisma.order.aggregate({
                where: {
                    createdAt: { gte: startOfThisMonth },
                    status: { notIn: ['CANCELLED', 'DRAFT', 'FAILED'] }
                },
                _sum: { total: true }
            }),
            prisma.order.aggregate({
                where: {
                    createdAt: { gte: startOfLastMonth, lt: startOfThisMonth },
                    status: { notIn: ['CANCELLED', 'DRAFT', 'FAILED'] }
                },
                _sum: { total: true }
            }),

            prisma.order.count({ where: { createdAt: { gte: startOfThisMonth }, status: { notIn: ['DRAFT', 'FAILED'] } } }),
            prisma.order.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth }, status: { notIn: ['DRAFT', 'FAILED'] } } }),

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
            recentOrders: (recentOrders as any[]).map((order) => ({
                id: order.id,
                total: Number(order.total),
                status: order.status,
                createdAt: order.createdAt.toISOString(),
                user: order.user ? {
                    name: order.user.name,
                    email: order.user.email,
                } : null,
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
        // Category is now optional
        const categoryId = data.categoryId && data.categoryId !== "" ? data.categoryId : null;

        const price = parseFloat(String(data.price));
        const saleStr = data.salePrice ? String(data.salePrice).trim() : "";
        const salePrice = (saleStr === "" || saleStr === "0" || saleStr === "null") 
            ? null 
            : (isNaN(parseFloat(saleStr)) ? null : parseFloat(saleStr));

        // Ensure unique slug automatically
        let uniqueSlug = data.slug || `product-${Math.floor(Math.random() * 10000)}`;
        let counter = 1;
        let existingSlug = await prisma.product.findUnique({ where: { slug: uniqueSlug } });
        while (existingSlug) {
            uniqueSlug = `${data.slug}-${counter}`;
            existingSlug = await prisma.product.findUnique({ where: { slug: uniqueSlug } });
            counter++;
        }

        await prisma.product.create({
            data: {
                name: data.name,
                nameAr: data.nameAr || null,
                slug: uniqueSlug,
                description: data.description,
                descriptionAr: data.descriptionAr || null,
                price: isNaN(price) ? 0 : price,
                salePrice: salePrice,
                stock: parseInt(String(data.stock)) || 0,
                categoryId: categoryId,
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
                status: data.status || "APPROVED"
            }
        });
        revalidatePath('/admin/products');
        revalidatePath('/shop');
        return { success: true };
    } catch (error: any) {
        console.error("Create Product Error:", error);
        return { success: false, error: error?.message || String(error) };
    }
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
    if (!(await checkPermission('products', 'editor'))) {
        return { success: false, error: "Access Denied: You do not have permission to modify products." };
    }
    try {
        // Category is now optional

        // Destructure image specifically to handle the mapping to 'images'

        const { image, price, salePrice, stock, specs, ...rest } = data;

        const updateData: Record<string, any> = {
            ...rest,
        };

        // Ensure unique slug automatically if updating slug
        if (updateData.slug) {
            let uniqueSlug = updateData.slug;
            let counter = 1;
            let existingSlug = await prisma.product.findUnique({ where: { slug: uniqueSlug } });
            while (existingSlug && existingSlug.id !== id) {
                uniqueSlug = `${updateData.slug}-${counter}`;
                existingSlug = await prisma.product.findUnique({ where: { slug: uniqueSlug } });
                counter++;
            }
            updateData.slug = uniqueSlug;
        }

        if (price !== undefined) {
            const parsedPrice = parseFloat(String(price));
            updateData.price = isNaN(parsedPrice) ? 0 : parsedPrice;
        }

        if (salePrice !== undefined) {
            const saleStr = String(salePrice).trim();
            if (saleStr === "" || saleStr === "0") {
                updateData.salePrice = null;
            } else {
                const parsedSale = parseFloat(saleStr);
                updateData.salePrice = isNaN(parsedSale) ? null : parsedSale;
            }
        }

        if (stock !== undefined) {
            updateData.stock = parseInt(String(stock)) || 0;
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
        if (data.status !== undefined) updateData.status = data.status;
        if (data.position !== undefined) updateData.position = parseInt(String(data.position)) || 0;

        // Normalize IDs and optional fields
        if (updateData.brandId === "") updateData.brandId = null;
        if (updateData.sellerId === "") updateData.sellerId = null;
        if (updateData.brandName === "") updateData.brandName = null;
        if (updateData.sku === "") updateData.sku = null;
        if (updateData.categoryId === "") updateData.categoryId = null;

        await prisma.product.update({
            where: { id },
            data: updateData
        });

        revalidatePath('/admin/products');
        revalidatePath(`/admin/products/${id}`);
        revalidatePath('/shop');
        if (rest.slug) revalidatePath(`/product/${rest.slug}`);

        return { success: true };
    } catch (error) {
        console.error("Update Product Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function swapProductPositions(id1: string, id2: string) {
    if (!(await checkPermission('products', 'editor'))) {
        return { success: false, error: "Access Denied" };
    }
    
    try {
        const p1 = await prisma.product.findUnique({ where: { id: id1 }});
        const p2 = await prisma.product.findUnique({ where: { id: id2 }});
        
        if (!p1 || !p2) return { success: false, error: 'Product not found' };

        let pos1 = (p1 as any).position || 0;
        let pos2 = (p2 as any).position || 0;

        if (pos1 === pos2) {
            // Priority auto-sequencing if positions haven't been initiated
            const allProducts = await prisma.product.findMany({
                orderBy: [{ position: 'asc' } as any, { createdAt: 'desc' }],
                select: { id: true }
            });
            
            const updates = allProducts.map((p, index) => 
                prisma.product.update({
                    where: { id: p.id },
                    data: { position: index * 10 } as any // Space positions by 10 for fine manipulation
                })
            );
            await prisma.$transaction(updates);
            
            // Re-fetch sequenced positions and apply swap
            const p1New = await prisma.product.findUnique({ where: { id: id1 }});
            const p2New = await prisma.product.findUnique({ where: { id: id2 }});
            if (p1New && p2New) {
                await prisma.$transaction([
                    prisma.product.update({ where: { id: id1 }, data: { position: (p2New as any).position } as any }),
                    prisma.product.update({ where: { id: id2 }, data: { position: (p1New as any).position } as any })
                ]);
            }
        } else {
            // Direct pure swap
            await prisma.$transaction([
                prisma.product.update({ where: { id: id1 }, data: { position: pos2 } as any }),
                prisma.product.update({ where: { id: id2 }, data: { position: pos1 } as any })
            ]);
        }

        revalidatePath('/admin/products');
        revalidatePath('/shop');
        return { success: true };
    } catch (error) {
        console.error("Swap Product Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function updateProductBulkPositions(updates: { id: string, position: number }[]) {
    if (!(await checkPermission('products', 'editor'))) {
        return { success: false, error: "Access Denied" };
    }
    
    try {
        const transaction = updates.map(update => 
            prisma.product.update({
                where: { id: update.id },
                data: { position: update.position } as any
            })
        );
        
        await prisma.$transaction(transaction);
        revalidatePath('/admin/products');
        revalidatePath('/shop');
        return { success: true };
    } catch (error) {
        console.error("Bulk Update Positions Error:", error);
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
        // --- DEEP DEPENDECY CLEANUP ---
        // 1. Delete associated order items (FORCED)
        await prisma.orderItem.deleteMany({ where: { productId: id } });

        // 2. Delete associated reviews (CASCADE)
        await prisma.review.deleteMany({ where: { productId: id } });

        // 3. Delete associated conversations
        await prisma.conversation.deleteMany({ where: { productId: id } });

        // 4. Final Product Deletion
        await prisma.product.delete({ where: { id } });

        revalidatePath('/admin/products');
        revalidatePath('/shop');
        return { success: true };
    } catch (error) {
        console.error("Critical Delete Product Error:", error);
        return {
            success: false,
            error: "System Error: Termination protocol failed. Please contact technical support."
        };
    }
}

export async function deleteProducts(ids: string[]) {
    if (!(await checkPermission('products', 'editor'))) {
        return { success: false, error: "Access Denied: Unauthorized bulk operation." };
    }
    try {
        // --- BULK DEEP CLEANUP ---
        await prisma.orderItem.deleteMany({ where: { productId: { in: ids } } });
        await prisma.review.deleteMany({ where: { productId: { in: ids } } });
        await prisma.conversation.deleteMany({ where: { productId: { in: ids } } });

        await prisma.product.deleteMany({
            where: {
                id: { in: ids }
            }
        });

        revalidatePath('/admin/products');
        revalidatePath('/shop');
        return { success: true };
    } catch (error) {
        console.error("Bulk Delete Error:", error);
        return { success: false, error: "System failed to execute bulk termination." };
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
                nameAr: product.nameAr ? `${product.nameAr} (نسخة)` : null,
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
export async function getAdminOrders(page: number = 1, pageSize: number = 20) {
    const orders = await prisma.order.findMany({
        where: { status: { notIn: ['DRAFT', 'FAILED'] } },
        orderBy: { createdAt: 'desc' },
        take: pageSize,
        skip: (page - 1) * pageSize,
        include: { user: true, items: true, assignedDriver: true } as any
    }) as any[];

    return orders.map((order: any) => ({
        id: order.id,
        userId: order.userId,
        status: order.status,
        paymentMethod: order.paymentMethod,
        total: Number(order.total),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        assignedDriver: order.assignedDriver ? {
            id: order.assignedDriver.id,
            name: order.assignedDriver.name,
            phone: order.assignedDriver.phone,
        } : null,
        user: order.user ? {
            id: order.user.id,
            name: order.user.name,
            email: order.user.email,
            image: order.user.image,
        } : null,
        items: (order.items || []).map((item: any) => ({
            id: item.id,
            orderId: item.orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: Number(item.price),
            size: item.size || null,
            color: item.color || null,
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
                    orderBy: { createdAt: 'desc' },
                    include: {
                        items: {
                            take: 1,
                            include: {
                                product: {
                                    select: { name: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        return users.map((user) => ({
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            orders: user.orders.map((order) => ({
                ...order,
                total: Number(order.total),
                createdAt: order.createdAt.toISOString(),
                items: order.items.map(item => ({
                    name: item.product?.name || "Unknown Product"
                }))
            }))
        }));
    } catch (error) {
        console.error("Get Customers Error:", error);
        return [];
    }
}

// --- ANALYTICS ---
export async function getRevenueAnalysis(range: string = 'this_year', customStart?: string, customEnd?: string, year?: number) {
    try {
        const now = new Date();
        let startDate: Date;
        let endDate: Date = now;
        let groupBy: 'hour' | 'day' | 'month' = 'month';

        switch (range) {
            case 'year':
                const selectedYear = year || now.getFullYear();
                startDate = new Date(selectedYear, 0, 1);
                endDate = new Date(selectedYear, 11, 31, 23, 59, 59);
                groupBy = 'month';
                break;
            case 'custom':
                startDate = customStart ? new Date(customStart) : new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                endDate = customEnd ? new Date(customEnd) : now;
                groupBy = (endDate.getTime() - startDate.getTime()) < (2 * 24 * 60 * 60 * 1000) ? 'hour' : 'day';
                break;
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                groupBy = 'hour';
                break;
            case 'last_3_days':
                startDate = new Date(new Date().setDate(now.getDate() - 3));
                groupBy = 'day';
                break;
            case 'last_7_days':
                startDate = new Date(new Date().setDate(now.getDate() - 7));
                groupBy = 'day';
                break;
            case 'last_30_days':
                startDate = new Date(new Date().setDate(now.getDate() - 30));
                groupBy = 'day';
                break;
            case 'last_3_months':
                startDate = new Date(new Date().setMonth(now.getMonth() - 3));
                groupBy = 'month';
                break;
            default: // this_year
                startDate = new Date(now.getFullYear(), 0, 1);
                groupBy = 'month';
                break;
        }

        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate
                },
                status: { not: 'CANCELLED' }
            },
            select: { createdAt: true, total: true },
            orderBy: { createdAt: 'asc' }
        });

        const data: Record<string, number> = {};

        if (groupBy === 'hour') {
            for (let i = 0; i < 24; i++) {
                const label = `${i}:00`;
                data[label] = 0;
            }
            orders.forEach(o => {
                const hour = new Date(o.createdAt).getHours();
                data[`${hour}:00`] += Number(o.total);
            });
        } else if (groupBy === 'day') {
            let count = range === 'last_3_days' ? 3 : range === 'last_7_days' ? 7 : 30;
            if (range === 'custom') {
                count = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            }

            for (let i = count; i >= 0; i--) {
                const d = new Date(endDate);
                d.setDate(endDate.getDate() - i);
                const label = d.toLocaleDateString('default', { month: 'short', day: 'numeric' });
                data[label] = 0;
            }
            orders.forEach(o => {
                const label = new Date(o.createdAt).toLocaleDateString('default', { month: 'short', day: 'numeric' });
                if (data[label] !== undefined) data[label] += Number(o.total);
            });
        } else {
            // MONTH GROUPING
            const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            if (range === 'year' || range === 'this_year') {
                // Calendar Year: strictly Jan to Dec
                monthLabels.forEach(m => data[m] = 0);
            } else {
                // Rolling 3-12 months
                const monthsToBack = range === 'last_3_months' ? 3 : 12;
                for (let i = monthsToBack - 1; i >= 0; i--) {
                    const d = new Date(endDate);
                    d.setMonth(endDate.getMonth() - i);
                    const label = monthLabels[d.getMonth()];
                    data[label] = 0;
                }
            }

            orders.forEach(o => {
                const label = monthLabels[new Date(o.createdAt).getMonth()];
                if (data[label] !== undefined) data[label] += Number(o.total);
            });
        }

        return Object.entries(data).map(([name, total]) => ({ name, total }));
    } catch (error) {
        console.error("Revenue Analysis Error:", error);
        return [];
    }
}

export async function getMonthlyRevenue() {
    return getRevenueAnalysis('this_year');
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
        // Double check prisma.setting exists to avoid runtime crashes before the try-catch
        if (!prisma.setting) return {};
        
        const settings = await prisma.setting.findMany().catch(err => {
            console.error("Prisma Settings Fetch Error:", err);
            return [];
        });

        if (!settings || !Array.isArray(settings)) return {};

        return settings.reduce((acc: Record<string, string>, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});
    } catch (error) {
        console.error("Critical Get Settings Error:", error);
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
        // Check for duplicate name
        const existing = await prisma.brand.findFirst({
            where: { name: { equals: data.name, mode: 'insensitive' } }
        });
        if (existing) {
            return { success: false, error: `A brand with the name "${data.name}" already exists. Please use a different name.` };
        }

        // Check for duplicate slug
        const existingSlug = await prisma.brand.findFirst({
            where: { slug: data.slug }
        });
        if (existingSlug) {
            return { success: false, error: `A brand with this slug already exists. Please use a different name.` };
        }

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
        // Check for duplicate name (exclude current brand)
        if (data.name) {
            const existing = await prisma.brand.findFirst({
                where: {
                    name: { equals: data.name, mode: 'insensitive' },
                    id: { not: id }
                }
            });
            if (existing) {
                return { success: false, error: `A brand with the name "${data.name}" already exists. Please use a different name.` };
            }
        }

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
            orders: v.orders.map((order: any) => ({
                ...order,
                total: Number(order.total),
                createdAt: order.createdAt.toISOString()
            }))
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
                role: { in: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF', 'DRIVER'] }
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
            name: data.name || undefined,
            email: data.email || undefined,
            role: (data.role as any) || undefined,
            permissions: permissionsStr || undefined,
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

// --- NOTICE BAR MANAGEMENT ---
export async function getNoticeSettings() {
    try {
        const settings = await prisma.setting.findMany({
            where: {
                key: { in: ['notice_bar_text', 'notice_bar_active', 'notice_bar_bg_color', 'notice_bar_text_color'] }
            }
        });

        const text = settings.find(s => s.key === 'notice_bar_text')?.value || "";
        const active = settings.find(s => s.key === 'notice_bar_active')?.value === 'true';
        const bgColor = settings.find(s => s.key === 'notice_bar_bg_color')?.value || "#000000";
        const textColor = settings.find(s => s.key === 'notice_bar_text_color')?.value || "#FFFFFF";

        return { text, active, bgColor, textColor };
    } catch (error) {
        console.error("Get Notice Settings Error:", error);
        return { text: "", active: false, bgColor: "#000000", textColor: "#FFFFFF" };
    }
}

export async function updateNoticeSettings(text: string, active: boolean, bgColor: string = "#000000", textColor: string = "#FFFFFF") {
    if (!(await checkPermission('settings', 'editor'))) {
        return { success: false, error: "Access Denied: Settings management is restricted." };
    }
    try {
        const updates = [
            { key: 'notice_bar_text', value: text },
            { key: 'notice_bar_active', value: String(active) },
            { key: 'notice_bar_bg_color', value: bgColor },
            { key: 'notice_bar_text_color', value: textColor }
        ];

        for (const update of updates) {
            await prisma.setting.upsert({
                where: { key: update.key },
                update: { value: update.value },
                create: { key: update.key, value: update.value }
            });
        }

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Update Notice Settings Error:", error);
        return { success: false, error: String(error) };
    }
}

// --- DRIVER LOGISTICS MANAGEMENT ---

export async function getDrivers() {
    try {
        const drivers = await (prisma as any).driver.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { orders: true }
                },
                orders: {
                    select: {
                        id: true,
                        total: true,
                        status: true,
                        phone: true,
                        createdAt: true,
                        user: {
                            select: {
                                name: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });
        return drivers.map((driver: any) => ({
            ...driver,
            orders: driver.orders ? driver.orders.map((order: any) => ({
                ...order,
                total: Number(order.total)
            })) : []
        }));
    } catch (error) {
        console.error("Get Drivers Error:", error);
        return [];
    }
}

export async function createDriver(data: { name: string; phone: string; email?: string; password: string }) {
    if (!(await checkPermission('settings', 'editor'))) {
        return { success: false, error: "Access Denied: Driver management restricted." };
    }
    try {
        const hashedPassword = await hash(data.password, 12);

        // Use a transaction to ensure both models are created
        const result = await prisma.$transaction(async (tx) => {
            const driver = await (tx as any).driver.create({
                data: {
                    name: data.name,
                    phone: data.phone,
                    email: data.email || null,
                    password: hashedPassword,
                    active: true
                }
            });

            // If email is provided, create a dashboard User account automatically
            if (data.email) {
                const permissions = [
                    { id: 'orders', access: 'editor' },
                    { id: 'drivers', access: 'editor' }
                ];

                await tx.user.create({
                    data: {
                        name: data.name,
                        email: data.email,
                        password: hashedPassword,
                        role: 'DRIVER',
                        phone: data.phone,
                        permissions: JSON.stringify(permissions),
                        username: `driver_${data.phone.replace(/[^0-9]/g, '')}`
                    }
                });
            }

            return driver;
        });

        revalidatePath('/admin/drivers');
        revalidatePath('/admin/team');
        return { success: true, id: result.id };
    } catch (error: any) {
        console.error("Create Driver Error:", error);
        if (error.code === 'P2002') {
            return { success: false, error: "Phone or Email already exists." };
        }
        return { success: false, error: String(error) };
    }
}

export async function updateDriverStatus(id: string, active: boolean) {
    if (!(await checkPermission('settings', 'editor'))) {
        return { success: false, error: "Access Denied." };
    }
    try {
        await (prisma as any).driver.update({
            where: { id },
            data: { active }
        });
        revalidatePath('/admin/drivers');
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

export async function deleteDriver(id: string) {
    if (!(await checkPermission('settings', 'editor'))) {
        return { success: false, error: "Access Denied." };
    }
    try {
        const driver = await (prisma as any).driver.findUnique({ where: { id } });

        await prisma.$transaction(async (tx) => {
            if (driver && driver.email) {
                await tx.user.deleteMany({
                    where: { email: driver.email }
                });
            }
            await (tx as any).driver.delete({ where: { id } });
        });

        revalidatePath('/admin/drivers');
        revalidatePath('/admin/team');
        return { success: true };
    } catch (error) {
        console.error("Delete Driver Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function assignDriverToOrder(orderId: string, driverId: string | null) {
    if (!(await checkPermission('orders', 'editor'))) {
        return { success: false, error: "Access Denied." };
    }
    try {
        await (prisma as any).order.update({
            where: { id: orderId },
            data: { assignedDriverId: driverId }
        });
        revalidatePath('/admin/orders');
        revalidatePath('/driver/dashboard');
        return { success: true };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}
