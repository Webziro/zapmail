const tls = require('tls');

const HOST = 'ac-7ibiouy-shard-00-00.diddigs.mongodb.net';
const PORT = 27017;

console.log(`Connecting to ${HOST}:${PORT}...`);

const socket = tls.connect(PORT, HOST, { rejectUnauthorized: false }, () => {
    console.log('✅ TLS connection established successfully.');
    console.log('Cipher:', socket.getCipher());
    socket.end();
});

socket.on('error', (err) => {
    console.error('❌ TLS error:', err);
});

socket.setTimeout(5000);
socket.on('timeout', () => {
    console.error('❌ Connection timed out.');
    socket.destroy();
});
