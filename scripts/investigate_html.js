const cheerio = require('cheerio');
const fs = require('fs');

try {
    const html = fs.readFileSync('temp_home.html', 'utf8');
    const $ = cheerio.load(html);

    console.log('--- Analyzing HTML Structure ---');

    // Try to find products
    const productSelectors = [
        '.product-item',
        '.product-card',
        '.product',
        'li.product',
        '.woocommerce-LoopProduct-link',
        '.products .product'
    ];

    let foundProduct = false;
    for (const selector of productSelectors) {
        const products = $(selector);
        if (products.length > 0) {
            console.log(`Found ${products.length} products using selector: "${selector}"`);
            const firstProduct = products.first();
            console.log('First Product HTML (truncated):', firstProduct.html().substring(0, 500));
            foundProduct = true;
            break;
        }
    }

    if (!foundProduct) {
        console.log('No products found with common selectors. Dumping body classes...');
        console.log($('body').attr('class'));
        // dump first 500 chars of main content
        console.log($('main').html()?.substring(0, 500));
    }

    // Try to find categories
    const categories = $('.product-category a').map((i, el) => $(el).text().trim()).get();
    if (categories.length > 0) {
        console.log('Found Categories:', categories.slice(0, 5));
    } else {
        console.log('No categories found with .product-category a');
    }

} catch (err) {
    console.error('Error:', err.message);
}
