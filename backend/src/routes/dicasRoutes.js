
const express = require('express');
const router = express.Router();
const dicasController = require('../controllers/dicasController');

router.get('/aleatoria', dicasController.getDicaAleatoria);

module.exports = router;