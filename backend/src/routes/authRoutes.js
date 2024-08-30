const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', verifyToken, authController.logout);

router.get('/check', verifyToken, authController.checkAuth);

module.exports = router;