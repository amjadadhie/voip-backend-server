const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Membaca file data pengguna
const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json')));

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Cari pengguna berdasarkan email
    const user = users.find(u => u.email === email);

    if (!user || user.password !== password) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Membuat JWT token jika kredensial valid
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.json({ token }); // Mengirimkan token ke client
};

module.exports = { loginUser };
