const { Client } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_Rl1QomUx6GwK@ep-cool-haze-aj6g95iu.us-east-2.aws.neon.tech/neondb?sslmode=require";

const client = new Client({
    connectionString: connectionString,
});

async function main() {
    console.log('Connecting to:', connectionString.replace(/:[^:]*@/, ':****@'));
    try {
        await client.connect();
        console.log('Connected successfully!');
        const res = await client.query('SELECT NOW()');
        console.log('Query result:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('Connection error:', err);
        process.exit(1);
    }
}

main();
