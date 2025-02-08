const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware untuk verifikasi JWT token
exports.verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Ambil token dari Header

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verifikasi token
        req.user = decoded; // Simpan data user ke request
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

