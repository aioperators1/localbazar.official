"use server";

import { prisma } from "@/lib/prisma";
import { COMPONENT_CATEGORIES } from "@/lib/constants/configurator";

export async function getConfiguratorComponents(categoryId: string, socket?: string) {
    try {
        const categoryFilter = COMPONENT_CATEGORIES.find(c => c.id === categoryId);
        if (!categoryFilter) return [];

        const terms = categoryFilter.search.split('|').map(t => t.trim().toLowerCase());

        const products = await prisma.product.findMany({
            where: {
                inStock: true
            },
            take: 250, // Increase pool for better filtering
            orderBy: {
                price: 'asc'
            }
        });

        let filtered = products.filter(p => {
            const nameLower = p.name.toLowerCase();

            // Smart keyword matching with regex for short terms to avoid partial matches (like 'ram' in 'grammes')
            const matchesCategory = terms.some(term => {
                if (term.length <= 3 || term === 'ddr4' || term === 'ddr5') {
                    const regex = new RegExp(`\\b${term}\\b`, 'i');
                    return regex.test(nameLower);
                }
                return nameLower.includes(term);
            });

            // Exclude pre-built systems from showing up as individual parts
            const isPrebuilt = (nameLower.includes('pc gamer') || nameLower.includes('ordi space')) &&
                !nameLower.includes('boitier') &&
                !nameLower.includes('ventirad') &&
                !nameLower.includes('thermal');

            // Don't show thermal paste/accessories in RAM/CPU categories
            const isThermalPaste = nameLower.includes('pâte thermique') || nameLower.includes('thermal paste') || nameLower.includes('duronaut') || nameLower.includes('kryonaut');
            const isAccessory = nameLower.includes('frame') || nameLower.includes('bracket') || nameLower.includes('support');

            if (categoryId !== 'refroidissement' && (isThermalPaste || isAccessory)) return false;

            return matchesCategory && !isPrebuilt;
        });

        // Smart Filtering: If a socket is provided (e.g. AM4, AM5, LGA1700), 
        // filter Motherboards to match it.
        if (socket && categoryId === 'carte-mere') {
            const socketLower = socket.toLowerCase();
            filtered = filtered.filter(p => {
                const nameLower = p.name.toLowerCase();
                const specsLower = p.specs ? String(p.specs).toLowerCase() : '';
                return nameLower.includes(socketLower) || specsLower.includes(socketLower);
            });
        }

        // Map them nicely for the frontend
        return filtered.map(p => {
            let img = '/placeholder.png';
            try {
                const parsed = JSON.parse(p.images);
                img = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : (p.images || '/placeholder.png');
            } catch {
                img = p.images || '/placeholder.png';
            }
            return {
                id: p.id,
                name: p.name,
                price: Number(p.price),
                image: img,
                specs: p.specs ? (typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs) : {}
            };
        });
    } catch (error) {
        console.error("Failed to fetch configurator components:", error);
        return [];
    }
}
