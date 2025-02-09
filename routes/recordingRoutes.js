const express = require('express');
const { listRecordings, getSignedUrl, uploadRecording } = require('../services/supabaseStorageService');
const multer = require('multer'); // Untuk menangani file upload

const router = express.Router();
// const upload = multer({ dest: 'uploads/' }); // Lokasi penyimpanan sementara
// Konfigurasi Multer untuk membaca file sebagai buffer
const storage = multer.memoryStorage(); // Gunakan memoryStorage agar dapat mengakses buffer langsung
const upload = multer({ storage: storage });

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
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileBuffer = req.file.buffer; // Ambil buffer file dari Multer

        const path = require('path'); // Import path module

        const fileExtension = path.extname(req.file.originalname); // Dapatkan ekstensi (misalnya: .mp3)
        const fileBaseName = path.basename(req.file.originalname, fileExtension); // Nama file tanpa ekstensi
        const fileName = `${Date.now()}-${fileBaseName.replace(/\s+/g, '_')}`;

        const mimeType = req.file.mimetype; // MIME type dari Multer

        // Upload ke Supabase Storage
        const uploadResult = await uploadRecording(fileBuffer, fileName, mimeType);

        res.status(201).json({ success: true, message: 'File uploaded successfully', data: uploadResult });
    } catch (error) {
        console.error('Error uploading file:', error.message);
        res.status(500).json({ message: 'Error uploading file' });
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
