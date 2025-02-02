const express = require('express');
const { listRecordings, getSignedUrl } = require('../services/s3Service');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Endpoint untuk mendapatkan daftar rekaman
router.get('/list', verifyToken, async (req, res) => {
    try {
        const files = await listRecordings(); // Mendapatkan daftar rekaman dari S3
        res.json(files); // Mengembalikan daftar file ke client
    } catch (error) {
        console.error("Error fetching recordings: ", error); // Untuk debugging
        res.status(500).json({ message: "Error fetching recordings" }); // Pesan error
    }
});

// Endpoint untuk mendapatkan signed URL agar bisa streaming tanpa download
router.get('/stream/:fileName', verifyToken, async (req, res) => {
    try {
        const filePath = `recordings/${req.params.fileName}`; // Lokasi file di S3
        const signedUrl = await getSignedUrl(filePath); // Mendapatkan signed URL untuk streaming
        res.json({ url: signedUrl }); // Mengembalikan URL streaming
    } catch (error) {
        console.error(error); // Untuk debugging
        res.status(500).json({ message: "Error generating signed URL" }); // Pesan error
    }
});

// Protected route, hanya bisa diakses jika ada token valid
router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'You are authorized', user: req.user }); // Mengembalikan data user
});

module.exports = router;
