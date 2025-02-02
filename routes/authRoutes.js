const express = require('express');
const { loginUser, registerUser } = require('../controllers/authController');
const { listRecordings } = require('../utils/s3Utils');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Route untuk login
router.post('/login', loginUser);

// Route untuk registrasi
router.post('/register', registerUser);

// Middleware untuk memverifikasi token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Ambil token setelah 'Bearer'
    
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded; // Menyimpan data user yang terverifikasi ke request
        next(); // Lanjutkan ke route berikutnya
    });
};

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
