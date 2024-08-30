// src/routes/categoriasAdminRoutes.js

const express = require('express');
const router = express.Router();
const categoriasAdminController = require('../controllers/categoriasAdminController');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/adminMiddleware');

// Aplicar middleware de autenticação e verificação de admin para todas as rotas
router.use(verifyToken, verifyAdmin);

// Rota para listar todas as categorias
router.get('/', categoriasAdminController.listarCategorias);

// Rota para adicionar uma nova categoria
router.post('/', categoriasAdminController.adicionarCategoria);

// Rota para remover uma categoria
router.delete('/:id', categoriasAdminController.removerCategoria);

module.exports = router;