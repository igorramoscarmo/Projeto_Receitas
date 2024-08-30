/* --------------------------------------------------------------------

    Ficheiro que contém o middleware para verificar o token de autenticação.

--------------------------------------------------------------------- */


const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwtConfig');
const { utilizadores } = require('../models');


// Função para verificar o token de autenticação
const verifyToken = async (req, res, next) => {
    const token = req.cookies.token || req.headers["authorization"]?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "Token não fornecido." });
    }

    try {
        const decoded = jwt.verify(token, secret);
        const user = await utilizadores.findByPk(decoded.id);
        
        if (!user) {
            return res.status(401).json({ message: "Utilizador não encontrado." });
        }

        if (user.bloqueado) {
            return res.status(403).json({ message: "Conta bloqueada. Contacte o administrador." });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Erro na verificação do token:", error);
        return res.status(401).json({ message: "Token inválido." });
    }
};

module.exports = verifyToken;