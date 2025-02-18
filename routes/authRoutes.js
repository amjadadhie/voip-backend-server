const express = require('express');
const { loginUser, registerUser, logoutUser } = require('../controllers/auth');
const { listRecordings } = require('../utils/s3Utils');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Route untuk login
router.post('/login', loginUser);

// Route untuk registrasi
router.post('/register', registerUser);

// Route untuk log out
router.post('/logout', logoutUser);

module.exports = router;
