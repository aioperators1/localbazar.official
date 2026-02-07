const cheerio = require('cheerio');
const fs = require('fs');

try {
    const html = fs.readFileSync('temp_product.html', 'utf8');
    const $ = cheerio.load(html);

    $('script[type="application/ld+json"]').each((i, el) => {
        try {
            const data = JSON.parse($(el).html());
            let product = data;
            if (data['@graph']) {
                product = data['@graph'].find(g => g['@type'] === 'Product');
            }

            if (product && product['@type'] === 'Product') {
                console.log('Product Name:', product.name);
                if (product.additionalProperty) {
                    console.log('--- Specs ---');
                    product.additionalProperty.forEach(p => {
                        console.log(`${p.name}: ${p.value}`);
                    });
                } else {
                    console.log('No additionalProperty found.');
                }
            }
        } catch (e) { }
    });

} catch (err) {
    console.error(err);
}
