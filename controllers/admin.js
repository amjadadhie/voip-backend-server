const supabase = require('../config/supabaseClient');
const ami = require('../config/amiClient');

const getActiveUsers = async (req, res) => {
    try {
        // Ambil user yang is_online = true
        const { data: activeUsers, error } = await supabase
            .from('User')
            .select('user_id, email, device_ip')
            .eq('is_online', true);

        if (error) {
            console.error('Error fetching active users:', error.message);
            return res.status(500).json({ success: false, message: 'Failed to fetch active users' });
        }

        return res.status(200).json({ success: true, activeUsers });
    } catch (error) {
        console.error('Internal Server Error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// const getActiveCalls = (req, res) => {
//     ami.action({
//         Action: 'Command',
//         Command: 'core show channels'
//     }, (err, response) => {
//         if (err) {
//             return res.status(500).json({ error: 'Failed to fetch active calls', details: err.message });
//         }
//         return res.json({ success: true, data: response });
//     });
// };


// Handler untuk mendapatkan daftar panggilan aktif
const getActiveCalls = (req, res) => {
    ami.action({
        Action: 'CoreShowChannels'
    }, (err, response) => {
        if (err) {
            console.error('❌ Error fetching active calls:', err);
            return res.status(500).json({ success: false, message: 'Failed to get active calls' });
        }

        const activeCalls = response.Channels || [];
        return res.json({ success: true, activeCalls });
    });
};


module.exports = { getActiveUsers, getActiveCalls };
