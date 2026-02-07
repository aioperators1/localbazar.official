const cheerio = require('cheerio');
const fs = require('fs');

try {
    const html = fs.readFileSync('temp_home.html', 'utf8');
    const $ = cheerio.load(html);

    console.log('--- Category Link Extraction ---');
    const links = new Set();
    $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.includes('categorie-produit')) {
            links.add(href);
        }
    });

    console.log(`Found ${links.size} unique category links.`);
    [...links].sort().forEach(link => console.log(link));

} catch (err) {
    console.error(err);
}
