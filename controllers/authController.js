const supabase = require('../supabaseClient'); // Mengimpor Supabase client

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1️⃣ Autentikasi ke Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        // Jika gagal login, kembalikan error
        if (authError) {
            console.error('Login Error:', authError.message);
            return res.status(400).json({ success: false, message: authError.message });
        }

        // 2️⃣ Ambil informasi user tambahan dari tabel `User`
        const userId = authData.user.id;

        // 3️⃣ Update status is_online menjadi true
        const { error: updateError } = await supabase
            .from('User')
            .update({ is_online: true })
            .eq('user_id', userId);

        if (updateError) {
            console.error('Failed to update user status:', updateError.message);
            return res.status(500).json({ success: false, message: 'Failed to update user status' });
        }

        const { data: userData, error: userError } = await supabase
            .from('User')
            .select('user_id, email, device_ip, is_online')
            .eq('user_id', userId)
            .single();

        if (userError || !userData) {
            console.error('User Data Error:', userError?.message || 'No user data found');
            return res.status(404).json({ success: false, message: 'User data not found in the database.' });
        }

        return res.status(200).json({ success: true, user: { ...userData, token: authData.session.access_token } });
    } catch (error) {
        console.error('Internal Server Error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Register User
const registerUser = async (req, res) => {
    const { email, password} = req.body;

    try {
        // 1️⃣ Daftarkan user baru melalui Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password
        });

        if (authError) {
            console.error('Registration Error:', authError.message);
            return res.status(400).json({ success: false, message: authError.message });
        }

        // 2️⃣ Simpan data tambahan ke tabel `User` (jika ada)
        const userId = authData.user.id;
        const { error: insertError } = await supabase
            .from('User')
            .insert([
                {
                    user_id: userId,
                    email,
                    is_online: true // Default online status saat register
                }
            ]);

        if (insertError) {
            console.error('Insert User Error:', insertError.message);
            return res.status(400).json({ success: false, message: 'Failed to save user data in database' });
        }

        res.status(201).json({ success: true, message: 'User registered successfully', token: authData.session.access_token  });
    } catch (error) {
        console.error('Internal Server Error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Logout User
const logoutUser = async (req, res) => {
    try {
        // Dapatkan user dari token di header Authorization
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Token is missing' });
        }

        // Validasi token menggunakan Supabase
        const { data: userData, error: userError } = await supabase.auth.getUser(token);
        if (userError) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        const userId = userData.user.id;

        // Update status is_online menjadi false di database
        const { error: updateError } = await supabase
            .from('User')
            .update({ is_online: false })
            .eq('user_id', userId);

        if (updateError) {
            console.error('Database Update Error:', updateError.message);
            return res.status(500).json({ success: false, message: 'Failed to update user status' });
        }

        // Logout user melalui Supabase Auth
        const { error: logoutError } = await supabase.auth.signOut();
        if (logoutError) {
            console.error('Logout Error:', logoutError.message);
            return res.status(400).json({ success: false, message: 'Failed to log out' });
        }
        
        res.status(200).json({ success: true, message: 'User logged out successfully' });
    } catch (error) {
        console.error('Internal Server Error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = { loginUser, registerUser, logoutUser };
