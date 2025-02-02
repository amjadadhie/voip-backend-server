const express = require('express');
const { listRecordings, getSignedUrl } = require('../services/s3Service');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Endpoint untuk mendapatkan daftar rekaman
router.get('/list', verifyToken, async (req, res) => {
    try {
        const files = await listRecordings();
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recordings" });
    }
});

// Endpoint untuk mendapatkan signed URL agar bisa streaming tanpa download
router.get('/stream/:fileName', verifyToken, async (req, res) => {
    try {
        const signedUrl = getSignedUrl(`recordings/${req.params.fileName}`);
        res.json({ url: signedUrl });
    } catch (error) {
        res.status(500).json({ message: "Error generating signed URL" });
    }
});

module.exports = router;
