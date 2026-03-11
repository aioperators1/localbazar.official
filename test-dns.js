const dns = require('dns');

const host = 'ep-cool-haze-aj6g95iu.us-east-2.aws.neon.tech';

dns.lookup(host, (err, address, family) => {
    if (err) {
        console.error('dns.lookup error:', err);
    } else {
        console.log('dns.lookup address:', address, 'family: IPv', family);
    }
});

dns.resolve4(host, (err, addresses) => {
    if (err) {
        console.error('dns.resolve4 error:', err);
    } else {
        console.log('dns.resolve4 addresses:', addresses);
    }
});
