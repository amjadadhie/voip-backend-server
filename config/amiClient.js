const AsteriskManager = require('asterisk-manager');
const config = require("./amiConfig"); // Mengambil konfigurasi dari amiConfig

// Membuat koneksi ke Asterisk dengan AMI
const ami = new AsteriskManager(config.port, config.host, process.env.AMI_USERNAME, process.env.AMI_PASSWORD, config.reconnect);

// Menjaga koneksi tetap aktif
// ami.keepConnected();

console.log("✅ AMI Client connected to Asterisk!");

module.exports = ami;
