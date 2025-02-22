const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const recordingRoutes = require('./routes/recordRoutes');
const callRoutes = require("./routes/callHistoryRoutes");
const channelRoutes = require("./routes/channelRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // To parse JSON requests
app.use(cors());

// Import routes
app.use('/api/auth', authRoutes); // Route untuk autentikasi
app.use('/api/recordings', recordingRoutes); // Route untuk rekaman
app.use('/api/admin',adminRoutes);
app.use("/api/calls", callRoutes);
app.use("/channels", channelRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
