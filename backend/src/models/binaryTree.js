const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const BinaryTree = sequelize.define("BinaryTree", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // La tabla referenciada
                key: 'id'
            }
        },
        sponsor_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users', // La tabla referenciada
                key: 'id'
            }
        },
        left_leg: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        right_leg: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        total_points: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: "binary_tree",
        timestamps: false
    });

    // En src/models/binaryTree.js

BinaryTree.associate = (models) => {
    // Relación con el usuario (el "propietario" de este registro en el binario)
    BinaryTree.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user" // Puedes cambiar "user" por "usuario" si prefieres
    });

    // Relación con el patrocinador
    BinaryTree.belongsTo(models.User, {
        foreignKey: "sponsor_id",
        as: "sponsor" // Puedes cambiar "sponsor" por "patrocinador" si prefieres
    });
};

return BinaryTree;

};
