const { createClient } = require('@supabase/supabase-js');
const AsteriskManager = require('asterisk-manager');
const { saveCallHistory, updateCallEndTime } = require('../controllers/callHistory'); // Import fungsi Supabase
require('dotenv').config();

// Inisialisasi Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);

const ami = new AsteriskManager(
    process.env.AMI_PORT,
    process.env.AMI_HOST,
    process.env.AMI_USERNAME,
    process.env.AMI_PASSWORD,
    true
  );

// Fungsi login Asterisk dengan Promise
const loginAsterisk = () => {
    return new Promise((resolve, reject) => {
        ami.action({
            Action: 'Login',
            Username: process.env.AST_USER,
            Secret: process.env.AST_PASS
        }, (err, response) => {
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    });
};

// // API Handler untuk login
// const loginHandler = async (req, res) => {
//     try {
//         const response = await loginAsterisk();
//         if (response.Response !== 'Success') {
//             return res.status(500).json({ error: 'Failed to login to Asterisk' });
//         }
//         return res.json({ message: 'Login successful', response });
//     } catch (error) {
//         return res.status(500).json({ error: 'Error connecting to Asterisk', details: error.message });
//     }
// };

// ✅ Event saat call dimulai
ami.on('Newchannel', async (event) => {
    console.log('📞 Call Started:', event);
    
    const caller_id = event.CallerIDNum; // Ambil Caller ID
    const receiver_id = event.Exten;     // Ambil Receiver ID

    // Simpan call history ke Supabase
    await saveCallHistory(caller_id, receiver_id);
});

// ✅ Event saat call selesai
ami.on('Hangup', async (event) => {
    console.log('📴 Call Ended:', event);
    
    const call_id = event.Uniqueid; // Gunakan Unique ID dari Asterisk

    // Update end_time di Supabase
    await updateCallEndTime(call_id);
});

ami.keepConnected();

ami.on('ready', () => console.log('✅ AMI Connected'));
ami.on('error', (err) => console.error('❌ AMI Error:', err));

console.log("✅ AMI Client connected to Asterisk!");


// module.exports = { loginHandler, ami };

module.exports = ami;
