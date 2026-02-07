const axios = require('axios');
const cheerio = require('cheerio');

const categories = [
    'https://setupgame.ma/categorie-produit/composants/processeurs/',
    'https://setupgame.ma/categorie-produit/composants/cartes-meres/',
    'https://setupgame.ma/categorie-produit/composants/carte-graphique/',
    'https://setupgame.ma/categorie-produit/composants/memoire-pc-ram/', // Verified
    // 'https://setupgame.ma/categorie-produit/composants/stockage/' // Empty/Invalid
];

async function checkCategories() {
    for (const url of categories) {
        try {
            console.log(`Checking ${url}...`);
            const { data } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html'
                }
            });
            const $ = cheerio.load(data);
            const productCount = $('.product').length;
            console.log(`  -> Status: OK, Products found: ${productCount}`);
        } catch (error) {
            console.log(`  -> Status: ${error.response ? error.response.status : error.message}`);
        }
    }
}

checkCategories();
