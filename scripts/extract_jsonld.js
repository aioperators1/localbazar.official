const cheerio = require('cheerio');
const fs = require('fs');

try {
    const html = fs.readFileSync('temp_product.html', 'utf8');
    const $ = cheerio.load(html);

    console.log('File size:', html.length);

    const jsonLds = [];
    $('script[type="application/ld+json"]').each((i, el) => {
        try {
            const data = JSON.parse($(el).html());
            jsonLds.push(data);
        } catch (e) {
            console.error('Error parsing JSON-LD:', e.message);
        }
    });

    console.log(`Found ${jsonLds.length} JSON-LD blocks.`);

    // Look for Product schema
    const product = jsonLds.find(item => {
        if (item['@type'] === 'Product') return true;
        if (item['@graph']) {
            return item['@graph'].some(g => g['@type'] === 'Product');
        }
        return false;
    });

    if (product) {
        console.log('--- FOUND PRODUCT SCHEMA ---');
        let prodData = product;
        if (product['@graph']) {
            prodData = product['@graph'].find(g => g['@type'] === 'Product');
        }
        console.log(JSON.stringify(prodData, null, 2));
    } else {
        console.log('No Product schema found.');
        // Dump all for inspection
        console.log(JSON.stringify(jsonLds, null, 2));
    }

} catch (err) {
    console.error(err);
}
