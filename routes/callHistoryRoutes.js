const express = require("express");
const supabase = require("../config/supabaseClient");
const router = express.Router();

// ✅ GET Call History
router.get('/history', async (req, res) => {
    const { data, error } = await supabase
        .from('CallHistory')
        .select('*');

    if (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch call history', error });
    }
    
    res.json({ success: true, data });
});

module.exports = router;
