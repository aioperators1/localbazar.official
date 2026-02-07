import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed from setupgame.ma...');

    const urlsPath = path.join(__dirname, '../product_urls.txt');
    if (!fs.existsSync(urlsPath)) {
        console.error('product_urls.txt not found. Please run scripts/extract_links.js first.');
        return;
    }

    const urls = fs.readFileSync(urlsPath, 'utf8').split('\n').filter(url => url.trim() !== '');
    console.log(`Found ${urls.length} URLs to process.`);

    // Ensure category exists
    const category = await prisma.category.upsert({
        where: { slug: 'gaming-pcs' },
        create: {
            name: 'Gaming PCs',
            slug: 'gaming-pcs',
            image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1000",
        },
        update: {},
    });

    for (const url of urls) {
        try {
            console.log(`Processing: ${url}`);

            // Random delay between 1s and 3s
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

            const { data: html } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                }
            });
            const $ = cheerio.load(html);

            let productData: any = {};
            let specs: any = {};

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
                                if (p.name && p.value) {
                                    specs[p.name] = p.value;
                                }
                            });
                        }
                    }
                } catch (e) {
                    // ignore parse errors
                }
            });

            // Fallback if no JSON-LD
            if (!productData.name) {
                const title = $('h1.product_title').text().trim();
                const price = $('.price bdi').first().text().replace(/[^0-9.]/g, '');
                const image = $('.woocommerce-product-gallery__image a').first().attr('href');

                if (title) productData.name = title;
                if (price) productData.offers = { price: price };
                if (image) productData.image = image;
            }

            if (!productData.name) {
                console.log(`Skipping ${url} - No product data found.`);
                continue;
            }

            // Specs mapping
            const mappedSpecs: any = {};
            if (specs['pa_processeur']) mappedSpecs['CPU'] = specs['pa_processeur'];
            if (specs['pa_carte-graphique']) mappedSpecs['GPU'] = specs['pa_carte-graphique'];
            if (specs['pa_ram']) mappedSpecs['RAM'] = specs['pa_ram'];
            if (specs['pa_stockage-ssd']) mappedSpecs['SSD'] = specs['pa_stockage-ssd'];
            if (specs['pa_carte-mere']) mappedSpecs['Motherboard'] = specs['pa_carte-mere'];
            if (specs['pa_boitier']) mappedSpecs['Case'] = specs['pa_boitier'];
            if (specs['pa_psu']) mappedSpecs['PSU'] = specs['pa_psu'];

            // Brand extraction
            let brand = 'Setup Game';
            if (productData.brand) {
                if (typeof productData.brand === 'string') {
                    brand = productData.brand;
                } else if (productData.brand.name) {
                    brand = productData.brand.name;
                }
            } else {
                // Try to infer from name for common brands if not Setup Game
                const name = productData.name.toLowerCase();
                if (name.includes('msi')) brand = 'MSI';
                else if (name.includes('asus')) brand = 'ASUS';
                else if (name.includes('lenovo')) brand = 'Lenovo';
                else if (name.includes('hp')) brand = 'HP';
                else if (name.includes('dell')) brand = 'Dell';
                else if (name.includes('razer')) brand = 'Razer';
                else if (name.includes('logitech')) brand = 'Logitech';
            }

            // Simplify images to string array JSON
            let images = [];
            if (productData.image) {
                if (Array.isArray(productData.image)) {
                    // Sometimes it is an object with url
                    images = productData.image.map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean);
                } else if (typeof productData.image === 'object' && productData.image.url) {
                    images = [productData.image.url];
                } else if (typeof productData.image === 'string') {
                    images = [productData.image];
                }
            }

            // If no images from JSON-LD, try cheerio
            if (images.length === 0) {
                const img = $('meta[property="og:image"]').attr('content');
                if (img) images.push(img);
            }

            const price = productData.offers?.price || productData.offers?.[0]?.price || '0';
            const cleanPrice = parseFloat(String(price).replace(/[^0-9.]/g, ''));

            // Upsert product
            // Generate slug from name
            const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(Math.random() * 1000);

            // Check if product exists by name (approx) or SKU
            // For now, we'll just create new ones or update if slug matches (unlikely with random suffix)
            // Better: Check by name or just insert.
            // Since we're seeding, maybe we want to avoid dups.
            const existing = await prisma.product.findFirst({
                where: { name: productData.name }
            });

            if (existing) {
                console.log(`Product "${productData.name}" already exists. Updating...`);
                await prisma.product.update({
                    where: { id: existing.id },
                    data: {
                        price: cleanPrice,
                        stock: 10, // Default stock
                        specs: JSON.stringify(mappedSpecs),
                        images: JSON.stringify(images),
                        inStock: true,
                        brand: brand,
                        description: productData.description || "No description available.",
                    }
                });
            } else {
                await prisma.product.create({
                    data: {
                        name: productData.name,
                        slug: slug,
                        description: productData.description || "No description available.",
                        price: cleanPrice,
                        stock: 10,
                        inStock: true,
                        brand: brand,
                        images: JSON.stringify(images),
                        specs: JSON.stringify(mappedSpecs),
                        categoryId: category.id,
                        status: 'APPROVED',
                    }
                });
                console.log(`Created product: ${productData.name}`);
            }

        } catch (error: any) {
            console.error(`Error processing ${url}: ${error.message}`);
        }
    }

    console.log('Seed completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
