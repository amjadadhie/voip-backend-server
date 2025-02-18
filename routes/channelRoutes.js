const express = require("express");
const createChannel = require("../controllers/channel");
const router = express.Router();
const ami = require("../config/amiClient"); // Client AMI

// Mulai panggilan grup
router.post("/start", (req, res) => {
    const { channelName, members } = req.body;

    if (!channelName || !members || members.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid request" });
    }

    createChannel(channelName, members);
    res.json({ success: true, message: `Group call '${channelName}' started` });
});

// Endpoint untuk mengakhiri panggilan grup
router.post("/end", (req, res) => {
    const { channelName } = req.body;

    if (!channelName) {
        return res.status(400).json({ success: false, message: "Channel name is required" });
    }

    ami.action(
        {
            Action: "Hangup",
            Channel: `PJSIP/${channelName}` // Channel yang ingin diakhiri
        },
        (err, response) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Failed to end call", error: err });
            }
            res.json({ success: true, message: `Group call '${channelName}' ended` });
        }
    );
});

module.exports = router;
