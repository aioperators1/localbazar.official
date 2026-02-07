require('dotenv').config();
const { neon } = require('@netlify/neon');

async function main() {
    console.log('Verifying data in Neon database...');

    if (!process.env.NETLIFY_DATABASE_URL) {
        console.error('Error: NETLIFY_DATABASE_URL is not defined in .env');
        process.exit(1);
    }

    try {
        const sql = neon(process.env.NETLIFY_DATABASE_URL);

        // Check products count
        const productsStart = Date.now();
        const products = await sql`SELECT count(*) FROM "Product"`;
        console.log(`Found ${products[0].count} products.`);
        console.log(`Query "Product" took ${Date.now() - productsStart}ms`);

        // Check categories count
        const categories = await sql`SELECT count(*) FROM "Category"`;
        console.log(`Found ${categories[0].count} categories.`);

        console.log('Verification successful! Database is populated and accessible.');
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
}

main();
