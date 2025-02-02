const jwt = require('jsonwebtoken');
// const { verifyToken } = require('../middleware/authMiddleware');

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'You are authorized', user: req.user });
});
