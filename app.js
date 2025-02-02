const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const recordingRoutes = require('./routes/recordingRoutes');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // To parse JSON requests

// Import routes
app.use('/api/auth', authRoutes); // Route untuk autentikasi
app.use('/api/recordings', recordingRoutes); // Route untuk rekaman

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
