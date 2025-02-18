const express = require("express");
const createChannel = require("../controllers/channel");
const router = express.Router();

// Mulai panggilan grup
router.post("/start", (req, res) => {
    const { channelName, members } = req.body;

    if (!channelName || !members || members.length === 0) {
        return res.status(400).json({ success: false, message: "Invalid request" });
    }

    createChannel(channelName, members);
    res.json({ success: true, message: `Group call '${channelName}' started` });
});

module.exports = router;
