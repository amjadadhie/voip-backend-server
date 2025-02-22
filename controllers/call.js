const ami = require('../services/amiClient'); 
const supabase = require('../services/supabaseClient'); 

const initiateCall = async (req, res) => {
    const { caller_id, receiver_id } = req.body;

    try {
        // 🔍 Cek apakah receiver ada di database
        const { data: receiver, error } = await supabase
            .from('User')
            .select('device_ip')
            .eq('user_id', receiver_id)
            .single();

        if (error || !receiver) {
            return res.status(404).json({ success: false, message: 'Receiver not found' });
        }

        // 🔄 Kirim perintah ke Asterisk untuk melakukan panggilan
        ami.action({
            Action: 'Originate',
            Channel: `SIP/${caller_id}`,
            Context: 'default',
            Exten: receiver_id,
            Priority: 1,
            CallerID: caller_id,
        }, (err, response) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Call initiation failed', error: err.message });
            }
            return res.status(200).json({ success: true, message: 'Call initiated', response });
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
};

module.exports = { initiateCall };
