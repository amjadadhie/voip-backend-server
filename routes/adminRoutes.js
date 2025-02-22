const express = require('express');
const { getActiveUsers, getActiveCalls } = require('../controllers/admin.js');

const router = express.Router();

router.get('/active-users', getActiveUsers);
router.get('/active-calls', getActiveCalls);

module.exports = router;
