const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const categories = {
    'Processors': 'https://setupgame.ma/categorie-produit/composants/processeurs/',
    'Motherboards': 'https://setupgame.ma/categorie-produit/composants/cartes-meres/',
    'Graphics Cards': 'https://setupgame.ma/categorie-produit/composants/carte-graphique/',
    'RAM': 'https://setupgame.ma/categorie-produit/composants/memoire-pc-ram/',
    // 'Storage': 'https://setupgame.ma/categorie-produit/composants/disque-dur/' // Pending verification
};

async function scrapeComponentUrls() {
    console.log('--- Scraping Component URLs ---');
    let allUrls = [];

    for (const [name, url] of Object.entries(categories)) {
        try {
            console.log(`Fetching ${name}...`);
            const { data } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            const $ = cheerio.load(data);

            let count = 0;
            $('a').each((i, el) => {
                const href = $(el).attr('href');
                if (href && href.includes('/produit/') && !allUrls.some(u => u.url === href)) {
                    allUrls.push({ url: href, category: name });
                    count++;
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
