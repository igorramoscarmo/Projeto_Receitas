// Backend da aplicação
const express = require("express");
const sequelize = require("./config/database");
const db = require("./models"); // Carregar todos os modelos
const seedDatabase = require("./config/seed"); // Importar função de seed
const cookieParser = require("cookie-parser");
const verifyToken = require("./middleware/authMiddleware");
const verifyAdmin = require("./middleware/adminMiddleware");

// Importar rotas
const authRoutes = require("./routes/authRoutes");
const receitasRoutes = require("./routes/receitasRoutes");
const restaurantesRoutes = require("./routes/restaurantesRoutes");
const dicasRoutes = require("./routes/dicasRoutes");
const userManagementRoutes = require('./routes/userManagementRoutes');
const receitasAdminRoutes = require('./routes/receitasAdminRoutes'); 
const categoriasAdminRoutes = require('./routes/categoriasAdminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

const cors = require("cors");
app.use(
    cors({
        origin: "http://localhost:3001", // Permitir apenas pedidos do frontend que está a correr em localhost:3001
        credentials: true,
    })
);

// Middleware para análise do corpo das requisições
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rotas públicas
app.use("/api/auth", authRoutes);
app.use("/api/receitas", receitasRoutes);
app.use("/api/restaurantes", restaurantesRoutes);
app.use("/api/dicas", dicasRoutes);


// Rotas protegidas (requerem autenticação)
app.use("/api/user", verifyToken, (req, res) => {
    res.json({ message: "Rota protegida para utilizadores autenticados" });
});

// Rotas de gestão de utilizadores (apenas para administradores)
app.use("/api/admin/users", verifyToken, verifyAdmin, userManagementRoutes);
// Rota para gestão de receitas (apenas para administradores)
app.use("/api/admin/receitas", verifyToken, verifyAdmin, receitasAdminRoutes);
// Rota para gestão de categorias (apenas para administradores)
app.use("/api/admin/categorias", verifyToken, verifyAdmin, categoriasAdminRoutes);

// Rota genérica para administradores (deve vir depois das rotas específicas)
app.use("/api/admin", verifyToken, verifyAdmin, (req, res) => {
    res.json({ message: "Rota protegida para administradores" });
});

// Função para verificar se a base de dados contém dados
const checkAndSeedDatabase = async () => {
    try {
        const usersCount = await db.utilizadores.count();
        if (usersCount === 0) {
            console.log(
                "A base de dados está vazia. Populando com dados iniciais..."
            );
            await seedDatabase();
        } else {
            console.log("A base de dados já contém dados.");
        }
    } catch (error) {
        console.error("Erro ao verificar/popular a base de dados:", error);
    }
};

// Testar a conexão com a base de dados e sincronizar modelos
sequelize
    .authenticate()
    .then(async () => {
        console.log("Conexão com a base de dados estabelecida com sucesso.");
        await sequelize.sync();
        await checkAndSeedDatabase(); // Verificar e popular a base de dados, se necessário
    })
    .catch((err) => {
        console.error("Não foi possível conectar à base de dados:", err);
    });

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Algo correu mal!");
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor está a correr em http://localhost:${PORT}`);
});

module.exports = app;