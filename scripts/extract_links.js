const cheerio = require('cheerio');
const fs = require('fs');

try {
    const html = fs.readFileSync('temp_home.html', 'utf8');
    const $ = cheerio.load(html);

    console.log('--- Product Link Extraction ---');
    const links = new Set();
    $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.includes('/produit/')) {
            links.add(href);
        }
    });

    console.log(`Found ${links.size} unique product links.`);
    const linkArray = [...links];

    fs.writeFileSync('product_urls.txt', linkArray.join('\n'));
    console.log('Saved links to product_urls.txt');

} catch (err) {
    console.error(err);
}
