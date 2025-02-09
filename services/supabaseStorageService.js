const supabase = require('../supabaseClient');

// Mendapatkan daftar file dari Supabase Storage
const listRecordings = async () => {
    const { data, error } = await supabase.storage.from('amjad-raka-skripsi-voip').list();

    if (error) {
        console.error('Error fetching files:', error.message);
        throw new Error('Failed to fetch files');
    }

    return data.map((file) => ({
        name: file.name,
        createdAt: file.created_at,
    }));
};

// Mendapatkan Signed URL untuk streaming file
const getSignedUrl = async (fileName) => {
    const { data, error } = await supabase.storage.from('amjad-raka-skripsi-voip').createSignedUrl(fileName, 60 * 60); // URL berlaku selama 1 jam

    if (error) {
        console.error('Error generating signed URL:', error.message);
        throw new Error('Failed to generate signed URL');
    }

    return data.signedUrl;
};

// Mengupload file ke Supabase Storage
const uploadRecording = async (filePath, fileName) => {
    const { data, error } = await supabase.storage.from('amjad-raka-skripsi-voip').upload(fileName, filePath);

    if (error) {
        console.error('Error uploading file:', error.message);
        throw new Error('Failed to upload file');
    }

    return data;
};

module.exports = { listRecordings, getSignedUrl, uploadRecording };
