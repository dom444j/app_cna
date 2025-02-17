module.exports = (sequelize, DataTypes) => {
    const UnilevelTree = sequelize.define("UnilevelTree", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id"
            }
        },
        sponsor_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id"
            }
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: "unilevel_tree",
        timestamps: false
    });

    // ✅ Asociaciones
    UnilevelTree.associate = (models) => {
        UnilevelTree.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
        UnilevelTree.belongsTo(models.User, { foreignKey: "sponsor_id", as: "sponsor" });
    };

    return UnilevelTree;
};
