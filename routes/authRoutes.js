const express = require('express');
const { loginUser } = require('../controllers/authController');
const { listRecordings } = require('../utils/s3Utils');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Route untuk login
router.post('/login', loginUser);

// Middleware untuk memverifikasi token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
};

// Route untuk mendapatkan daftar rekaman
router.get('/recordings', verifyToken, async (req, res) => {
    try {
        const recordings = await listRecordings();
        res.json({ recordings });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recordings', error: error.message });
    }
});

module.exports = router;
