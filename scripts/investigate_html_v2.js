const cheerio = require('cheerio');
const fs = require('fs');

try {
    const html = fs.readFileSync('temp_home.html', 'utf8');
    const $ = cheerio.load(html);

    console.log('--- HTML Dump Analysis ---');
    console.log('Title:', $('title').text());

    // Dump all unique classes
    const classes = new Set();
    $('*').each((i, el) => {
        const cls = $(el).attr('class');
        if (cls) {
            cls.split(/\s+/).forEach(c => classes.add(c));
        }
    });
    console.log('Found', classes.size, 'unique classes.');
    console.log('Sample classes:', [...classes].slice(0, 50).join(', '));

    // Check for Woocommerce
    if (html.includes('woocommerce')) {
        console.log('Woocommerce detected!');
    }

    // Dump body structure (first level children)
    $('body').children().each((i, el) => {
        console.log(`Body Child ${i}: <${el.tagName} class="${$(el).attr('class')}">`);
    });

} catch (err) {
    console.error(err);
}
