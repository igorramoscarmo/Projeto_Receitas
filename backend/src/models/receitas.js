module.exports = (sequelize, DataTypes) => {
    const Receitas = sequelize.define('receitas', {
        idreceitas: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true 
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        dificuldade: {
            type: DataTypes.STRING,
            allowNull: false
        },
        folder: {
            type: DataTypes.STRING,
            allowNull: false
        },
        bannerImage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ativoCarousel: DataTypes.BOOLEAN,
        visitas: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        arquivada: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
    
        tableName: 'receitas' 
        
    });

    Receitas.associate = function(models) {
        Receitas.hasMany(models.historico_receitas, { foreignKey: 'idreceitas' });
        Receitas.hasMany(models.comentarios, { foreignKey: 'idreceitas' });
        Receitas.hasMany(models.instrucoes, { foreignKey: 'idreceitas' });
        Receitas.belongsToMany(models.categorias, { 
            through: 'receita_categorias',
            foreignKey: 'idreceitas',
            otherKey: 'idCategorias'
        });
        Receitas.belongsToMany(models.ingredientes, { 
            through: 'receita_ingredientes',
            foreignKey: 'idreceitas',
            otherKey: 'idIngrediente'
        });
        Receitas.hasMany(models.receitas_restaurantes, { foreignKey: 'idreceitas' });
    };

    return Receitas;
};