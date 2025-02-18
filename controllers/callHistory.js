const supabase = require("../config/supabase");

async function saveCallHistory(event) {
    const record = {
        caller: event.CallerIDNum || "Unknown",
        callee: event.ConnectedLineNum || "Unknown",
        duration: event.Duration || 0,
        timestamp: new Date().toISOString(),
        status: event.CauseTxt || "Unknown"
    };

    const { error } = await supabase.from("call_history").insert([record]);

    if (error) console.error("❌ Error inserting call history:", error);
    else console.log("✅ Call history inserted:", record);
}

module.exports = saveCallHistory;
