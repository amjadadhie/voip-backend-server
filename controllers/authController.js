const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Untuk enkripsi password
const supabase = require('../supabaseClient'); // Mengimpor supabase client

// Login User
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Cek apakah user ada di Supabase
        const { data, error } = await supabase
            .from('users')  // Pastikan tabel "users" sudah dibuat di Supabase
            .select('*')
            .eq('username', username)
            .single();
            
        console.log(data)
        if (error || !data) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verifikasi password
        if (data.password !== password) {
            return res.status(400).json({ message: 'salah password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: data.id, username: data.username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Register User
const registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Cek apakah username sudah terdaftar
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Enkripsi password sebelum disimpan
        const hashedPassword = await bcrypt.hash(password, 10);

        // Daftarkan user baru dengan password terenkripsi
        const { data, error } = await supabase
            .from('users')
            .insert([
                { username, password: hashedPassword }  // Data user baru
            ]);

        if (error) {
            return res.status(400).json({ message: 'Failed to register user', error: error.message });
        }

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { loginUser, registerUser };
