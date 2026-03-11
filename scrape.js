const fs = require('fs');
const https = require('https');
const path = require('path');

const fetchHTML = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
};

const extractProducts = (html) => {
    const products = [];
    // Techspace products usually have something similar to this in the source
    // Let's use regex to find product cards
    // Or we can grab the JSON data embedded in the page if any.
    // For now, let's extract Image URLs and Titles using basic regex.

    const titleRegex = /<a[^>]*class="grid-product__title[^>]*>([^<]+)<\/a>/g;
    const priceRegex = /<span[^>]*class="money[^>]*>([^<]+)<\/span>/g;
    const imgRegex = /<img[^>]*class="grid-product__image[^>]*src="([^"]+)"/g;

    // Alternatively, look for the standard script tags holding product JSON
    const jsonRegex = /var meta = ({.*?});/s;
    const match = html.match(jsonRegex);

    // We'll write a simple regex to grab names and images and prices from the HTML
    return products;
};

async function main() {
    console.log("Fetching home page for collections...");
    try {
        const html = await fetchHTML('https://techspace.ma/collections/all');

        let products = [];

        // Let's just grab the grid items
        const gridItems = html.split('grid-item grid-product');
        for (let i = 1; i < gridItems.length; i++) {
            const itemHtml = gridItems[i];

            const titleMatch = itemHtml.match(/<div class="grid-product__title grid-product__title--body">([^<]+)<\/div>/);
            const priceMatch = itemHtml.match(/<span class="money">([^<]+)<\/span>/);
            let imgMatch = itemHtml.match(/<img[^>]*class="grid-product__image[^>]*src="([^"]+)"/);

            if (!imgMatch) {
                // sometimes lazyloaded
                imgMatch = itemHtml.match(/data-src="([^"]+)"/);
            }
            if (!imgMatch) {
                imgMatch = itemHtml.match(/src="([^"]+)"/);
            }

            if (titleMatch && priceMatch && imgMatch) {
                let imgUrl = imgMatch[1];
                if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;

                // Clean image url to get original or high res
                imgUrl = imgUrl.replace(/_[0-9]+x\./, '.').replace(/\{width\}/, '800');

                let priceStr = priceMatch[1].replace(/[^0-9,.]/g, '').replace(',', '.');
                let price = parseFloat(priceStr);

                products.push({
                    name: titleMatch[1].trim(),
                    price: price,
                    image: imgUrl
                });
            }
        }

        console.log(`Found ${products.length} products on first page.`);
        fs.writeFileSync('scraped_products.json', JSON.stringify(products, null, 2));

    } catch (e) {
        console.error(e);
    }
}

main();
