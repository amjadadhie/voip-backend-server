const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Dummy username dan password
const users = [ // Dummy user database
    { id: 1, email: 'user@example.com', password: bcrypt.hashSync('password123', 10) }
];

exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    // Cek apakah user ada di database
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Cek password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Buat token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
};

