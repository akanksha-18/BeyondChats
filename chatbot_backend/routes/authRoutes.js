const express = require('express');
const { sendVerification, register, login, logout } = require('../controllers/authController');

const router = express.Router();

router.post('/send-verification', sendVerification);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
