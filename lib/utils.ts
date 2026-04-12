import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
export function formatPrice(price: number | string) {
    return new Intl.NumberFormat('en-QA', {
        style: 'currency',
        currency: 'QAR',
        minimumFractionDigits: 2
    }).format(Number(price));
}

export const formatCurrency = formatPrice;
