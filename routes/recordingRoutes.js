const express = require('express');
const { listRecordings, getSignedUrl, uploadRecording } = require('../services/supabaseStorageService');
const multer = require('multer'); // Untuk menangani file upload

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Lokasi penyimpanan sementara

// Endpoint untuk mendapatkan daftar rekaman
router.get('/list', async (req, res) => {
    try {
        const files = await listRecordings(); // Mendapatkan daftar rekaman dari Supabase
        res.json(files); // Mengembalikan daftar file ke client
    } catch (error) {
        console.error('Error fetching recordings: ', error.message); // Untuk debugging
        res.status(500).json({ message: 'Error fetching recordings' }); // Pesan error
    }
});

// Endpoint untuk mendapatkan Signed URL agar bisa streaming tanpa download
router.get('/stream/:fileName', async (req, res) => {
    try {
        const fileName = req.params.fileName; // Nama file di Supabase
        const signedUrl = await getSignedUrl(fileName); // Mendapatkan signed URL untuk streaming
        res.json({ url: signedUrl }); // Mengembalikan URL streaming
    } catch (error) {
        console.error('Error generating signed URL:', error.message); // Untuk debugging
        res.status(500).json({ message: 'Error generating signed URL' }); // Pesan error
    }
});

// Endpoint untuk upload file ke Supabase Storage
router.post('/upload', upload.single('recording'), async (req, res) => {
    try {
        const filePath = req.file.path; // Path file sementara
        const fileName = req.file.originalname; // Nama asli file

        // Upload ke Supabase Storage
        const uploadResult = await uploadRecording(filePath, fileName);

        res.status(201).json({ success: true, message: 'File uploaded successfully', data: uploadResult });
    } catch (error) {
        console.error('Error uploading file:', error.message); // Untuk debugging
        res.status(500).json({ message: 'Error uploading file' }); // Pesan error
    }
});

// Protected route (dummy untuk testing autentikasi dari Supabase)
router.get('/protected', async (req, res) => {
    try {
        const user = req.authenticatedUser; // Asumsinya ini berasal dari Supabase middleware (opsional jika diterapkan)
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.json({ message: 'You are authorized', user });
    } catch (error) {
        console.error('Error in protected route:', error.message);
        res.status(500).json({ message: 'Error in protected route' });
    }
});

module.exports = router;
