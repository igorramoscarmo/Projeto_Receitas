const express = require('express');
const router = express.Router();
const receitasController = require('../controllers/receitasController');

// Middleware para verificar token de autenticação
const verifyToken = require('../middleware/authMiddleware');

// Rotas para receitas
// Rota para obter receitas para o carrossel da página inicial
router.get('/carousel', receitasController.getReceitasCarousel); 
// Rota para obter os dados da pesquisa
router.get('/pesquisa', receitasController.pesquisar);
// Rota para obter receitas recentes
router.get('/recentes', receitasController.getReceitasRecentes);
// Rota para obter receitas aleatórias
router.get('/aleatorias', receitasController.getReceitasAleatorias);
// Rota para obter restaurantes associados a uma receita
router.get('/:id/restaurantes', receitasController.getRestaurantesAssociados);
// Rota para obter detalhes de uma receita
router.get('/:id', receitasController.getReceitaDetalhes);


// Rotas para favoritar e avaliar receitas
router.post('/:id/favorito', verifyToken, receitasController.toggleFavorito);
router.post('/:id/avaliar', verifyToken, receitasController.avaliarReceita);

module.exports = router;