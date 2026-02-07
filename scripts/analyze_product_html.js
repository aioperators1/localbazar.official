const cheerio = require('cheerio');
const fs = require('fs');

try {
    const html = fs.readFileSync('temp_product.html', 'utf8');
    const $ = cheerio.load(html);

    console.log('--- Product Page Analysis ---');

    // Name
    const name = $('h1.product_title').text().trim();
    console.log('Name:', name);

    // Price
    const price = $('.price').first().text().trim();
    console.log('Price:', price);

    // Image
    const image = $('.woocommerce-product-gallery__image a').first().attr('href') || $('.wp-post-image').attr('src');
    console.log('Image:', image);

    // Description (Short)
    const shortDesc = $('.woocommerce-product-details__short-description').text().trim();
    console.log('Short Description (truncated):', shortDesc.substring(0, 200));

    // Specs / Attributes
    console.log('--- Specs ---');
    $('table.woocommerce-product-attributes tr').each((i, el) => {
        const label = $(el).find('th').text().trim();
        const value = $(el).find('td').text().trim();
        console.log(`${label}: ${value}`);
    });

    // Look for other spec containers if table not found
    if ($('table.woocommerce-product-attributes').length === 0) {
        console.log('No attributes table found. Checking other containers...');
        // Sometimes specs are in the description or li elements
        $('.offer-box ul li').each((i, el) => {
            console.log('List Item Spec:', $(el).text().trim());
        });
    }

} catch (err) {
    console.error(err);
}
