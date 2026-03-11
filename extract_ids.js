const fs = require('fs');
const content = fs.readFileSync('lib/actions/product.ts', 'utf8');
const ids = [...content.matchAll(/id:\s*'([0-9]+)'/g)].map(m => m[1]);
console.log(JSON.stringify(ids));
