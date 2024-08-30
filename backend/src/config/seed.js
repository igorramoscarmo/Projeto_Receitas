/* --------------------------------------------------------------------

    Ficheiro que popula a base de dados.
    Este ficheiro vai ser executado automaticamente se a base de dados estiver vazia.
    Esse teste é feito no ficheiro app.js

--------------------------------------------------------------------- */

// Importar os dados da base de dados
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');
// Importar os modelos da base de dados
const {
    tipo_utilizador,
    utilizadores,
    restaurantes,
    categorias,
    receitas,
    receita_categorias,
    instrucoes,
    ingredientes,
    receita_ingredientes,
    receitas_restaurantes,
    ingredientes_rr,
    pedidos_parcerias,
    publicidades,
    planos,
    assinaturas_clientes,
    pagamento_assinaturas,
    historico_receitas,
    comentarios,
    foto_categoria,
    dicas,
    restaurante_categorias
} = require('../models');

// Função para encriptar a password
const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Função para, assincronamente, popular a base de dados
const seedDatabase = async () => {
    try {
        // Sincronizar a base de dados
        // Se esta função for executada, a base de dados é apagada e recriada
        // Isso acontece porque o parâmetro force é true
        await sequelize.sync({ force: true });

        console.log('Todos os dados existentes foram apagados.');

        /* -------------------------------------------
        Inserir os dados na base de dados
        ------------------------------------------- */

        await tipo_utilizador.bulkCreate([
            { nome: 'administrador' },
            { nome: 'user' }
        ]);

        const userPasswords = ['admin123', '12345', '54321', 'rest123', 'rest456', 'rest789', 'rest012'];
        const encryptedPasswords = await Promise.all(userPasswords.map(encryptPassword));
        
        await utilizadores.bulkCreate([
            { username: 'admin', senha: encryptedPasswords[0], email: 'admin@example.com', idTipo: 1, ultimoLogin: new Date(), estaLogado: true, bloqueado: false },
            { username: 'joao123', senha: encryptedPasswords[1], email: 'joao@example.com', idTipo: 2, ultimoLogin: new Date(), estaLogado: true, bloqueado: false },
            { username: 'maria456', senha: encryptedPasswords[2], email: 'maria@example.com', idTipo: 2, ultimoLogin: new Date(), estaLogado: false, bloqueado: false },
            { username: 'restaurantes', senha: encryptedPasswords[3], email: 'restaurantea@gmail.com', idTipo: 2, ultimoLogin: new Date(), estaLogado: false, bloqueado: true },
            { username: 'restauranteB', senha: encryptedPasswords[4], email: 'restauranteb@gmail.com', idTipo: 2, ultimoLogin: new Date(), estaLogado: false, bloqueado: false },
            { username: 'restauranteC', senha: encryptedPasswords[5], email: 'restaurantec@gmail.com', idTipo: 2, ultimoLogin: new Date(), estaLogado: false, bloqueado: false },
            { username: 'restauranteD', senha: encryptedPasswords[6], email: 'restaurantedgmail.com', idTipo: 2, ultimoLogin: new Date(), estaLogado: true, bloqueado: false }
        ]);

        await restaurantes.bulkCreate([
            { nome: 'Restaurante A', localizacao: 'Rua A, Cidade A', contacto: '123456789', idutilizador: 4, folder: '0001', website: 'restaurantea.com'},
            { nome: 'Restaurante B', localizacao: 'Rua B, Cidade B', contacto: '987654321', idutilizador: 5, folder: '0002', website: 'restauranteb.com'},
            { nome: 'Restaurante C', localizacao: 'Rua C, Cidade C', contacto: '456789123', idutilizador: 6, folder: '0003', website: 'restaurantec.com'},
            { nome: 'Restaurante D', localizacao: 'Rua D, Cidade D', contacto: '789123456', idutilizador: 7, folder: '0004', website: 'restauranted.com'},
            { nome: 'Restaurante E', localizacao: 'Rua E, Cidade E', contacto: '321654987', idutilizador: 4, folder: '0005', website: 'restaurantee.com'},
            { nome: 'Restaurante F', localizacao: 'Rua F, Cidade F', contacto: '654987321', idutilizador: 4, folder: '0006', website: 'restaurantef.com'},
            { nome: 'Restaurante G', localizacao: 'Rua G, Cidade G', contacto: '987321654', idutilizador: 4, folder: '0007', website: 'restauranteg.com'},
            { nome: 'Restaurante H', localizacao: 'Rua H, Cidade H', contacto: '321987654', idutilizador: 4, folder: '0008', website: 'restauranteh.com'}
        ]);

        await categorias.bulkCreate([
            { nome: 'Sobremesa' },
            { nome: 'Prato Principal' },
            { nome: 'Salada' },
            { nome: 'Doce' },
            { nome: 'Carne' },
            { nome: 'Massa' },
            { nome: 'Peixe' },
            { nome: 'Vegetariano' },
            { nome: 'Sopa' },
            { nome: 'Tipica Portuguesa' },
            { nome: 'Italiana' },
            { nome: 'Saudável' },

        ]);

        await restaurante_categorias.bulkCreate([
            { idRestaurante: 1, idCategorias: 1 },
            { idRestaurante: 1, idCategorias: 2 },
            { idRestaurante: 1, idCategorias: 6 },
            { idRestaurante: 1, idCategorias: 11 },
            { idRestaurante: 2, idCategorias: 2 },
            { idRestaurante: 2, idCategorias: 7 },
            { idRestaurante: 2, idCategorias: 10 },
            { idRestaurante: 3, idCategorias: 2 },
            { idRestaurante: 3, idCategorias: 3 },
            { idRestaurante: 3, idCategorias: 8 },
            { idRestaurante: 3, idCategorias: 9 },
            { idRestaurante: 3, idCategorias: 12 },
            { idRestaurante: 4, idCategorias: 2 },
            { idRestaurante: 4, idCategorias: 5 },
            { idRestaurante: 4, idCategorias: 7 },
            { idRestaurante: 4, idCategorias: 9 },
            { idRestaurante: 4, idCategorias: 10 },
            { idRestaurante: 5, idCategorias: 1 },
            { idRestaurante: 5, idCategorias: 2 },
            { idRestaurante: 5, idCategorias: 6 },
            { idRestaurante: 5, idCategorias: 8 },
            { idRestaurante: 6, idCategorias: 11 },
            { idRestaurante: 6, idCategorias: 12 },
            { idRestaurante: 7, idCategorias: 2 },
            { idRestaurante: 7, idCategorias: 5 },
            { idRestaurante: 7, idCategorias: 6 },
            { idRestaurante: 7, idCategorias: 11 },
            { idRestaurante: 8, idCategorias: 2 },
            { idRestaurante: 8, idCategorias: 5 },
            { idRestaurante: 8, idCategorias: 6 }
        ]);


        await receitas.bulkCreate([
            { titulo: 'Bolo de Chocolate', descricao: 'Uma deliciosa receita de bolo de chocolate.', dificuldade: 'Fácil', folder: '0001', bannerImage: 'banner.jpg', ativoCarousel: true, visitas: 10, arquivada: false },
            { titulo: 'Lasanha à Bolonhesa', descricao: 'Receita clássica de lasanha com molho bolonhesa.', dificuldade: 'Médio', folder: '0002', bannerImage: 'banner.jpg', ativoCarousel: true, visitas: 20, arquivada: false },
            { titulo: 'Salada Caesar', descricao: 'Salada clássica com molho Caesar.', dificuldade: 'Fácil', folder: '0003', bannerImage: 'banner.jpg', ativoCarousel: false, visitas: 12, arquivada: false },
            { titulo: 'Sopa de Legumes', descricao: 'Sopa nutritiva de legumes.', dificuldade: 'Fácil', folder: '0004', bannerImage: 'banner.jpg', ativoCarousel: false, visitas: 15, arquivada: false },
            { titulo: 'Frango Assado', descricao: 'Frango assado ao forno.', dificuldade: 'Médio', folder: '0005', bannerImage: 'banner.jpg', ativoCarousel: false, visitas: 8, arquivada: false },
            { titulo: 'Pizza Margherita', descricao: 'Pizza tradicional italiana.', dificuldade: 'Médio', folder: '0006', bannerImage: 'banner.jpg', ativoCarousel: false, visitas: 5, arquivada: false },
            { titulo: 'Tiramisu', descricao: 'Sobremesa clássica italiana.', dificuldade: 'Difícil', folder: '0007', bannerImage: 'banner.jpg', ativoCarousel: false, visitas: 3, arquivada: false },
            { titulo: 'Bife com Batatas', descricao: 'Bife grelhado com batatas.', dificuldade: 'Médio', folder: '0008', bannerImage: 'banner.jpg', ativoCarousel: true, visitas: 25, arquivada: false },
            { titulo: 'Bacalhau à Brás', descricao: 'Tradicional prato português de bacalhau.', dificuldade: 'Médio', folder: '0009', bannerImage: 'banner.jpg', ativoCarousel: true, visitas: 18, arquivada: false },
            { titulo: 'Risoto de Cogumelos', descricao: 'Cremoso risoto italiano com cogumelos frescos.', dificuldade: 'Médio', folder: '0010', bannerImage: 'banner.jpg', ativoCarousel: false, visitas: 22, arquivada: false }

        ]);

        await receita_categorias.bulkCreate([
            { idreceitas: 1, idCategorias: 1 },
            { idreceitas: 1, idCategorias: 4 },
            { idreceitas: 2, idCategorias: 2 },
            { idreceitas: 2, idCategorias: 5 },
            { idreceitas: 2, idCategorias: 6 },
            { idreceitas: 2, idCategorias: 11 },
            { idreceitas: 3, idCategorias: 3 },
            { idreceitas: 3, idCategorias: 12 },
            { idreceitas: 4, idCategorias: 2 },
            { idreceitas: 5, idCategorias: 2 },
            { idreceitas: 5, idCategorias: 5 },
            { idreceitas: 6, idCategorias: 2 },
            { idreceitas: 6, idCategorias: 6 },
            { idreceitas: 6, idCategorias: 11 },
            { idreceitas: 7, idCategorias: 1 },
            { idreceitas: 7, idCategorias: 4 },
            { idreceitas: 7, idCategorias: 11 },
            { idreceitas: 8, idCategorias: 2 },
            { idreceitas: 8, idCategorias: 5 },
            { idreceitas: 9, idCategorias: 2 },
            { idreceitas: 9, idCategorias: 7 },
            { idreceitas: 9, idCategorias: 10 },
            { idreceitas: 10, idCategorias: 2 },
            { idreceitas: 10, idCategorias: 8 },
            { idreceitas: 10, idCategorias: 11 },
            { idreceitas: 10, idCategorias: 12 }
            
        ]);

        await instrucoes.bulkCreate([
            { ordem: 1, descricao: 'Pré-aqueça o forno a 180°C.', idreceitas: 1 },
            { ordem: 2, descricao: 'Misture todos os ingredientes secos numa tigela.', idreceitas: 1 },
            { ordem: 3, descricao: 'Adicione os ingredientes líquidos e misture bem.', idreceitas: 1 },
            { ordem: 4, descricao: 'Despeje a massa em uma forma untada e leve ao forno por 30 minutos.', idreceitas: 1 },
            { ordem: 1, descricao: 'Cozinhe a massa para lasanha de acordo com as instruções da embalagem.', idreceitas: 2 },
            { ordem: 2, descricao: 'Em uma panela, refogue a carne moída até dourar.', idreceitas: 2 },
            { ordem: 3, descricao: 'Adicione o molho de tomate à carne e deixe cozinhar por alguns minutos.', idreceitas: 2 },
            { ordem: 4, descricao: 'Numa forma, faça camadas alternadas de massa, molho de carne e queijo.', idreceitas: 2 },
            { ordem: 5, descricao: 'Repita as camadas até terminarem os ingredientes, finalizando com queijo.', idreceitas: 2 },
            { ordem: 6, descricao: 'Leve ao forno preaquecido a 180°C por 30 minutos ou até dourar.', idreceitas: 2 },
            { ordem: 1, descricao: 'Lave e corte as folhas de alface.', idreceitas: 3 },
            { ordem: 2, descricao: 'Prepare o molho Caesar misturando os ingredientes em um recipiente.', idreceitas: 3 },
            { ordem: 3, descricao: 'Em uma tigela grande, misture as folhas de alface com o molho Caesar.', idreceitas: 3 },
            { ordem: 4, descricao: 'Adicione os croutons por cima da salada.', idreceitas: 3 },
            { ordem: 5, descricao: 'Sirva imediatamente.', idreceitas: 3 },
            { ordem: 1, descricao: 'Corte os legumes em pedaços pequenos.', idreceitas: 4 },
            { ordem: 2, descricao: 'Refogue os legumes em uma panela com um pouco de azeite.', idreceitas: 4 },
            { ordem: 3, descricao: 'Adicione água e deixe cozinhar até os legumes ficarem macios.', idreceitas: 4 },
            { ordem: 4, descricao: 'Tempere com sal e pimenta a gosto.', idreceitas: 4 },
            { ordem: 5, descricao: 'Sirva quente.', idreceitas: 4 },
            { ordem: 1, descricao: 'Tempere o frango com sal, pimenta e azeite.', idreceitas: 5 },
            { ordem: 2, descricao: 'Leve o frango ao forno preaquecido a 200°C por 45 minutos.', idreceitas: 5 },
            { ordem: 3, descricao: 'Vire o frango na metade do tempo para dourar dos dois lados.', idreceitas: 5 },
            { ordem: 4, descricao: 'Sirva o frango com batatas assadas.', idreceitas: 5 },
            { ordem: 1, descricao: 'Prepare a massa da pizza e deixe descansar por 30 minutos.', idreceitas: 6 },
            { ordem: 2, descricao: 'Abra a massa em uma superfície enfarinhada.', idreceitas: 6 },
            { ordem: 3, descricao: 'Espalhe molho de tomate sobre a massa.', idreceitas: 6 },
            { ordem: 4, descricao: 'Adicione fatias de queijo e folhas de manjericão.', idreceitas: 6 },
            { ordem: 5, descricao: 'Leve ao forno preaquecido a 220°C por 15 minutos ou até a massa ficar crocante.', idreceitas: 6 },
            { ordem: 6, descricao: 'Sirva quente.', idreceitas: 6 },
            { ordem: 1, descricao: 'Bata as gemas com o açúcar até obter um creme claro.', idreceitas: 7 },
            { ordem: 2, descricao: 'Adicione o mascarpone e misture bem.', idreceitas: 7 },
            { ordem: 3, descricao: 'Molhe os biscoitos champagne no café e coloque-os em uma forma.', idreceitas: 7 },
            { ordem: 4, descricao: 'Cubra os biscoitos com o creme de mascarpone.', idreceitas: 7 },
            { ordem: 5, descricao: 'Repita as camadas até terminarem os ingredientes.', idreceitas: 7 },
            { ordem: 6, descricao: 'Leve à geladeira por pelo menos 4 horas antes de servir.', idreceitas: 7 },
            { ordem: 1, descricao: 'Tempere o bife com sal e pimenta.', idreceitas: 8 },
            { ordem: 2, descricao: 'Aqueça uma frigideira com um pouco de azeite.', idreceitas: 8 },
            { ordem: 3, descricao: 'Grelhe o bife até o ponto desejado.', idreceitas: 8 },
            { ordem: 4, descricao: 'Sirva o bife com batatas fritas.', idreceitas: 8 },
            { ordem: 1, descricao: 'Refogue a cebola no azeite até dourar.', idreceitas: 9 },
            { ordem: 2, descricao: 'Adicione o bacalhau desfiado e refogue por alguns minutos.', idreceitas: 9 },
            { ordem: 3, descricao: 'Misture a batata palha e os ovos batidos.', idreceitas: 9 },
            { ordem: 4, descricao: 'Cozinhe até os ovos ficarem firmes, mexendo constantemente.', idreceitas: 9 },
            { ordem: 5, descricao: 'Adicione a salsa picada e sirva quente.', idreceitas: 9 },
            { ordem: 1, descricao: 'Refogue os cogumelos no azeite até ficarem macios.', idreceitas: 10 },
            { ordem: 2, descricao: 'Adicione o arroz arbóreo e refogue por alguns minutos.', idreceitas: 10 },
            { ordem: 3, descricao: 'Adicione o caldo de legumes, uma concha de cada vez, mexendo sempre até ser absorvido.', idreceitas: 10 },
            { ordem: 4, descricao: 'Repita até o arroz estar al dente e cremoso.', idreceitas: 10 },
            { ordem: 5, descricao: 'Adicione o queijo parmesão ralado e misture bem. Sirva quente.', idreceitas: 10 }

        ]);

        await ingredientes.bulkCreate([
            { nome: 'Farinha de trigo' },
            { nome: 'Açúcar' },
            { nome: 'Ovo' },
            { nome: 'Leite' },
            { nome: 'Chocolate em pó' },
            { nome: 'Carne moída' },
            { nome: 'Molho de tomate' },
            { nome: 'Massa para lasanha' },
            { nome: 'Queijo mussarela' },
            { nome: 'Queijo parmesão' },
            { nome: 'Alface' },
            { nome: 'Frango' },
            { nome: 'Molho Caesar' },
            { nome: 'Croutons' },
            { nome: 'Legumes variados' },
            { nome: 'Batatas' },
            { nome: 'Massa de pizza' },
            { nome: 'Manjericão' },
            { nome: 'Mascarpone' },
            { nome: 'Biscoitos champagne' },
            { nome: 'Café' },
            { nome: 'Bife' },
            { nome: 'Bacalhau desfiado' },
            { nome: 'Batata palha' },
            { nome: 'Cebola' },
            { nome: 'Ovos' },
            { nome: 'Azeite' },
            { nome: 'Salsa' },
            { nome: 'Cogumelos frescos' },
            { nome: 'Arroz arbóreo' },
            { nome: 'Caldo de legumes' },
            { nome: 'Queijo parmesão ralado' }
        ]);

        await receita_ingredientes.bulkCreate([
            { quantidade: '2', unidade: 'chávenas', idIngrediente: 1, idreceitas: 1 },
            { quantidade: '2', unidade: 'chávenas', idIngrediente: 2, idreceitas: 1 },
            { quantidade: '4', unidade: 'unidades', idIngrediente: 3, idreceitas: 1 },
            { quantidade: '1', unidade: 'chávena', idIngrediente: 4, idreceitas: 1 },
            { quantidade: '1/2', unidade: 'chávena', idIngrediente: 5, idreceitas: 1 },
            { quantidade: '500', unidade: 'g', idIngrediente: 6, idreceitas: 2 },
            { quantidade: '500', unidade: 'ml', idIngrediente: 7, idreceitas: 2 },
            { quantidade: '1', unidade: 'pacote', idIngrediente: 8, idreceitas: 2 },
            { quantidade: '300', unidade: 'g', idIngrediente: 9, idreceitas: 2 },
            { quantidade: '100', unidade: 'g', idIngrediente: 10, idreceitas: 2 },
            { quantidade: '1', unidade: 'cabeça', idIngrediente: 11, idreceitas: 3 },
            { quantidade: '200', unidade: 'g', idIngrediente: 12, idreceitas: 3 },
            { quantidade: '1/2', unidade: 'chávena', idIngrediente: 13, idreceitas: 3 },
            { quantidade: '1', unidade: 'chávena', idIngrediente: 14, idreceitas: 3 },
            { quantidade: '2', unidade: 'chávenas', idIngrediente: 15, idreceitas: 4 },
            { quantidade: '1', unidade: 'kg', idIngrediente: 12, idreceitas: 5 },
            { quantidade: '500', unidade: 'g', idIngrediente: 16, idreceitas: 5 },
            { quantidade: '1', unidade: 'massa', idIngrediente: 17, idreceitas: 6 },
            { quantidade: '200', unidade: 'g', idIngrediente: 9, idreceitas: 6 },
            { quantidade: '1', unidade: 'maço', idIngrediente: 18, idreceitas: 6 },
            { quantidade: '4', unidade: 'unidades', idIngrediente: 3, idreceitas: 7 },
            { quantidade: '1', unidade: 'xicara', idIngrediente: 2, idreceitas: 7 },
            { quantidade: '250', unidade: 'g', idIngrediente: 19, idreceitas: 7 },
            { quantidade: '200', unidade: 'g', idIngrediente: 20, idreceitas: 7 },
            { quantidade: '1', unidade: 'xicara', idIngrediente: 21, idreceitas: 7 },
            { quantidade: '500', unidade: 'g', idIngrediente: 22, idreceitas: 8 },
            { quantidade: '500', unidade: 'g', idIngrediente: 16, idreceitas: 8 },
            { quantidade: '500', unidade: 'g', idIngrediente: 23, idreceitas: 9 },
            { quantidade: '200', unidade: 'g', idIngrediente: 24, idreceitas: 9 },
            { quantidade: '2', unidade: 'unidades', idIngrediente: 25, idreceitas: 9 },
            { quantidade: '4', unidade: 'unidades', idIngrediente: 26, idreceitas: 9 },
            { quantidade: '100', unidade: 'ml', idIngrediente: 27, idreceitas: 9 },
            { quantidade: '1', unidade: 'ramo', idIngrediente: 28, idreceitas: 9 },
            { quantidade: '200', unidade: 'g', idIngrediente: 29, idreceitas: 10 },
            { quantidade: '300', unidade: 'g', idIngrediente: 30, idreceitas: 10 },
            { quantidade: '1', unidade: 'litro', idIngrediente: 31, idreceitas: 10 },
            { quantidade: '100', unidade: 'g', idIngrediente: 32, idreceitas: 10 }
        ]);

        await receitas_restaurantes.bulkCreate([
            { idreceitas: 1, idRestaurante: 1 },
            { idreceitas: 1, idRestaurante: 2 },
            { idreceitas: 2, idRestaurante: 1 },
            { idreceitas: 2, idRestaurante: 4 },
            { idreceitas: 3, idRestaurante: 3 },
            { idreceitas: 4, idRestaurante: 2 },
            { idreceitas: 4, idRestaurante: 4 },
            { idreceitas: 5, idRestaurante: 3 },
            { idreceitas: 5, idRestaurante: 4 },
            { idreceitas: 6, idRestaurante: 1 },
            { idreceitas: 6, idRestaurante: 3 },
            { idreceitas: 7, idRestaurante: 2 },
            { idreceitas: 7, idRestaurante: 4 },
            { idreceitas: 8, idRestaurante: 1 },
            { idreceitas: 8, idRestaurante: 3 },
            { idreceitas: 9, idRestaurante: 2 },
            { idreceitas: 9, idRestaurante: 4 },
            { idreceitas: 10, idRestaurante: 1 },
            { idreceitas: 10, idRestaurante: 3 }
        ]);

        await ingredientes_rr.bulkCreate([
            { quantidade: '2', unidade: 'chávenas', idIngrediente: 1, idRecRest: 1 },
            { quantidade: '2', unidade: 'chávenas', idIngrediente: 2, idRecRest: 1 },
            { quantidade: '4', unidade: 'unidades', idIngrediente: 3, idRecRest: 1 },
            { quantidade: '1', unidade: 'chávena', idIngrediente: 4, idRecRest: 1 },
            { quantidade: '1/2', unidade: 'chávena', idIngrediente: 5, idRecRest: 1 },
            { quantidade: '500', unidade: 'g', idIngrediente: 6, idRecRest: 2 },
            { quantidade: '500', unidade: 'ml', idIngrediente: 7, idRecRest: 2 },
            { quantidade: '1', unidade: 'pacote', idIngrediente: 8, idRecRest: 2 },
            { quantidade: '300', unidade: 'g', idIngrediente: 9, idRecRest: 2 },
            { quantidade: '100', unidade: 'g', idIngrediente: 10, idRecRest: 2 },
            { quantidade: '1', unidade: 'cabeça', idIngrediente: 11, idRecRest: 3 },
            { quantidade: '200', unidade: 'g', idIngrediente: 12, idRecRest: 3 },
            { quantidade: '1/2', unidade: 'chávena', idIngrediente: 13, idRecRest: 3 },
            { quantidade: '1', unidade: 'chávena', idIngrediente: 14, idRecRest: 3 },
            { quantidade: '2', unidade: 'chávenas', idIngrediente: 15, idRecRest: 4 },
            { quantidade: '1', unidade: 'kg', idIngrediente: 12, idRecRest: 5 },
            { quantidade: '500', unidade: 'g', idIngrediente: 16, idRecRest: 5 },
            { quantidade: '1', unidade: 'massa', idIngrediente: 17, idRecRest: 6 },
            { quantidade: '200', unidade: 'g', idIngrediente: 9, idRecRest: 6 },
            { quantidade: '1', unidade: 'maço', idIngrediente: 18, idRecRest: 6 },
            { quantidade: '4', unidade: 'unidades', idIngrediente: 3, idRecRest: 7 },
            { quantidade: '1', unidade: 'xicara', idIngrediente: 2, idRecRest: 7 },
            { quantidade: '250', unidade: 'g', idIngrediente: 19, idRecRest: 7 },
            { quantidade: '200', unidade: 'g', idIngrediente: 20, idRecRest: 7 },
            { quantidade: '1', unidade: 'xicara', idIngrediente: 21, idRecRest: 7 },
            { quantidade: '500', unidade: 'g', idIngrediente: 22, idRecRest: 8 },
            { quantidade: '500', unidade: 'g', idIngrediente: 16, idRecRest: 8 }
        ]);

        await pedidos_parcerias.bulkCreate([
            { idPedido: 1, statusPedido: 'Pendente', idutilizador: 4, idRestaurante: 1 },
            { idPedido: 2, statusPedido: 'Aceite', idutilizador: 5, idRestaurante: 2 },
            { idPedido: 3, statusPedido: 'Recusado', idutilizador: 6, idRestaurante: 3 }
        ]);

        await publicidades.bulkCreate([
            { idPublicidade: 1, descricao: 'Promoção especial', idRestaurante: 1 },
            { idPublicidade: 2, descricao: 'Desconto de 20%', idRestaurante: 2 },
            { idPublicidade: 3, descricao: 'Nova receita', idRestaurante: 3 }
        ]);

        await planos.bulkCreate([
            { tipoPlano: 'Plano Básico', valor: 0, prioridade: 'Baixa', descricao: 'Plano gratuito com acesso limitado aos recursos.' },
            { tipoPlano: 'Plano Silver', valor: 5.99, prioridade: 'Média', descricao: 'Plano Silver.' },
            { tipoPlano: 'Plano Gold', valor: 7.99, prioridade: 'Alta', descricao: 'Plano Gold' }
        ]);

        await assinaturas_clientes.bulkCreate([
    
            { idAssinatura: 1, dataInicio: '2024-01-01', statusAss: 'Ativo', idutilizador: 4, idRestaurante: 1, idPlano: 2 },
            { idAssinatura: 2, dataInicio: '2023-12-01', statusAss: 'Ativo', idutilizador: 5, idRestaurante: 2, idPlano: 3},
            { idAssinatura: 3, dataInicio: '2024-02-01', statusAss: 'Inativo', idutilizador: 6, idRestaurante: 3, idPlano: 1},
            { idAssinatura: 4, dataInicio: '2024-03-01', statusAss: 'Ativo', idutilizador: 7, idRestaurante: 4, idPlano: 2},
            { idAssinatura: 5, dataInicio: '2024-04-01', statusAss: 'Ativo', idutilizador: 4, idRestaurante: 5, idPlano: 3},
            { idAssinatura: 6, dataInicio: '2024-05-01', statusAss: 'Inativo', idutilizador: 4, idRestaurante: 6, idPlano: 1},
            { idAssinatura: 7, dataInicio: '2024-06-01', statusAss: 'Ativo', idutilizador: 4, idRestaurante: 7, idPlano: 2},
            { idAssinatura: 8, dataInicio: '2024-07-01', statusAss: 'Ativo', idutilizador: 4, idRestaurante: 8, idPlano: 3}
        ]);

        await pagamento_assinaturas.bulkCreate([
            { idPagamento: 1, dataPagamento: '2024-01-15', metodoPagamento: 'Cartão de Crédito', idAssinatura: 1 },
            { idPagamento: 2, dataPagamento: '2023-12-20', metodoPagamento: 'PayPal', idAssinatura: 2 }
        ]);

        await historico_receitas.bulkCreate([
            { favoritos: true, avaliacao: 5, concluido: true, instrucaoAtual: 4, idreceitas: 1, idutilizador: 1 },
            { favoritos: false, avaliacao: 4, concluido: true, instrucaoAtual: 3, idreceitas: 2, idutilizador: 1 },
            { favoritos: true, avaliacao: 3, concluido: false, instrucaoAtual: null, idreceitas: 3, idutilizador: 1 },
            { favoritos: true, avaliacao: 5, concluido: true, instrucaoAtual: 4, idreceitas: 4, idutilizador: 1 },
            { favoritos: false, avaliacao: 2, concluido: false, instrucaoAtual: 2, idreceitas: 5, idutilizador: 1 },
            
            { favoritos: true, avaliacao: 5, concluido: true, instrucaoAtual: 4, idreceitas: 1, idutilizador: 2 },
            { favoritos: false, avaliacao: 3, concluido: true, instrucaoAtual: 3, idreceitas: 2, idutilizador: 2 },
            { favoritos: false, avaliacao: 4, concluido: false, instrucaoAtual: null, idreceitas: 3, idutilizador: 2 },
            { favoritos: true, avaliacao: 5, concluido: true, instrucaoAtual: 5, idreceitas: 6, idutilizador: 2 },
            { favoritos: false, avaliacao: 4, concluido: true, instrucaoAtual: 3, idreceitas: 7, idutilizador: 2 },
        
            { favoritos: true, avaliacao: 5, concluido: true, instrucaoAtual: 4, idreceitas: 1, idutilizador: 3 },
            { favoritos: true, avaliacao: 4, concluido: true, instrucaoAtual: 3, idreceitas: 2, idutilizador: 3 },
            { favoritos: false, avaliacao: 3, concluido: false, instrucaoAtual: null, idreceitas: 3, idutilizador: 3 },
            { favoritos: true, avaliacao: 5, concluido: true, instrucaoAtual: 4, idreceitas: 8, idutilizador: 3 },
            { favoritos: false, avaliacao: 3, concluido: true, instrucaoAtual: 2, idreceitas: 9, idutilizador: 3 },
            
            { favoritos: true, avaliacao: 5, concluido: true, instrucaoAtual: 4, idreceitas: 1, idutilizador: 4 },
            { favoritos: false, avaliacao: 3, concluido: true, instrucaoAtual: 3, idreceitas: 2, idutilizador: 4 },
            { favoritos: false, avaliacao: 4, concluido: false, instrucaoAtual: null, idreceitas: 3, idutilizador: 4 },
            { favoritos: true, avaliacao: 4, concluido: true, instrucaoAtual: 4, idreceitas: 10, idutilizador: 4 },
            { favoritos: false, avaliacao: 3, concluido: true, instrucaoAtual: 2, idreceitas: 7, idutilizador: 4 },
        
            { favoritos: true, avaliacao: 5, concluido: true, instrucaoAtual: 4, idreceitas: 1, idutilizador: 5 },
            { favoritos: true, avaliacao: 4, concluido: true, instrucaoAtual: 3, idreceitas: 2, idutilizador: 5 },
            { favoritos: false, avaliacao: 3, concluido: false, instrucaoAtual: null, idreceitas: 3, idutilizador: 5 },
            { favoritos: true, avaliacao: 4, concluido: true, instrucaoAtual: 4, idreceitas: 5, idutilizador: 5 },
            { favoritos: false, avaliacao: 3, concluido: true, instrucaoAtual: 2, idreceitas: 8, idutilizador: 5 },
        
            { favoritos: true, avaliacao: 5, concluido: true, instrucaoAtual: 4, idreceitas: 1, idutilizador: 6 },
            { favoritos: false, avaliacao: 3, concluido: true, instrucaoAtual: 3, idreceitas: 2, idutilizador: 6 },
            { favoritos: false, avaliacao: 4, concluido: false, instrucaoAtual: null, idreceitas: 3, idutilizador: 6 },
            { favoritos: true, avaliacao: 4, concluido: true, instrucaoAtual: 4, idreceitas: 7, idutilizador: 6 },
            { favoritos: false, avaliacao: 3, concluido: true, instrucaoAtual: 2, idreceitas: 9, idutilizador: 6 },
        
            { favoritos: true, avaliacao: 5, concluido: true, instrucaoAtual: 4, idreceitas: 1, idutilizador: 7 },
            { favoritos: true, avaliacao: 3, concluido: true, instrucaoAtual: 3, idreceitas: 2, idutilizador: 7 },
            { favoritos: false, avaliacao: 4, concluido: false, instrucaoAtual: null, idreceitas: 3, idutilizador: 7 },
            { favoritos: true, avaliacao: 4, concluido: true, instrucaoAtual: 4, idreceitas: 5, idutilizador: 7 },
            { favoritos: false, avaliacao: 3, concluido: true, instrucaoAtual: 2, idreceitas: 10, idutilizador: 7 }
        ]);

        await comentarios.bulkCreate([
            { idComentarios: 1, comentario: 'Adorei esta receita! Muito fácil de fazer e deliciosa.', dataComentario: '2024-04-20', statusComentario: true, notasAdmin: null, idutilizador: 1, idreceitas: 1 },
            { idComentarios: 2, comentario: 'Esta receita é um sucesso na minha família! Obrigado por compartilhar.', dataComentario: '2024-04-21', statusComentario: true, notasAdmin: null, idutilizador: 2, idreceitas: 1 },
            { idComentarios: 3, comentario: 'Achei que a massa ficou um pouco seca. Talvez precise ajustar a quantidade de líquido.', dataComentario: '2024-04-22', statusComentario: true, notasAdmin: null, idutilizador: 3, idreceitas: 1 },
            { idComentarios: 4, comentario: 'Essa lasanha é incrível! Fiz para o jantar de família e todos adoraram.', dataComentario: '2024-04-20', statusComentario: true, notasAdmin: null, idutilizador: 1, idreceitas: 2 },
            { idComentarios: 5, comentario: 'Gostei bastante, mas achei que poderia ter um pouco mais de queijo.', dataComentario: '2024-04-21', statusComentario: true, notasAdmin: null, idutilizador: 2, idreceitas: 2 },
            { idComentarios: 6, comentario: 'Esta salada é refrescante e deliciosa! Ótima para dias quentes.', dataComentario: '2024-04-22', statusComentario: true, notasAdmin: null, idutilizador: 1, idreceitas: 3 },
            { idComentarios: 7, comentario: 'Prefiro saladas com um molho mais leve, mas esta é uma boa opção para variar.', dataComentario: '2024-04-23', statusComentario: true, notasAdmin: null, idutilizador: 3, idreceitas: 3 },
            { idComentarios: 8, comentario: 'Adorei esta receita! Muito fácil de fazer e deliciosa.', dataComentario: '2024-04-20', statusComentario: true, notasAdmin: null, idutilizador: 2, idreceitas: 2 },
            { idComentarios: 9, comentario: 'Esta receita é um sucesso na minha família! Obrigado por compartilhar.', dataComentario: '2024-04-21', statusComentario: true, notasAdmin: null, idutilizador: 3, idreceitas: 2 },
            { idComentarios: 10, comentario: 'Achei que a massa ficou um pouco seca. Talvez precise ajustar a quantidade de líquido.', dataComentario: '2024-04-22', statusComentario: true, notasAdmin: null, idutilizador: 1, idreceitas: 2 },
            { idComentarios: 11, comentario: 'O bolo ficou incrível! Minha família adorou.', dataComentario: '2024-04-25', statusComentario: true, notasAdmin: null, idutilizador: 4, idreceitas: 1 },
            { idComentarios: 12, comentario: 'A lasanha poderia ter mais molho, mas estava boa.', dataComentario: '2024-04-26', statusComentario: true, notasAdmin: null, idutilizador: 5, idreceitas: 2 },
            { idComentarios: 13, comentario: 'Essa salada é perfeita para o verão!', dataComentario: '2024-04-27', statusComentario: true, notasAdmin: null, idutilizador: 6, idreceitas: 3 },
            { idComentarios: 14, comentario: 'A sopa estava um pouco sem sal, mas nada que não se possa ajustar.', dataComentario: '2024-04-28', statusComentario: true, notasAdmin: null, idutilizador: 7, idreceitas: 4 },
            { idComentarios: 15, comentario: 'Frango bem temperado e suculento. Muito bom!', dataComentario: '2024-04-29', statusComentario: true, notasAdmin: null, idutilizador: 1, idreceitas: 5 },
            { idComentarios: 16, comentario: 'Pizza deliciosa, mas a massa poderia ser um pouco mais fina.', dataComentario: '2024-04-30', statusComentario: true, notasAdmin: null, idutilizador: 2, idreceitas: 6 },
            { idComentarios: 17, comentario: 'O tiramisu ficou perfeito! Muito autêntico.', dataComentario: '2024-05-01', statusComentario: true, notasAdmin: null, idutilizador: 3, idreceitas: 7 },
            { idComentarios: 18, comentario: 'Bife suculento e bem preparado. Recomendo!', dataComentario: '2024-05-02', statusComentario: true, notasAdmin: null, idutilizador: 4, idreceitas: 8 },
            { idComentarios: 19, comentario: 'Bacalhau à Brás muito bem feito. Adorámos.', dataComentario: '2024-05-03', statusComentario: true, notasAdmin: null, idutilizador: 5, idreceitas: 9 },
            { idComentarios: 20, comentario: 'Risoto cremoso e saboroso. Excelente receita.', dataComentario: '2024-05-04', statusComentario: true, notasAdmin: null, idutilizador: 6, idreceitas: 10 }
        ]);

        await foto_categoria.bulkCreate([
            { idFoto: 1, fotoURL: 'https://exemplo.com/restaurante1.jpg', alt: 'Foto do Restaurante 1', objetoID: 1 },
            { idFoto: 2, fotoURL: 'https://exemplo.com/restaurante2.jpg', alt: 'Foto do Restaurante 2', objetoID: 2 },
            { idFoto: 3, fotoURL: 'https://exemplo.com/bolo-chocolate.jpg', alt: 'Foto do Bolo de Chocolate', objetoID: 1 },
            { idFoto: 4, fotoURL: 'https://exemplo.com/lasanha-bolonhesa.jpg', alt: 'Foto da Lasanha à Bolonhesa', objetoID: 2 },
            { idFoto: 5, fotoURL: 'https://exemplo.com/salada-caesar.jpg', alt: 'Foto da Salada Caesar', objetoID: 3 }
        ]);

        await dicas.bulkCreate([
            { texto: "Se a tua refeição ficar queimada, chama-lhe 'culinária gourmet com notas fumadas' e cobra o dobro." },
            { texto: "A melhor forma de descascar cebolas sem chorar é pedir a alguém para as descascar por ti." },
            { texto: "Se o teu bolo não crescer, chama-lhe 'pudim denso' e finge que era essa a intenção." },
            { texto: "A regra dos 5 segundos não se aplica a molhos. Esses têm direito a 10 segundos no chão." },
            { texto: "Se adicionares demasiado sal à comida, serve-a com uma garrafa de água e chama-lhe 'experiência gastronómica interativa'." },
            { texto: "O segredo para fazer um ótimo café é adicionar chocolate quente e chamar-lhe mochaccino." },
            { texto: "Se o teu prato não ficar bem, cobre-o com queijo derretido. O queijo resolve tudo." },
            { texto: "A melhor forma de evitar cortar os dedos ao cortar cebolas é usar uma espada laser. Bónus: as cebolas ficam pré-grelhadas!" },
            { texto: "Se o teu prato sair insosso, chama-lhe 'minimalista' e diz que é uma tendência de alta gastronomia." },
            { texto: "Se o teu soufflé não subir, chama-lhe 'soufflé à la plancha' e inventa uma história sobre tradições culinárias esquecidas." },
            { texto: "Para dar um toque gourmet às tuas torradas queimadas, raspa-as e chama-lhes 'torradas com crosta caramelizada'." },
            { texto: "Se a tua sobremesa não solidificar, chama-lhe 'gelatina líquida' e diz que é uma sobremesa molecular." },
            { texto: "Quando a sopa estiver demasiado salgada, adiciona batatas. Quando as batatas não resolverem, chama a sopa de 'caldo forte'." },
            { texto: "Se não consegues fazer uma omelete sem a partir, chama-lhe 'ovos mexidos especiais'." },
            { texto: "Se o teu molho separar, chama-lhe 'molho deconstruído' e diz que é alta cozinha." },
            { texto: "Se a massa ficar demasiado cozida, chama-lhe 'pasta all'onda' e diz que aprendeste num curso de culinária em Itália." },
            { texto: "Se o teu assado ficar seco, serve-o com um molho e diz que é para 'enfatizar a textura'." },
            { texto: "Se não consegues fazer sushi, chama-lhe 'desconstrução de sushi' e sirva todos os ingredientes separadamente." },
            { texto: "Quando o frango ficar cru por dentro, diz que é um 'estilo tartare' inovador." },
            { texto: "Se o teu molho carbonara virar ovos mexidos, chama-lhe 'carbonara à portuguesa' e diz que é a tua versão." }
        ]);
        

        console.log('Base de dados populada com sucesso');
    } catch (error) {
        console.error('Erro ao popular a base de dados:', error);
    }
};

// Exporta a função para ser utilizada noutros ficheiros
module.exports = seedDatabase;
