
const fs = require('fs');
const https = require('https');
const cheerio = require('cheerio');

const categories = {
    'Processors': 'https://setupgame.ma/categorie-produit/composants/processeurs/',
    'Motherboards': 'https://setupgame.ma/categorie-produit/composants/cartes-meres/',
    'Graphics Cards': 'https://setupgame.ma/categorie-produit/composants/carte-graphique/',
    'RAM': 'https://setupgame.ma/categorie-produit/composants/memoire-pc-ram/',
};

async function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                // Follow redirect
                fetchUrl(res.headers.location).then(resolve).catch(reject);
                return;
            }
            if (res.statusCode !== 200) {
                reject(new Error(`Status Code: ${res.statusCode}`));
                return;
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function scrapeComponentUrls() {
    console.log('--- Scraping Component URLs (Native HTTPS) ---');
    let allUrls = [];

    for (const [name, url] of Object.entries(categories)) {
        try {
            console.log(`Fetching ${name}...`);
            const html = await fetchUrl(url);
            console.log(`  -> HTML length: ${html.length}`);

            const $ = cheerio.load(html);
            let count = 0;

            $('a').each((i, el) => {
                let href = $(el).attr('href');
                if (href && href.includes('/produit/') && !allUrls.some(u => u.url === href)) {
                    // Basic cleaning
                    if (href.startsWith('//')) href = 'https:' + href;
                    else if (href.startsWith('/')) href = 'https://setupgame.ma' + href;

                    if (href.startsWith('http')) {
                        allUrls.push({ url: href, category: name });
                        count++;
                    }
                }
            });
            console.log(`  -> Found ${count} products.`);

        } catch (error) {
            console.error(`  -> Error fetching ${name}: ${error.message}`);
        }
    }

    fs.writeFileSync('component_urls.json', JSON.stringify(allUrls, null, 2));
    console.log(`Saved ${allUrls.length} total URLs to component_urls.json`);
}

scrapeComponentUrls();
