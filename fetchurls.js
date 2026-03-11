const fs = require('fs');
fetch('https://techspace.ma').then(r => r.text()).then(html => {
    const urls = html.match(/cdn\/shop\/files\/[^"'\s>]+/g);
    if (urls) {
        fs.writeFileSync('urls.txt', [...new Set(urls)].join('\n'));
    }
});
