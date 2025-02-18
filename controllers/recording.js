const supabase = require("../config/supabase");

async function saveRecording(callId, filePath) {
    const fileBuffer = require("fs").readFileSync(filePath);

    const { data, error } = await supabase.storage.from("recordings").upload(`calls/${callId}.wav`, fileBuffer, {
        contentType: "audio/wav"
    });

    if (error) console.error("❌ Error uploading recording:", error);
    else console.log("✅ Recording uploaded:", data);
}

module.exports = saveRecording;
