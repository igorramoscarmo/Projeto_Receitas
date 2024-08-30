/* --------------------------------------------------------------------

    Ficheiro que contém os controladores para gerir utilizadores.

--------------------------------------------------------------------- */

const { utilizadores } = require('../models');
const { Op } = require('sequelize');

// Função para buscar todos os utilizadores
exports.getAllUsers = async (req, res) => {
    try {
        console.log('Recebida requisição para getAllUsers');
        const users = await utilizadores.findAll({
            attributes: ['idutilizador', 'username', 'email', 'ultimoLogin', 'estaLogado', 'bloqueado', 'idTipo'],
        });
        console.log('Utilizadores encontrados:', users.length);
        res.json(users);
    } catch (error) {
        console.error('Erro ao buscar utilizadores:', error);
        res.status(500).json({ message: "Erro ao buscar utilizadores.", error: error.message });
    }
};

// Função para bloquear um utilizador
exports.blockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await utilizadores.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Utilizador não encontrado." });
        }
        user.bloqueado = !user.bloqueado;
        await user.save();
        res.json({ message: `Utilizador ${user.bloqueado ? 'bloqueado' : 'desbloqueado'} com sucesso.` });
    } catch (error) {
        console.error('Erro ao bloquear/desbloquear utilizador:', error);
        res.status(500).json({ message: "Erro ao bloquear/desbloquear utilizador." });
    }
};

// Função para alterar o status de administrador de um utilizador
exports.toggleAdminStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await utilizadores.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Utilizador não encontrado." });
        }
        user.idTipo = user.idTipo === 1 ? 2 : 1;
        await user.save();
        res.json({ message: `Utilizador ${user.idTipo === 1 ? 'promovido a administrador' : 'despromovido para utilizador normal'} com sucesso.` });
    } catch (error) {
        console.error('Erro ao alterar status de administrador:', error);
        res.status(500).json({ message: "Erro ao alterar status de administrador." });
    }
};
