import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Helper to map scraped category names to our DB structure (if needed)
const categoryMap: { [key: string]: string } = {
    'Processors': 'processors',
    'Motherboards': 'motherboards',
    'Graphics Cards': 'graphics-cards',
    'RAM': 'ram',
    'Storage': 'storage'
};

async function main() {
    console.log('Starting component seed...');

    const urlsPath = path.join(__dirname, '../component_urls.json');
    if (!fs.existsSync(urlsPath)) {
        console.error('component_urls.json not found.');
        return;
    }

    const items = JSON.parse(fs.readFileSync(urlsPath, 'utf8'));
    console.log(`Found ${items.length} component URLs.`);

    // Ensure categories exist
    for (const [name, slug] of Object.entries(categoryMap)) {
        await prisma.category.upsert({
            where: { slug },
            create: { name, slug, image: null },
            update: {}
        });
    }

    for (const item of items) {
        // item: { url: string, category: string }
        // Note: item.url might be weird JSON string if scraped poorly, let's check
        // The array in component_urls.json is actually just list of objects { url: "...", category: "..." } ?
        // The script scrape_component_urls.js pushes objects.

        let url = item.url;
        if (typeof item === 'string') {
            // Fallback if structure is flat
            url = item;
        } else if (item.url) {
            url = item.url;
        }

        try {
            console.log(`Processing [${item.category}]: ${url}`);
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

            const { data: html } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                },
                timeout: 10000
            });
            const $ = cheerio.load(html);

            let productData: any = {};
            let specs: any = {};

            // Try JSON-LD
            $('script[type="application/ld+json"]').each((i, el) => {
                try {
                    const json = JSON.parse($(el).html() || '{}');
                    let graph = json['@graph'] || [json];
                    if (!Array.isArray(graph)) graph = [graph];
                    const product = graph.find((g: any) => g['@type'] === 'Product');
                    if (product) {
                        productData = product;
                        if (product.additionalProperty) {
                            product.additionalProperty.forEach((p: any) => {
                                if (p.name && p.value) specs[p.name] = p.value;
                            });
                        }
                    }
                } catch (e) { }
            });

            // Fallback scraping
            if (!productData.name) {
                productData.name = $('h1.product_title').text().trim();
                const priceTxt = $('.price bdi').first().text();
                productData.offers = { price: priceTxt.replace(/[^0-9.]/g, '') };
                productData.image = $('.woocommerce-product-gallery__image a').first().attr('href');
            }

            if (!productData.name) {
                console.log('Skipping - No name found');
                continue;
            }

            // Specs Mapping
            const mappedSpecs: any = {};
            // Map common keys
            if (specs['pa_processeur']) mappedSpecs['CPU'] = specs['pa_processeur'];
            if (specs['pa_socket']) mappedSpecs['Socket'] = specs['pa_socket']; // Important for mobo/cpu
            if (specs['pa_chipset']) mappedSpecs['Chipset'] = specs['pa_chipset'];
            if (specs['pa_memoire']) mappedSpecs['Memory'] = specs['pa_memoire'];
            if (specs['pa_format']) mappedSpecs['Form Factor'] = specs['pa_format'];
            if (specs['pa_capacite']) mappedSpecs['Capacity'] = specs['pa_capacite'];
            if (specs['pa_frequence']) mappedSpecs['Frequency'] = specs['pa_frequence'];

            // Brand extraction
            let brand = 'Generic';
            if (productData.brand) {
                if (typeof productData.brand === 'string') brand = productData.brand;
                else if (productData.brand.name) brand = productData.brand.name;
            } else {
                // Infer brand
                const name = productData.name.toLowerCase();
                if (name.includes('msi')) brand = 'MSI';
                else if (name.includes('asus')) brand = 'ASUS';
                else if (name.includes('gigabyte')) brand = 'Gigabyte';
                else if (name.includes('intel')) brand = 'Intel';
                else if (name.includes('amd')) brand = 'AMD';
                else if (name.includes('corsair')) brand = 'Corsair';
                else if (name.includes('kingston')) brand = 'Kingston';
                else if (name.includes('wd')) brand = 'Western Digital';
                else if (name.includes('samsung')) brand = 'Samsung';
            }

            // Price
            let price = 0;
            if (productData.offers) {
                let p = productData.offers.price || productData.offers[0]?.price;
                if (p) price = parseFloat(String(p).replace(/[^0-9.]/g, ''));
            }

            // Images
            let images = [];
            if (productData.image) {
                if (Array.isArray(productData.image)) {
                    images = productData.image.map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean);
                } else if (typeof productData.image === 'object' && productData.image.url) {
                    images = [productData.image.url];
                } else if (typeof productData.image === 'string') {
                    images = [productData.image];
                }
            }

            const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(Math.random() * 1000);

            // Upsert
            const categorySlug = categoryMap[item.category] || 'components';
            const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });

            if (!cat) {
                console.error(`Category not found: ${categorySlug}`);
                continue;
            }

            await prisma.product.create({
                data: {
                    name: productData.name,
                    slug: slug,
                    description: productData.description || "",
                    price: price,
                    stock: Math.floor(Math.random() * 20) + 1,
                    inStock: true,
                    brand: brand,
                    images: JSON.stringify(images),
                    specs: JSON.stringify(mappedSpecs),
                    categoryId: cat.id,
                    status: 'APPROVED',
                }
            });

            console.log(`Created: ${productData.name} (${brand})`);

        } catch (e: any) {
            console.error(`Error ${url}: ${e.message}`);
        }
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
