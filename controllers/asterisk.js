const AsteriskManager = require("asterisk-manager");
const amiConfig = require("../config/amiConfig");

const ami = new AsteriskManager(
    amiConfig.port,
    amiConfig.host,
    amiConfig.username,
    amiConfig.password,
    true
);

ami.on("connect", () => console.log("✅ Connected to Asterisk AMI"));
ami.on("error", (err) => console.error("❌ AMI Error:", err));

module.exports = ami;
