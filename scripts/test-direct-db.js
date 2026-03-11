const { Client } = require('pg');

// Attempting direct connection without pooler
// Original: postgresql://neondb_owner:npg_Rl1QomUx6GwK@ep-cool-haze-aj6g95iu-pooler.c-3.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require
// Modified: postgresql://neondb_owner:npg_Rl1QomUx6GwK@ep-cool-haze-aj6g95iu.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require

const connectionString = 'postgresql://neondb_owner:npg_Rl1QomUx6GwK@ep-cool-haze-aj6g95iu.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require';

console.log('Testing direct connection to:', connectionString);

const client = new Client({ connectionString });

client.connect()
    .then(() => {
        console.log('Successfully connected to the database directly!');
        return client.query('SELECT NOW()');
    })
    .then(res => {
        console.log('Database time:', res.rows[0]);
    })
    .catch(e => {
        console.error('Connection failed:', e.message);
        if (e.code) console.error('Error code:', e.code);
    })
    .finally(() => {
        client.end();
    });
