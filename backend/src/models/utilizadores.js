// models/utilizadores.js

const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    const Utilizadores = sequelize.define(
        "utilizadores",
        {
            idutilizador: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            senha: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            idTipo: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 2, // 2 para 'user', 1 para 'administrador'
            },
            ultimoLogin: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            estaLogado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            bloqueado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            hooks: {
                beforeCreate: (utilizador, options) => {
                    delete utilizador.dataValues.idutilizador;
                }
            }
        }
    );

    Utilizadores.associate = function (models) {
        Utilizadores.belongsTo(models.tipo_utilizador, { foreignKey: "idTipo" });
        Utilizadores.hasMany(models.restaurantes, { foreignKey: "idutilizador" });
        Utilizadores.hasMany(models.assinaturas_clientes, { foreignKey: 'idutilizador' });
    };

    // Função para encriptar a pass antes de salvar
    Utilizadores.beforeCreate(async (utilizador) => {
        utilizador.senha = await bcrypt.hash(utilizador.senha, 10);
    });

    return Utilizadores;
};