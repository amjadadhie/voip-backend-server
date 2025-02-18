const express = require("express");
const supabase = require("../config/supabase");
const router = express.Router();

// Ambil call history berdasarkan user ID
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    const { data, error } = await supabase
        .from("call_history")
        .select("*")
        .eq("caller", userId)
        .order("timestamp", { ascending: false });

    if (error) return res.status(500).json({ success: false, message: "Error fetching call history" });

    res.json({ success: true, callHistory: data });
});

module.exports = router;
