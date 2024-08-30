/* --------------------------------------------------------------------

    Ficheiro que contém o middleware para verificar se o utilizador é administrador.

--------------------------------------------------------------------- */


// Função para verificar se o utilizador é administrador
const verifyAdmin = (req, res, next) => {
    console.log('Verificando permissões de administrador...');
    if (req.user && req.user.idTipo === 1) {
        console.log('Utilizador autenticado é administrador. Acesso permitido.');
        next();
    } else {
        console.log('Acesso negado. Utilizador não é administrador.');
        res.status(403).json({ message: "Acesso negado. Apenas administradores podem aceder a este recurso." });
    }
};

module.exports = verifyAdmin;