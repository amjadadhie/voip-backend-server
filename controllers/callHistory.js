const supabase = require('../config/supabaseClient'); // Import koneksi Supabase

// ✅ Simpan Call History saat call dimulai
const saveCallHistory = async (caller_id, receiver_id) => {
    const { data, error } = await supabase
        .from('CallHistory')
        .insert([
            {
                call_id: crypto.randomUUID(),
                caller_id: caller_id,
                receiver_id: receiver_id,
                start_time: new Date().toISOString(),
                end_time: null
            }
        ]);

    if (error) {
        console.error('❌ Gagal menyimpan call history:', error);
        return null;
    }
    console.log('✅ Call history tersimpan:', data);
    return data;
};

// ✅ Update `end_time` saat call selesai
const updateCallEndTime = async (call_id) => {
    const { data, error } = await supabase
        .from('CallHistory')
        .update({ end_time: new Date().toISOString() })
        .eq('call_id', call_id);

    if (error) {
        console.error('❌ Gagal update end_time:', error);
        return null;
    }
    console.log('✅ Call end_time updated:', data);
    return data;
};

module.exports = { saveCallHistory, updateCallEndTime };
