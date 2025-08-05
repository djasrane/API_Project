
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { register, login, updatePassword, verifyOtp } = require('../controllers/authController');
const { verify } = require('jsonwebtoken');

router.post('/register', register);
router.post('/login', login);
router.get('/update-password', protect, verifyOtp);

module.exports = router;

