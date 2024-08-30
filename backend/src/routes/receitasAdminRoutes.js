// src/routes/receitasAdminRoutes.js

const express = require('express');
const router = express.Router();
const receitasAdminController = require('../controllers/receitasAdminController');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/adminMiddleware');

// Aplicar middleware de autenticação e verificação de admin para todas as rotas
router.use(verifyToken, verifyAdmin);

// Rota para listar todas as receitas
router.get('/', receitasAdminController.listarReceitas);

// Rota para atualizar uma receita
router.put('/:id', receitasAdminController.atualizarReceita);

// Rota para alternar o status de ativo no carrossel
router.put('/:id/toggle-carousel', receitasAdminController.toggleAtivoCarousel);

// Rota para apagar uma receita
router.delete('/:id', receitasAdminController.apagarOuArquivarReceita);

// Rota para obter ingredientes e passos de uma receita
router.get('/:id/ingredientes-passos', receitasAdminController.getIngredientesEPassos);

// Rota para atualizar ingredientes de uma receita
router.put('/:id/ingredientes', receitasAdminController.atualizarIngredientes);

// Rota para atualizar passos de uma receita
router.put('/:id/passos', receitasAdminController.atualizarPassos);

// Rota para criar uma nova receita
router.post('/', receitasAdminController.criarReceita);


module.exports = router;