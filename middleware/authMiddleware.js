const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware untuk verifikasi JWT token
exports.verifyToken = (req, res, next) => {
    // Ambil token dari header Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(403).json({ message: 'Access denied, no token provided' });
    }

    try {
        // Verifikasi token menggunakan JWT_SECRET_KEY
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;  // Menyimpan info user dalam request
        next();  // Lanjutkan ke route berikutnya
    } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
};
