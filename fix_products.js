const fs = require('fs');

const FILE_PATH = 'lib/actions/product.ts';
let text = fs.readFileSync(FILE_PATH, 'utf8');

// Replace corrupted category logic
const dupRegex = /categoryId:\s*\$1,\s*category:\s*\{\s*id:\s*\$1,\s*name:\s*\$1,\s*slug:\s*\$1\s*\},\s*brand:\s*"[^"]+",\s*/g;
text = text.replace(dupRegex, '');

// Replace $1 with string 'composants'
text = text.replace(/\$1/g, "'composants'");

// Fix corrupted unicode strings
text = text.replace(/DÃ©couvrez/g, 'Découvrez');
text = text.replace(/MÃ¨res/g, 'Mères');
text = text.replace(/PÃ©riphÃ©riques/g, 'Périphériques');

fs.writeFileSync(FILE_PATH, text);
