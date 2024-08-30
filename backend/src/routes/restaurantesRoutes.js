const express = require('express');
const router = express.Router();
const restaurantesController = require('../controllers/restaurantesController');

router.get('/destaque', restaurantesController.getRestaurantesDestaque);

module.exports = router;