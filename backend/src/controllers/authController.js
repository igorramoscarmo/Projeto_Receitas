/* --------------------------------------------------------------------

    Ficheiro que contém os controladores para autenticação.

--------------------------------------------------------------------- */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const Utilizadores = db.utilizadores;
const { secret, expiresIn } = require("../config/jwtConfig");


// Função para registar um novo utilizador
exports.register = async (req, res) => {
    try {
        console.log("Tentativa de registro com dados:", req.body);
        const { username, email, senha } = req.body;

        // Verificar se o utilizador já existe
        const existingUser = await Utilizadores.findOne({ 
            where: { 
                [db.Sequelize.Op.or]: [{ username }, { email }] 
            } 
        });

        if (existingUser) {
            console.log("Utilizador já existe");
            return res.status(400).json({ message: "Username ou email já estão em uso." });
        }

        // Criar novo utilizador
        const novoUtilizador = await Utilizadores.create({
            username,
            email,
            senha,
            idTipo: 2, // User normal
        });

        console.log("Novo utilizador criado:", novoUtilizador.idutilizador);

        res.status(201).json({ message: "Utilizador registado com sucesso." });
    } catch (error) {
        console.error("Erro ao registar utilizador:", error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: "Username ou email já estão em uso.",
                error: "Validation error"
            });
        }
        
        res.status(500).json({
            message: "Erro ao registar utilizador.",
            error: error.message
        });
    }
};

// Função para fazer login
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        const utilizador = await Utilizadores.findOne({ where: { email } });

        if (!utilizador) {
            return res.status(404).json({ message: "Utilizador não encontrado." });
        }

        if (utilizador.bloqueado) {
            return res.status(403).json({ message: "Esta conta está bloqueada. Por favor, contacte o administrador." });
        }

        const senhaValida = await bcrypt.compare(senha, utilizador.senha);

        if (!senhaValida) {
            return res.status(401).json({ message: "Senha inválida." });
        }

        utilizador.ultimoLogin = new Date();
        utilizador.estaLogado = true;
        await utilizador.save();

        const token = jwt.sign(
            { id: utilizador.idutilizador, tipo: utilizador.idTipo },
            secret,
            { expiresIn }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
            maxAge: 3600000 // 1 hora
        });


        res.json({
            message: "Login bem-sucedido.",
            user: {
                id: utilizador.idutilizador,
                username: utilizador.username,
                email: utilizador.email,
                tipo: utilizador.idTipo,
            }
        });
    } catch (error) {
        console.error("Erro durante o login:", error);
        res.status(500).json({
            message: "Erro ao fazer login.",
            error: error.message,
        });
    }
};

// Função para fazer logout
exports.logout = async (req, res) => {
    try {
        if (req.user) {
            const utilizador = await Utilizadores.findByPk(req.user.id);
            if (utilizador) {
                utilizador.estaLogado = false;
                await utilizador.save();
            }
        }
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.json({ message: "Logout bem-sucedido." });
    } catch (error) {
        console.error("Erro durante o logout:", error);
        res.status(500).json({
            message: "Erro ao fazer logout.",
            error: error.message,
        });
    }
};

// Função para verificar se o utilizador está autenticado
exports.checkAuth = async (req, res) => {
    if (req.user) {
        console.log("Utilizador autenticado:", req.user);
        res.json({
            isAuthenticated: true,
            user: {
                id: req.user.idutilizador,
                username: req.user.username,
                email: req.user.email,
                tipo: req.user.idTipo
            }
        });
    } else {
        console.log("Utilizador não autenticado");
        res.json({ isAuthenticated: false });
    }
};
