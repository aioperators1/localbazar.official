import { Voucher as PrismaVoucher } from "@prisma/client";

export interface Voucher extends Omit<PrismaVoucher, 'value' | 'createdAt' | 'updatedAt' | 'expiryDate'> {
    value: number;
    createdAt: string;
    updatedAt: string;
    expiryDate: string | null;
    usedCount: number;
}

export interface AdminApiResponse {
    success: boolean;
    error?: string;
    data?: unknown;
}
