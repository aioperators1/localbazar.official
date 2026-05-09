export interface VariantSize {
    name: string;
    price: number | null;
}

export interface Category {
    id: string;
    name: string;
    nameAr?: string | null;
    slug: string;
    image: string | null;
    parentId: string | null;
    createdAt: string;
    featured?: boolean;
    expressCheckout?: boolean;
    showInHomeTabs?: boolean;
    orderInHomeTabs?: number;
    showInHomeCurated?: boolean;
    orderInHomeCurated?: number;
}

export interface Brand {
    id: string;
    name: string;
    nameAr?: string | null;
    slug: string;
    logo: string | null;
    description: string | null;
    descriptionAr?: string | null;
    featured: boolean;
    showInHome: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Review {
    id: string;
    rating: number;
    comment: string | null;
    user: {
        name: string | null;
        image: string | null;
    } | null;
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    nameAr?: string | null;
    slug: string;
    description: string;
    descriptionAr?: string | null;
    price: number;
    salePrice: number | null;
    stock: number;
    inStock: boolean;
    images: string;
    featured: boolean;
    categoryId: string | null;
    category?: Category | null;
    brandName: string | null;
    brand?: string | null;
    brandId?: string | null;
    sizes: string | null;
    colors: string | null;
    materials: string | null;
    materialsAr?: string | null;
    careInstructions: string | null;
    careInstructionsAr?: string | null;
    sku?: string | null;
    position?: number;
    createdAt: string;
    updatedAt: string;
    reviews?: Review[];
    _count?: {
        reviews: number;
    };
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    size: string | null;
    color: string | null;
    product?: Product;
}

export interface Order {
    id: string;
    userId: string | null;
    total: number;
    status: string;
    type?: string;
    paymentMethod: string;
    paymentStatus: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    address?: string | null;
    city?: string | null;
    zip?: string | null;
    phone?: string | null;
    createdAt: string;
    updatedAt: string;
    items?: OrderItem[];
    orderItems?: OrderItem[];
    user?: {
        name: string | null;
        email: string | null;
        image: string | null;
    } | null;
}

export interface Voucher {
    id: string;
    code: string;
    type: "PERCENTAGE" | "FIXED";
    value: number;
    expiresAt: string | null;
    isActive: boolean;
    usageLimit: number | null;
    usedCount: number;
}

export interface Banner {
    id: string;
    title: string;
    titleAr?: string | null;
    subtitle: string | null;
    subtitleAr?: string | null;
    description?: string | null;
    descriptionAr?: string | null;
    image: string;
    mobileImage: string | null;
    link: string | null;
    active: boolean;
    order: number;
}

export interface AdminSetting {
    homepageTitle?: string;
    homepageSubtitle?: string;
    aboutText?: string;
    homepageImage?: string;
    whatsappNumber?: string;
    facebookPixelId?: string;
    facebookAccessToken?: string;
    snapchatPixelId?: string;
    tiktokPixelId?: string;
    [key: string]: any;
}

export interface Permission {
    id: string;
    access: "visitor" | "editor";
}

export interface AppUser {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
    permissions?: Permission[];
}

export interface AppSession {
    user: AppUser;
}
