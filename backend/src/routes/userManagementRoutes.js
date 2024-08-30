// routes/userManagementRoutes.js
const express = require('express');
const router = express.Router();
const userManagementController = require('../controllers/userManagementController');


router.get('/', userManagementController.getAllUsers);
router.put('/:id/block', userManagementController.blockUser);
router.put('/:id/admin', userManagementController.toggleAdminStatus);

module.exports = router;