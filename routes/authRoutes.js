const express = require('express');
const { loginUser, registerUser, logoutUser } = require('../controllers/authController');
const { listRecordings } = require('../utils/s3Utils');
const { verifyToken } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Route untuk login
router.post('/login', loginUser);

// Route untuk registrasi
router.post('/register', registerUser);

// Route untuk log out
router.post('/logout', logoutUser);

// Route untuk mendapatkan daftar rekaman
router.get('/recordings', verifyToken, async (req, res) => {
    try {
        const recordings = await listRecordings(); // Mendapatkan daftar rekaman dari S3
        res.json({ recordings });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recordings', error: error.message });
    }
});

module.exports = router;
